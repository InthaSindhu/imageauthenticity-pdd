import { AuthPage } from '../pages/AuthPage.js';

export async function runAuthTests(driver, baseUrl) {
  const category = 'Authentication';
  const authPage = new AuthPage(driver, baseUrl);
  const results = [];

  // Test Case 1: Login Screen Rendering
  const tc1Start = Date.now();
  try {
    await authPage.openLogin();
    const url = await authPage.getCurrentUrl();
    if (url.includes('/login')) {
      results.push({
        category,
        name: 'Verify Login Screen Navigation',
        route: '/login',
        status: 'PASS',
        duration: Date.now() - tc1Start,
        timestamp: new Date().toISOString()
      });
    } else {
      throw new Error(`Expected URL to include /login, got ${url}`);
    }
  } catch (err) {
    results.push({
      category,
      name: 'Verify Login Screen Navigation',
      route: '/login',
      status: 'FAIL',
      duration: Date.now() - tc1Start,
      timestamp: new Date().toISOString(),
      error: err.message
    });
  }

  // Test Case 2: Login Error Feedback Screen
  const tc2Start = Date.now();
  try {
    await authPage.openLoginError();
    const url = await authPage.getCurrentUrl();
    if (url.includes('/login-error')) {
      results.push({
        category,
        name: 'Verify Login Error Alert View',
        route: '/login-error',
        status: 'PASS',
        duration: Date.now() - tc2Start,
        timestamp: new Date().toISOString()
      });
    } else {
      throw new Error(`Expected URL to include /login-error, got ${url}`);
    }
  } catch (err) {
    results.push({
      category,
      name: 'Verify Login Error Alert View',
      route: '/login-error',
      status: 'FAIL',
      duration: Date.now() - tc2Start,
      timestamp: new Date().toISOString(),
      error: err.message
    });
  }

  // Test Case 3: Signup Screen View
  const tc3Start = Date.now();
  try {
    await authPage.openSignup();
    const url = await authPage.getCurrentUrl();
    if (url.includes('/signup')) {
      results.push({
        category,
        name: 'Verify User Signup Screen',
        route: '/signup',
        status: 'PASS',
        duration: Date.now() - tc3Start,
        timestamp: new Date().toISOString()
      });
    } else {
      throw new Error(`Expected URL to include /signup, got ${url}`);
    }
  } catch (err) {
    results.push({
      category,
      name: 'Verify User Signup Screen',
      route: '/signup',
      status: 'FAIL',
      duration: Date.now() - tc3Start,
      timestamp: new Date().toISOString(),
      error: err.message
    });
  }

  // Test Case 4: Signup Error View
  const tc4Start = Date.now();
  try {
    await authPage.openSignupError();
    const url = await authPage.getCurrentUrl();
    if (url.includes('/signup-error')) {
      results.push({
        category,
        name: 'Verify Signup Error Screen',
        route: '/signup-error',
        status: 'PASS',
        duration: Date.now() - tc4Start,
        timestamp: new Date().toISOString()
      });
    } else {
      throw new Error(`Expected URL to include /signup-error, got ${url}`);
    }
  } catch (err) {
    results.push({
      category,
      name: 'Verify Signup Error Screen',
      route: '/signup-error',
      status: 'FAIL',
      duration: Date.now() - tc4Start,
      timestamp: new Date().toISOString(),
      error: err.message
    });
  }

  return results;
}
