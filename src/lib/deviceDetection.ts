/**
 * Comprehensive device detection for all iPhone and Android versions
 */

export interface DeviceInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isTablet: boolean;
  iosVersion: number | null;
  androidVersion: number | null;
  browser: string;
  supportsWebGL: boolean;
  supportsWebGL2: boolean;
  isOldDevice: boolean;
  devicePixelRatio: number;
  screenWidth: number;
  screenHeight: number;
}

let deviceInfoCache: DeviceInfo | null = null;

function detectDevice(): DeviceInfo {
  if (deviceInfoCache) return deviceInfoCache;

  if (typeof window === 'undefined') {
    return {
      isIOS: false,
      isAndroid: false,
      isMobile: false,
      isTablet: false,
      iosVersion: null,
      androidVersion: null,
      browser: 'unknown',
      supportsWebGL: false,
      supportsWebGL2: false,
      isOldDevice: false,
      devicePixelRatio: 1,
      screenWidth: 0,
      screenHeight: 0,
    };
  }

  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
  const isAndroid = /Android/.test(userAgent);
  
  // iOS version detection (works for all iOS versions)
  let iosVersion: number | null = null;
  if (isIOS) {
    // Try standard format: OS 15_2_1 or OS 15_2
    let match = userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
    if (match && match[1]) {
      iosVersion = parseFloat(`${match[1]}.${match[2] || '0'}`);
    } else {
      // Try newer format for iOS 13+: Version/15.2.1
      match = userAgent.match(/Version\/(\d+)\.(\d+)\.?(\d+)?/);
      if (match && match[1]) {
        iosVersion = parseFloat(`${match[1]}.${match[2] || '0'}`);
      }
    }
  }

  // Android version detection (works for all Android versions)
  let androidVersion: number | null = null;
  if (isAndroid) {
    const match = userAgent.match(/Android (\d+)\.(\d+)/);
    if (match && match[1]) {
      androidVersion = parseFloat(`${match[1]}.${match[2] || '0'}`);
    }
  }

  // Browser detection
  let browser = 'unknown';
  if (userAgent.indexOf('Chrome') > -1) browser = 'chrome';
  else if (userAgent.indexOf('Safari') > -1) browser = 'safari';
  else if (userAgent.indexOf('Firefox') > -1) browser = 'firefox';
  else if (userAgent.indexOf('Edge') > -1) browser = 'edge';
  else if (userAgent.indexOf('Opera') > -1) browser = 'opera';

  // Mobile/Tablet detection
  const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTablet = /iPad|Android(?!.*Mobile)|Tablet/i.test(userAgent);

  // Screen dimensions
  const screenWidth = window.screen.width || window.innerWidth;
  const screenHeight = window.screen.height || window.innerHeight;
  const devicePixelRatio = window.devicePixelRatio || 1;

  // WebGL support detection
  let supportsWebGL = false;
  let supportsWebGL2 = false;
  try {
    const canvas = document.createElement('canvas');
    supportsWebGL = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    supportsWebGL2 = !!canvas.getContext('webgl2');
  } catch (e) {
    // WebGL not supported
  }

  // Old device detection (for performance optimizations)
  const isOldDevice = 
    (isIOS && iosVersion !== null && iosVersion < 12) ||
    (isAndroid && androidVersion !== null && androidVersion < 5) ||
    devicePixelRatio < 1.5;

  deviceInfoCache = {
    isIOS,
    isAndroid,
    isMobile: isMobile && !isTablet,
    isTablet,
    iosVersion,
    androidVersion,
    browser,
    supportsWebGL,
    supportsWebGL2,
    isOldDevice,
    devicePixelRatio,
    screenWidth,
    screenHeight,
  };

  return deviceInfoCache;
}

export function isOldIOSDevice(): boolean {
  const info = detectDevice();
  return info.isIOS && info.iosVersion !== null && info.iosVersion < 13;
}

export function isOldAndroidDevice(): boolean {
  const info = detectDevice();
  return info.isAndroid && info.androidVersion !== null && info.androidVersion < 6;
}

// Export detectDevice function
export { detectDevice };

export function getOptimalViewportUnit(): string {
  const info = detectDevice();
  
  // Use the best viewport unit for the device
  if (info.isIOS) {
    // iOS Safari supports dvh, but older versions need svh
    if (info.iosVersion !== null && info.iosVersion >= 15.4) {
      return 'dvh'; // Dynamic viewport height (newer iOS)
    } else {
      return 'svh'; // Small viewport height (older iOS)
    }
  } else if (info.isAndroid) {
    // Android Chrome supports dvh from version 108+
    if (info.browser === 'chrome' && info.androidVersion !== null && info.androidVersion >= 10) {
      return 'dvh';
    } else {
      return 'svh';
    }
  }
  
  // Default to vh for desktop
  return 'vh';
}

