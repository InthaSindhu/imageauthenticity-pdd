import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
  baseUrl: process.env.TEST_BASE_URL || 'http://localhost:5173',
  browser: process.env.BROWSER || 'chrome',
  headless: process.env.HEADLESS !== 'false', // Default to true for automated runner
  timeout: {
    implicit: 10000,
    pageLoad: 30000,
    explicit: 15000
  },
  reportsDir: path.resolve(__dirname, '../reports'),
  screenshotsDir: path.resolve(__dirname, '../reports/screenshots'),
  reportFileName: 'Image_Authenticity_E2E_Selenium_Report.xlsx'
};
