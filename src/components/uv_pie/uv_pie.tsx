import React, { memo, useEffect, useRef } from 'react';

import uvDevice from '@uv-tech/util/lib/uv-device';
import uvObject from  '@uv-tech/util/lib/uv-object';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_material from "@amcharts/amcharts4/themes/material";

import './uv_pie.css';
import { UVCategory, UVAmount } from '../../shared/Types';
import { useDispatch } from 'react-redux';
import { selectedPieSlice } from './uv_pie.actions';

am4core.useTheme(am4themes_material);
am4core.useTheme(am4themes_animated);

function UvPie(props: any) {

  const dispatch = useDispatch();

  const chart = useRef({});


  let pieConfig = props.config;
  let pieData = props.data.categories;

  useEffect(() => {
    if(!pieConfig || !pieData) {
      return;
    }
    let valueType = 'current';

    function getSectorTotal(category: UVCategory) {
      let total = 0;
      for (const item of category.items) {
        let itemValue = item[valueType] as UVAmount;
        if(category.isAmountOnly && itemValue && itemValue.amount) {
          total += itemValue.amount;
        } else if(itemValue && itemValue.price && itemValue.quantity){
          total += itemValue.price * itemValue.quantity;
        }
      }
      return total;
    }

    function getProcessedData(sectors: UVCategory[]) {
      const processedSectors = [];
      for (const sector of sectors) {
        sector.value = getSectorTotal(sector);
        if (sector.value > 0) {
          processedSectors.push(sector);
        }
      }
      return processedSectors;
    }

    const uvChart = am4core.create('pieDiv', am4charts.PieChart3D);

    uvChart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    uvChart.data = getProcessedData(pieData);

      const series = uvChart.series.push(new am4charts.PieSeries3D());

      series.dataFields.value = 'value';
      series.dataFields.category = pieConfig.series.categoryKey;
      series.slices.template.propertyFields.fill = pieConfig.series.fillColorKey;
      series.slices.template.propertyFields.isActive = 'isActive';
      series.slices.template.propertyFields.id = 'id';

      const cursorStyle = uvObject.getObjectByPath(pieConfig, 'series.slices.template', 'cursorStyle', null);

      if(cursorStyle && cursorStyle === 'pointer') {
        series.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
      }
      uvChart.innerRadius = am4core.percent(uvObject.getObjectByPath(pieData, 'config.chart', 'innerRadiusPercent', 0));

      series.slices.template.events.on('hit', ((ev) => {
        const sliceIndex = parseInt(ev.target.id);
        dispatch(selectedPieSlice(props.componentId, sliceIndex));

        series.slices.each(((item) => {
          if (item.isActive && item !== ev.target) {
            item.isActive = false;
          }
        }));
      }));

      if (uvDevice.isMobileDevice()) {
        uvChart.legend = new am4charts.Legend();
        series.labels.template.disabled = true;
      }

      series.labels.template.wrap = uvObject.getObjectByPath(pieConfig, 'label', 'wrap', false);
      series.labels.template.width = uvObject.getObjectByPath(pieConfig, 'label', 'width', 100);
      // default startAngle is -90 and default endAngle is 270
      series.hiddenState.properties.endAngle = uvObject.getObjectByPath(pieData, 'config.series.animation', 'endAngle', 270);

      chart.current = uvChart;

    return () => {
      uvChart.dispose();
    };
  }, [props.componentId, dispatch, pieConfig, pieData]);

  return (
    <div className="pie-container">
      <div id="pieDiv"></div>
    </div>
  );
}

export default memo(UvPie);
