const IS_PRODUCTION = process.env.APP_VARIANT === 'production';
const DEV_PACKAGE_NAME = 'com.dev.esignature.indoornavigation';
const PROD_PACKAGE_NAME = 'com.esignature.indoornavigation';

const getPackageName = () => {
  if (IS_PRODUCTION) {
    return PROD_PACKAGE_NAME;
  }
  return DEV_PACKAGE_NAME;
};

export default {
  name: 'offline-map',
  slug: 'offline-map',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'myapp',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: getPackageName(),
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    permissions: ['android.permission.HIGH_SAMPLING_RATE_SENSORS'],
    package: getPackageName(),
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: '75579966-61ac-40cb-b4a8-620f07de05a8',
    },
  },
};
