const { PlaywrightTestConfig } = require("@playwright/test");

const config = {
  retries: 0,
  timeout: 60000,
  // reporter: "./reporter.js",
  workers: 4,
  use: {
    baseURL: "https://trello.com/",
    headless: true,
    viewport: { width: 1200, height: 720 },
    video: "off",
    screenshot: "off",
    trace: "on",
  },

  projects: [
    {
      name: "Chrome",
      use: { browserName: "chromium" },
    },
    {
      name: "Firefox",
      use: { browserName: "firefox" },
    },
    {
      name: "Webkit",
      use: { browserName: "webkit" },
    },
  ],
};

module.exports = config;
