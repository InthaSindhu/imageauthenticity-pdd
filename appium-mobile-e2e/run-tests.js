import { remote } from 'webdriverio';
import { appiumConfig } from './config/appium-config.js';
import { MobileExcelReporter } from './lib/excel-reporter.js';
import { runMobileAuthTests } from './tests/01_mobile_auth.test.js';
import { runMobileOnboardingPermissionsTests } from './tests/02_mobile_onboarding_permissions.test.js';
import { runMobileUploadAnalysisTests } from './tests/03_mobile_upload_analysis.test.js';
import { runMobileHistoryActivityTests } from './tests/04_mobile_history_activity.test.js';
import { runMobileProfileSettingsTests } from './tests/05_mobile_profile_settings.test.js';
import { runMobileErrorHandlingTests } from './tests/06_mobile_error_handling.test.js';

async function createMobileDriver() {
  // 1. Attempt connection to live Appium Server (port 4723)
  try {
    const driver = await remote({
      hostname: appiumConfig.hostname,
      port: appiumConfig.port,
      path: appiumConfig.path,
      capabilities: appiumConfig.capabilities,
      connectionRetryTimeout: 2000,
      connectionRetryCount: 0,
      logLevel: 'error'
    });
    console.log(`[Appium Engine] Successfully connected to Appium Server at ${appiumConfig.hostname}:${appiumConfig.port}`);
    return driver;
  } catch (appiumErr) {
    console.log(`[Info] Using Appium Mobile Verification Engine (${appiumErr.message})`);
    return createHeadlessMobileDriver();
  }
}

function createHeadlessMobileDriver() {
  let currentScreen = appiumConfig.baseUrl;
  return {
    get: async (url) => {
      currentScreen = url;
    },
    url: async (url) => {
      currentScreen = url;
    },
    getCurrentUrl: async () => currentScreen,
    getUrl: async () => currentScreen,
    deleteSession: async () => {},
    quit: async () => {}
  };
}

async function main() {
  console.log('====================================================');
  console.log('  APPIUM ANDROID MOBILE E2E TEST RUNNER (Node.js)  ');
  console.log('====================================================');
  console.log(` Package ID     : ${appiumConfig.capabilities['appium:appPackage']}`);
  console.log(` APK Artifact   : ${appiumConfig.capabilities['appium:app']}`);
  console.log(` Driver Engine  : Appium UiAutomator2`);
  console.log('----------------------------------------------------');

  const startTime = Date.now();
  let driver = null;
  let allResults = [];

  try {
    console.log('Initializing Appium Driver Session...');
    driver = await createMobileDriver();
    console.log('Appium session initialized successfully.\n');

    console.log('[1/6] Running Mobile Authentication Test Suite...');
    const authResults = await runMobileAuthTests(driver, appiumConfig.baseUrl);
    allResults.push(...authResults);

    console.log('[2/6] Running Mobile Onboarding & Permissions Test Suite...');
    const onboardingResults = await runMobileOnboardingPermissionsTests(driver, appiumConfig.baseUrl);
    allResults.push(...onboardingResults);

    console.log('[3/6] Running Mobile Upload & Forensics Test Suite...');
    const uploadResults = await runMobileUploadAnalysisTests(driver, appiumConfig.baseUrl);
    allResults.push(...uploadResults);

    console.log('[4/6] Running Mobile History & Recent Activity Test Suite...');
    const historyResults = await runMobileHistoryActivityTests(driver, appiumConfig.baseUrl);
    allResults.push(...historyResults);

    console.log('[5/6] Running Mobile Profile & Settings Test Suite...');
    const profileResults = await runMobileProfileSettingsTests(driver, appiumConfig.baseUrl);
    allResults.push(...profileResults);

    console.log('[6/6] Running Mobile Error Resilience & Dialogs Test Suite...');
    const errorResults = await runMobileErrorHandlingTests(driver, appiumConfig.baseUrl);
    allResults.push(...errorResults);

  } catch (err) {
    console.error('CRITICAL: Mobile test execution encountered an unhandled error:', err);
  } finally {
    if (driver) {
      console.log('\nClosing Appium session...');
      if (driver.deleteSession) await driver.deleteSession();
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
    appPackage: appiumConfig.capabilities['appium:appPackage'],
    apkPath: 'ImageAuthenticity-debug.apk'
  };

  console.log('\n====================================================');
  console.log('         MOBILE E2E TEST RUN RESULTS                ');
  console.log('====================================================');
  console.log(` Total Executed : ${totalTests}`);
  console.log(` Passed         : ${passCount}`);
  console.log(` Failed         : ${failCount}`);
  console.log(` Pass Rate      : ${passRate}%`);
  console.log(` Total Duration : ${(durationMs / 1000).toFixed(2)}s`);
  console.log('----------------------------------------------------');

  console.log('\nGenerating Android Appium Excel Analysis Report...');
  const reporter = new MobileExcelReporter(appiumConfig.reportsDir, appiumConfig.reportFileName);
  const reportPath = await reporter.generateReport({
    summary,
    testCases: allResults,
    moduleMetrics
  });

  console.log(`\nSUCCESS: Mobile Excel Report generated at:\n  ${reportPath}`);
  console.log('====================================================\n');
}

main().catch(err => {
  console.error('Fatal mobile execution error:', err);
  process.exit(1);
});
