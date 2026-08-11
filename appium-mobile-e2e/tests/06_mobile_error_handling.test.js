import { ErrorHandlingMobilePage } from '../pages/ErrorHandlingMobilePage.js';

export async function runMobileErrorHandlingTests(driver, baseUrl) {
  const category = 'Mobile Error Resilience & Dialogs';
  const page = new ErrorHandlingMobilePage(driver, baseUrl);
  const results = [];

  const testCases = [
    { route: '/error-no-internet', name: 'Verify Offline Mobile Connection View' },
    { route: '/error-network', name: 'Verify Mobile Network Connection Error View' },
    { route: '/error-server', name: 'Verify Android Backend Server Error View' },
    { route: '/error-timeout', name: 'Verify Mobile API Gateway Timeout View' },
    { route: '/error-general', name: 'Verify Mobile General Runtime Exception View' },
    { route: '/error-service-unavailable', name: 'Verify Mobile Service Maintenance Unavailable View' },
    { route: '/notification-scan-completed', name: 'Verify Mobile Scan Completed Toast' },
    { route: '/notification-scan-warning', name: 'Verify Mobile Security Warning Toast' },
    { route: '/notifications', name: 'Verify Mobile Notification History Center' },
    { route: '/alert-error', name: 'Verify Mobile Alert System Error Dialog' },
    { route: '/alert-delete-confirmation', name: 'Verify Mobile Item Deletion Modal' },
    { route: '/alert-logout-confirmation', name: 'Verify Mobile User Logout Confirmation Modal' },
    { route: '/alert-clear-history', name: 'Verify Mobile Clear History Confirmation Modal' }
  ];

  for (const tc of testCases) {
    const tStart = Date.now();
    try {
      await page.navigateToScreen(tc.route);
      results.push({
        category,
        name: tc.name,
        route: tc.route,
        status: 'PASS',
        duration: Date.now() - tStart,
        timestamp: new Date().toISOString()
      });
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
