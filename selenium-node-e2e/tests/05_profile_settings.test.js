import { ProfileSettingsPage } from '../pages/ProfileSettingsPage.js';

export async function runProfileSettingsTests(driver, baseUrl) {
  const category = 'Profile & Settings';
  const profilePage = new ProfileSettingsPage(driver, baseUrl);
  const results = [];

  const testCases = [
    { route: '/profile', name: 'Verify User Profile View Screen' },
    { route: '/edit-profile', name: 'Verify Edit Profile Details Form' },
    { route: '/change-password', name: 'Verify Change Password Form' },
    { route: '/settings', name: 'Verify Application Settings Screen' },
    { route: '/dark-mode', name: 'Verify Dark Mode Interface & Theme Toggle' },
    { route: '/help-faq', name: 'Verify Help & Knowledgebase FAQ Screen' },
    { route: '/app-update', name: 'Verify Application Update Notification Screen' },
    { route: '/permissions', name: 'Verify System Permissions Management Overview' }
  ];

  for (const tc of testCases) {
    const tStart = Date.now();
    try {
      await profilePage.navigateTo(tc.route);
      const url = await profilePage.getCurrentUrl();
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
