// This file is intended to serve as the single source of truth for all app level configurations.

const APP_CONFIG = {
  decimalPlaces: 2,
  unit: "Lakh",
  font: {
    family: "IBM Plex Serif",
  },
  sessionStorage: {
    appData: "investmentData",
  },
  routes: {
    home: "/",
    investments: "/investments",
    settings: "/settings",
  },
};

export default APP_CONFIG;
