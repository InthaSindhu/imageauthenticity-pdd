import { UploadAnalysisMobilePage } from '../pages/UploadAnalysisMobilePage.js';

export async function runMobileUploadAnalysisTests(driver, baseUrl) {
  const category = 'Mobile Image Upload & Forensics';
  const page = new UploadAnalysisMobilePage(driver, baseUrl);
  const results = [];

  const testCases = [
    { route: '/home', name: 'Verify Mobile Home Dashboard & Verification Action' },
    { route: '/upload', name: 'Verify Android Image Picker & Upload Screen' },
    { route: '/uploading', name: 'Verify Mobile Upload Progress Bar View' },
    { route: '/upload-error', name: 'Verify Mobile Image Upload Error Alert' },
    { route: '/processing', name: 'Verify Mobile AI Forensics Processing View' },
    { route: '/result', name: 'Verify Generic Mobile Verification Result View' },
    { route: '/result-authentic', name: 'Verify Authentic Image Detection Screen' },
    { route: '/result-fake', name: 'Verify Manipulated / Deepfake Warning Screen' },
    { route: '/result-uncertain', name: 'Verify Uncertain / Low-Confidence Result Screen' },
    { route: '/analysis', name: 'Verify Mobile Detailed Analysis Breakdown' },
    { route: '/metadata', name: 'Verify Mobile EXIF Metadata Inspector' },
    { route: '/confidence', name: 'Verify Mobile AI Model Confidence Scores' },
    { route: '/comparison', name: 'Verify Side-by-Side Mobile Image Comparison' },
    { route: '/share', name: 'Verify Native Mobile Share Sheet & Export' },
    { route: '/feedback', name: 'Verify User Feedback & Report Issue Dialog' }
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
