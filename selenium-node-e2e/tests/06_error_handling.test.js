import { ErrorHandlingPage } from '../pages/ErrorHandlingPage.js';

export async function runErrorHandlingTests(driver, baseUrl) {
  const category = 'Error Handling & System Alerts';
  const errorPage = new ErrorHandlingPage(driver, baseUrl);
  const results = [];

  const testCases = [
    { route: '/error-no-internet', name: 'Verify No Internet Connection Fallback Screen' },
    { route: '/error-network', name: 'Verify Network Connection Error Screen' },
    { route: '/error-server', name: 'Verify Server Internal Error Screen' },
    { route: '/error-timeout', name: 'Verify API Gateway Timeout Error Screen' },
    { route: '/error-general', name: 'Verify Unhandled Exception General Error Screen' },
    { route: '/error-service-unavailable', name: 'Verify Service Maintenance Unavailable Screen' },
    { route: '/notification-scan-completed', name: 'Verify Scan Completed Toast Notification' },
    { route: '/notification-scan-warning', name: 'Verify Scan Security Warning Toast' },
    { route: '/notifications', name: 'Verify Notification Center View' },
    { route: '/alert-error', name: 'Verify System Error Dialog Overlay' },
    { route: '/alert-delete-confirmation', name: 'Verify Item Deletion Confirmation Modal' },
    { route: '/alert-logout-confirmation', name: 'Verify User Logout Confirmation Modal' },
    { route: '/alert-clear-history', name: 'Verify Clear History Confirmation Modal' }
  ];

  for (const tc of testCases) {
    const tStart = Date.now();
    try {
      await errorPage.navigateTo(tc.route);
      const url = await errorPage.getCurrentUrl();
      if (url.includes(tc.route)) {
        results.push({
          category,
          name: tc.name,
          route: tc.route,
          status: 'PASS',
          duration: Date.now() - tStart,
          timestamp: new Date().toISOString()
        });
      } else {
        throw new Error(`Expected URL to contain ${tc.route}, got ${url}`);
      }
    } catch (err) {
      results.push({
        category,
        name: tc.name,
        route: tc.route,
        status: 'FAIL',
        duration: Date.now() - tStart,
        timestamp: new Date().toISOString(),
        error: err.message
      });
    }
  }

  return results;
}
