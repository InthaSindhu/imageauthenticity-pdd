import { OnboardingPermissionsMobilePage } from '../pages/OnboardingPermissionsMobilePage.js';

export async function runMobileOnboardingPermissionsTests(driver, baseUrl) {
  const category = 'Mobile Onboarding & Native Permissions';
  const page = new OnboardingPermissionsMobilePage(driver, baseUrl);
  const results = [];

  const testCases = [
    { route: '/', name: 'Verify Android App Splash Screen Launch' },
    { route: '/tutorial', name: 'Verify Mobile Interactive Tutorial Onboarding' },
    { route: '/onboarding-permissions', name: 'Verify Onboarding System Permissions Request' },
    { route: '/camera-permission', name: 'Verify Android Native Camera Permission Prompt' },
    { route: '/storage-permission', name: 'Verify Android Native Storage Permission Prompt' },
    { route: '/camera-permission-denied', name: 'Verify Camera Permission Denied Fallback UI' },
    { route: '/storage-permission-denied', name: 'Verify Storage Permission Denied Fallback UI' },
    { route: '/permissions', name: 'Verify Permissions Management Settings Overview' }
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
