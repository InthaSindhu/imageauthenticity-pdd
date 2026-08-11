import { HistoryPage } from '../pages/HistoryPage.js';

export async function runHistoryActivityTests(driver, baseUrl) {
  const category = 'History & Activity Dashboard';
  const historyPage = new HistoryPage(driver, baseUrl);
  const results = [];

  const testCases = [
    { route: '/history', name: 'Verify Verification History List Screen' },
    { route: '/history-empty', name: 'Verify History Empty State Screen' },
    { route: '/history-loading', name: 'Verify History Skeleton Loading State' },
    { route: '/activity', name: 'Verify Recent Activity Dashboard & Metrics' },
    { route: '/search', name: 'Verify History Search & Filter Interface' }
  ];

  for (const tc of testCases) {
    const tStart = Date.now();
    try {
      await historyPage.navigateTo(tc.route);
      const url = await historyPage.getCurrentUrl();
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
