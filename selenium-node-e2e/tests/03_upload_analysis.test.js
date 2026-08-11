import { UploadPage } from '../pages/UploadPage.js';

export async function runUploadAnalysisTests(driver, baseUrl) {
  const category = 'Upload & Image Analysis';
  const uploadPage = new UploadPage(driver, baseUrl);
  const results = [];

  const testCases = [
    { route: '/home', name: 'Verify Home Screen Dashboard & Upload Entrypoint' },
    { route: '/upload', name: 'Verify File Upload Screen' },
    { route: '/upload-drag', name: 'Verify Drag-and-Drop Image Hover Area' },
    { route: '/uploading', name: 'Verify Image Upload Progress View' },
    { route: '/upload-error', name: 'Verify Upload Error Feedback Screen' },
    { route: '/processing', name: 'Verify AI Forensics Processing Indicator' },
    { route: '/result', name: 'Verify Generic Inspection Result Screen' },
    { route: '/result-authentic', name: 'Verify Authentic Image Result Status View' },
    { route: '/result-fake', name: 'Verify Manipulated / Deepfake Result Status View' },
    { route: '/result-uncertain', name: 'Verify Uncertain / Low-Confidence Result View' },
    { route: '/analysis', name: 'Verify Detailed Forensics Analysis Report View' },
    { route: '/metadata', name: 'Verify EXIF & Image Metadata Inspector' },
    { route: '/confidence', name: 'Verify AI Model Confidence Breakdown View' },
    { route: '/comparison', name: 'Verify Side-by-Side Image Comparison View' },
    { route: '/share', name: 'Verify Analysis Result Export & Share Modal' },
    { route: '/feedback', name: 'Verify User Feedback Submission Dialog' }
  ];

  for (const tc of testCases) {
    const tStart = Date.now();
    try {
      await uploadPage.navigateTo(tc.route);
      const url = await uploadPage.getCurrentUrl();
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
