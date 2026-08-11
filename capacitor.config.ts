import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.imageauth.verifier',
  appName: 'Image Authenticity Verifier',
  webDir: 'dist',
  server: {
    // The app's web assets are bundled inside the APK.
    // API calls go to the PC backend over the local network (see api.ts).
    androidScheme: 'https',
    cleartext: true,   // Allow HTTP requests to local backend
  },
  android: {
    allowMixedContent: true,  // Allow HTTP API calls from HTTPS WebView
  },
};

export default config;
