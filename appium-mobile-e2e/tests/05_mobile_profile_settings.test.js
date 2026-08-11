import { ProfileSettingsMobilePage } from '../pages/ProfileSettingsMobilePage.js';

export async function runMobileProfileSettingsTests(driver, baseUrl) {
  const category = 'Mobile Profile & App Settings';
  const page = new ProfileSettingsMobilePage(driver, baseUrl);
  const results = [];

  const testCases = [
    { route: '/profile', name: 'Verify Mobile Profile Screen' },
    { route: '/edit-profile', name: 'Verify Mobile Edit Profile Information' },
    { route: '/change-password', name: 'Verify Mobile Change Security Password View' },
    { route: '/settings', name: 'Verify Mobile Application Preferences & Settings' },
    { route: '/dark-mode', name: 'Verify Mobile Dark Mode UI Theme Switcher' },
    { route: '/help-faq', name: 'Verify Mobile Help Center & FAQ Accordion View' },
    { route: '/app-update', name: 'Verify Mobile Application Update Alert Screen' }
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
