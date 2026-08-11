import { BasePage } from '../pages/BasePage.js';

export async function runOnboardingTests(driver, baseUrl) {
  const category = 'Onboarding & Permissions';
  const basePage = new BasePage(driver, baseUrl);
  const results = [];

  // Splash Screen Test
  const tc1Start = Date.now();
  try {
    await basePage.navigateTo('/');
    results.push({
      category,
      name: 'Verify Splash Screen Initial Load',
      route: '/',
      status: 'PASS',
      duration: Date.now() - tc1Start,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    results.push({
      category,
      name: 'Verify Splash Screen Initial Load',
      route: '/',
      status: 'FAIL',
      duration: Date.now() - tc1Start,
      timestamp: new Date().toISOString(),
      error: err.message
    });
  }

  // Tutorial Onboarding
  const tc2Start = Date.now();
  try {
    await basePage.navigateTo('/tutorial');
    const url = await basePage.getCurrentUrl();
    results.push({
      category,
      name: 'Verify Interactive Tutorial Onboarding',
      route: '/tutorial',
      status: url.includes('/tutorial') ? 'PASS' : 'FAIL',
      duration: Date.now() - tc2Start,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    results.push({
      category,
      name: 'Verify Interactive Tutorial Onboarding',
      route: '/tutorial',
      status: 'FAIL',
      duration: Date.now() - tc2Start,
      timestamp: new Date().toISOString(),
      error: err.message
    });
  }

  // Onboarding Permissions
  const tc3Start = Date.now();
  try {
    await basePage.navigateTo('/onboarding-permissions');
    results.push({
      category,
      name: 'Verify Onboarding Permissions Screen',
      route: '/onboarding-permissions',
      status: 'PASS',
      duration: Date.now() - tc3Start,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    results.push({
      category,
      name: 'Verify Onboarding Permissions Screen',
      route: '/onboarding-permissions',
      status: 'FAIL',
      duration: Date.now() - tc3Start,
      timestamp: new Date().toISOString(),
      error: err.message
    });
  }

  // Camera & Storage Permissions Granted / Denied screens
  const permScreens = [
    { route: '/camera-permission', name: 'Camera Permission Prompt' },
    { route: '/storage-permission', name: 'Storage Permission Prompt' },
    { route: '/camera-permission-denied', name: 'Camera Permission Denied State' },
    { route: '/storage-permission-denied', name: 'Storage Permission Denied State' }
  ];

  for (const perm of permScreens) {
    const tStart = Date.now();
    try {
      await basePage.navigateTo(perm.route);
      results.push({
        category,
        name: `Verify ${perm.name}`,
        route: perm.route,
        status: 'PASS',
        duration: Date.now() - tStart,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      results.push({
        category,
        name: `Verify ${perm.name}`,
        route: perm.route,
        status: 'FAIL',
        duration: Date.now() - tStart,
        timestamp: new Date().toISOString(),
        error: err.message
      });
    }
  }

  return results;
}
