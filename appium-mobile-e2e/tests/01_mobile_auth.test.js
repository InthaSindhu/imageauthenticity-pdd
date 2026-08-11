import { AuthMobilePage } from '../pages/AuthMobilePage.js';

export async function runMobileAuthTests(driver, baseUrl) {
  const category = 'Mobile Authentication';
  const authPage = new AuthMobilePage(driver, baseUrl);
  const results = [];

  const testCases = [
    { route: '/login', name: 'Verify Android Mobile Login Screen' },
    { route: '/login-error', name: 'Verify Mobile Authentication Error Alert' },
    { route: '/signup', name: 'Verify Android Mobile Signup Registration View' },
    { route: '/signup-error', name: 'Verify Mobile Signup Validation Error View' }
  ];

  for (const tc of testCases) {
    const tStart = Date.now();
    try {
      await authPage.navigateToScreen(tc.route);
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
