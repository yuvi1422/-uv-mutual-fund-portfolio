import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";

import Grid from "@mui/material/Grid2";
import { useMediaQuery, useTheme } from "@mui/material";

import PieChart from "$/components/PieChart/PieChart";
import BarChart from "$/components/BarChart/BarChart";
import PieChartLegands from "$/components/PieChart/PieChartLegands";

import styles from "$/dashboard/dashboard.module.css";
import { getBarChartData, refineEntireData } from "./DashboardService";
import { iCategory, iSubItem } from "./dashboard.types";
import { BarDatum } from "@nivo/bar";
import Table from "$/components/Table/Table";
import { COMMON, DASHBOARD } from "$/constants/strings.constants";
import { COLORS } from "$/constants/colors.constants";

interface iDashboardPageProps {
  categories: iCategory[];
}

const DashboardPage = ({ categories }: iDashboardPageProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [refinedData, setRefinedData] = useState({
    absoluteValue: 0,
    value: 0,
    categories,
  });
  const [barChartData, setBarChartData] = useState([] as BarDatum[]);
  const [investmentRows, setInvestmentRows] = useState([] as iSubItem[]);

  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(
    0 as number
  );
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    setRefinedData(refineEntireData(categories));
  }, [categories]);

  useEffect(() => {
    setTotalValue(refinedData.value);
    setBarChartData(getBarChartData(refinedData.categories[0]?.items || []));
  }, [refinedData]);

  useEffect(() => {
    console.log();
    setInvestmentRows(
      refinedData.categories?.[selectedCategoryIndex]?.items?.[
        selectedItemIndex
      ]?.subItems || []
    );
  }, [refinedData.categories, selectedCategoryIndex, selectedItemIndex]);

  const handlePieSliceClick = (index: number) => {
    setSelectedCategoryIndex(index);
    setBarChartData(
      getBarChartData(refinedData.categories[index]?.items || [])
    );
  };

  const handleBarClick = (index: number) => {
    setSelectedItemIndex(index);
  };

  const columns = [
    { id: "folio", label: "Folio", numeric: false },
    { id: "goal", label: "Goal", numeric: false },
    { id: "investedValue", label: "Invested Value", numeric: true },
    { id: "currentValue", label: "Current Value", numeric: true },
  ];

  const headerStyles = {
    backgroundColor: COLORS.blue,
  };

  return (
    <Grid
      container
      rowSpacing={{ xs: 5, sm: 5, md: 20, lg: 20 }}
      className={styles.gridContainer}
    >
      {/* Pie Chart */}
      {refinedData?.categories?.length > 0 ? (
        <Grid sx={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
          <Box className={styles.chartContainer}>
            <PieChart
              data={refinedData.categories}
              centralTitle={totalValue || 0}
              handleSliceClick={handlePieSliceClick}
              totalValue={totalValue}
            />
          </Box>
          {/* Pie Chart Legands -- Display on mobile only */}
          {isMobile ? (
            <>
              <div className={styles.legandContainer}>
                {categories.map((item: iCategory) => (
                  <React.Fragment key={`${item.label}_${item.color}`}>
                    <PieChartLegands color={item.color} label={item.label} />
                  </React.Fragment>
                ))}
              </div>
            </>
          ) : null}
        </Grid>
      ) : null}

      {/* Bar Chart Section */}
      {refinedData?.categories?.length > 0 ? (
        <Grid sx={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
          <Box className={styles.chartContainer}>
            <BarChart data={barChartData} handleBarClick={handleBarClick} />
          </Box>
        </Grid>
      ) : null}

      {refinedData?.categories?.length > 0 ? (
        <Grid
          sx={{ xs: 12, sm: 12, md: 6, lg: 6 }}
          offset={{ xs: 0, sm: 0, md: 1, lg: 1 }}
        >
          <Box className={styles.chartContainer}>
            <Table
              columns={columns}
              headerStyles={headerStyles}
              noDataMsg={COMMON.noData}
              rows={investmentRows}
              title={DASHBOARD.table.title}
            />
          </Box>
        </Grid>
      ) : null}
    </Grid>
  );
};

export default DashboardPage;
