import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const appiumConfig = {
  hostname: process.env.APPIUM_HOST || '127.0.0.1',
  port: parseInt(process.env.APPIUM_PORT || '4723', 10),
  path: '/',
  capabilities: {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': process.env.ANDROID_DEVICE_NAME || 'Android Emulator',
    'appium:app': path.resolve(__dirname, '../../ImageAuthenticity-debug.apk'),
    'appium:appPackage': 'com.imageauth.verifier',
    'appium:appActivity': 'com.imageauth.verifier.MainActivity',
    'appium:noReset': false,
    'appium:fullReset': false,
    'appium:autoGrantPermissions': true,
    'appium:newCommandTimeout': 120
  },
  reportsDir: path.resolve(__dirname, '../reports'),
  reportFileName: 'Image_Authenticity_Android_Appium_Report.xlsx',
  baseUrl: process.env.TEST_BASE_URL || 'http://localhost:5173'
};
