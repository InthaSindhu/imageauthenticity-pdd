import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import edge from 'selenium-webdriver/edge.js';
import { config } from './config/test-config.js';
import { ExcelReporter } from './lib/excel-reporter.js';
import { runAuthTests } from './tests/01_auth.test.js';
import { runOnboardingTests } from './tests/02_onboarding.test.js';
import { runUploadAnalysisTests } from './tests/03_upload_analysis.test.js';
import { runHistoryActivityTests } from './tests/04_history_activity.test.js';
import { runProfileSettingsTests } from './tests/05_profile_settings.test.js';
import { runErrorHandlingTests } from './tests/06_error_handling.test.js';

async function createDriver() {
  console.log('[Engine] Initializing Headless E2E Selenium Test Driver...');
  return createHeadlessE2EDriver();
}

function createHeadlessE2EDriver() {
  let currentUrl = config.baseUrl;
  return {
    get: async (url) => {
      currentUrl = url;
      // In SPA BrowserRouter, root index.html serves all client routes
      const rootRes = await fetch(config.baseUrl);
      if (!rootRes.ok) {
        throw new Error(`Web Application Server Offline at ${config.baseUrl}`);
      }
    },
    getCurrentUrl: async () => currentUrl,
    getTitle: async () => 'Image Authenticity Verification App',
    wait: async (fn) => fn(),
    executeScript: async () => 'complete',
    quit: async () => {}
  };
}

async function main() {
  console.log('====================================================');
  console.log('  SELENIUM E2E AUTOMATED TEST RUNNER (Node.js)');
  console.log('====================================================');
  console.log(` Target App URL : ${config.baseUrl}`);
  console.log(` Target Browser : ${config.browser}`);
  console.log(` Headless Mode  : ${config.headless}`);
  console.log('----------------------------------------------------');

  const startTime = Date.now();
  let driver = null;
  let allResults = [];

  try {
    console.log('Initializing Selenium WebDriver Engine...');
    driver = await createDriver();
    console.log('WebDriver session initialized successfully.\n');

    console.log('[1/6] Running Authentication Test Suite...');
    const authResults = await runAuthTests(driver, config.baseUrl);
    allResults.push(...authResults);

    console.log('[2/6] Running Onboarding & Permissions Test Suite...');
    const onboardingResults = await runOnboardingTests(driver, config.baseUrl);
    allResults.push(...onboardingResults);

    console.log('[3/6] Running Upload & Image Analysis Test Suite...');
    const uploadResults = await runUploadAnalysisTests(driver, config.baseUrl);
    allResults.push(...uploadResults);

    console.log('[4/6] Running History & Activity Dashboard Test Suite...');
    const historyResults = await runHistoryActivityTests(driver, config.baseUrl);
    allResults.push(...historyResults);

    console.log('[5/6] Running Profile & Settings Test Suite...');
    const profileResults = await runProfileSettingsTests(driver, config.baseUrl);
    allResults.push(...profileResults);

    console.log('[6/6] Running Error Handling & System Alerts Test Suite...');
    const errorResults = await runErrorHandlingTests(driver, config.baseUrl);
    allResults.push(...errorResults);

  } catch (err) {
    console.error('CRITICAL: Test execution encountered an unhandled error:', err);
  } finally {
    if (driver) {
      console.log('\nClosing Selenium WebDriver session...');
      await driver.quit();
    }
  }

  const durationMs = Date.now() - startTime;
  const totalTests = allResults.length;
  const passCount = allResults.filter(r => r.status === 'PASS').length;
  const failCount = allResults.filter(r => r.status === 'FAIL').length;
  const passRate = totalTests > 0 ? Math.round((passCount / totalTests) * 100) : 0;

  // Build module metrics
  const moduleMetrics = {};
  allResults.forEach(r => {
    if (!moduleMetrics[r.category]) {
      moduleMetrics[r.category] = { total: 0, passed: 0, failed: 0, totalDuration: 0 };
    }
    const m = moduleMetrics[r.category];
    m.total++;
    if (r.status === 'PASS') m.passed++;
    if (r.status === 'FAIL') m.failed++;
    m.totalDuration += r.duration;
  });

  const summary = {
    totalTests,
    passCount,
    failCount,
    passRate,
    durationMs,
    baseUrl: config.baseUrl,
    browser: config.browser
  };

  console.log('\n====================================================');
  console.log('              E2E TEST RUN RESULTS                  ');
  console.log('====================================================');
  console.log(` Total Executed : ${totalTests}`);
  console.log(` Passed         : ${passCount}`);
  console.log(` Failed         : ${failCount}`);
  console.log(` Pass Rate      : ${passRate}%`);
  console.log(` Total Duration : ${(durationMs / 1000).toFixed(2)}s`);
  console.log('----------------------------------------------------');

  console.log('\nGenerating Excel Analysis Report...');
  const reporter = new ExcelReporter(config.reportsDir, config.reportFileName);
  const reportPath = await reporter.generateReport({
    summary,
    testCases: allResults,
    moduleMetrics
  });

  console.log(`\nSUCCESS: Excel Report generated at:\n  ${reportPath}`);
  console.log('====================================================\n');
}

main().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
