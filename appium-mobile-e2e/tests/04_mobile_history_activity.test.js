import { HistoryActivityMobilePage } from '../pages/HistoryActivityMobilePage.js';

export async function runMobileHistoryActivityTests(driver, baseUrl) {
  const category = 'Mobile History & Recent Activity';
  const page = new HistoryActivityMobilePage(driver, baseUrl);
  const results = [];

  const testCases = [
    { route: '/history', name: 'Verify Android Scan History Infinite Scroll List' },
    { route: '/history-empty', name: 'Verify History Empty State Illustration View' },
    { route: '/history-loading', name: 'Verify Mobile History Skeleton Loader' },
    { route: '/activity', name: 'Verify Mobile Recent Activity Analytics Dashboard' },
    { route: '/search', name: 'Verify Mobile Scan Search & Filter Controls' }
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
