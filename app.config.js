module.exports = {
  expo: {
    name: 'reMIND',
    slug: 'reMIND',
    version: '1.1.4',
    orientation: 'portrait',
    icon: './src/assets/images/appicon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './src/assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#4DA584',
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'com.ceunnseo.reMIND',
      usesAppleSignIn: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './src/assets/images/appicon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.ceunnseo.reMIND',
      permissions: ['INTERNET'],
      googleServicesFile: process.env.GOOGLE_SERVICES_FILE,
    },
    scheme: 'remind',
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      eas: {
        projectId: '1cd0480c-0399-4503-ae2d-ec73641ea4fd',
      },
    },
    plugins: [
      [
        '@sentry/react-native/expo',
        {
          organization: process.env.SENTRY_ORG,
          project: process.env.SENTRY_PROJECT,
          url: 'https://sentry.io/',
        },
      ],
      [
        '@react-native-google-signin/google-signin',
        {
          iosUrlScheme: 'com.googleusercontent.apps.94079762653-arcgeib4l0hbg6snh81cjimd9iuuoun3',
        },
      ],
      [
        'expo-font',
        {
          fonts: [
            './src/assets/fonts/Pretendard-Black.ttf',
            './src/assets/fonts/Pretendard-Bold.ttf',
            './src/assets/fonts/Pretendard-ExtraBold.ttf',
            './src/assets/fonts/Pretendard-ExtraLight.ttf',
            './src/assets/fonts/Pretendard-Light.ttf',
            './src/assets/fonts/Pretendard-Medium.ttf',
            './src/assets/fonts/Pretendard-Regular.ttf',
            './src/assets/fonts/Pretendard-SemiBold.ttf',
            './src/assets/fonts/Pretendard-Thin.ttf',
          ],
        },
      ],
      [
        'expo-notifications',
        {
          color: '#ffffff',
          mode: 'production',
        },
      ],
      [
        'expo-build-properties',
        {
          android: {
            usesCleartextTraffic: true,
            newArchEnabled: true,
          },
          ios: {
            newArchEnabled: true,
          },
        },
      ],
      'expo-apple-authentication',
      'expo-localization',
      'expo-build-properties',
      [
        'expo-asset',
        {
          assets: ['./src/assets/images/'],
        },
      ],
    ],
    runtimeVersion: '1.0.0',
    updates: {
      url: 'https://u.expo.dev/1cd0480c-0399-4503-ae2d-ec73641ea4fd',
    },
  },
};
