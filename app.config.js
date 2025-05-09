import 'dotenv/config';
import { RotationGestureHandler } from 'react-native-gesture-handler';
const dotenv = require('dotenv');
dotenv.config();

const environment = process.env.APP_ENV || 'development';
//console.log('environment', environment);

const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';
const IS_STAGING = process.env.APP_VARIANT === 'staging';
const IS_PROD = process.env.APP_VARIANT === 'production';
const appVariant = process.env.APP_VARIANT || 'preview';

module.exports = {
  expo: {
    name: 'reMIND',
    slug: 'reMIND',
    version: '1.7.9',
    orientation: 'portrait',
    icon: './src/assets/images/appicon.png',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    splash: {
      image: './src/assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#4DA584',
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'com.ceunnseo.reMIND',
      usesAppleSignIn: true,
      googleServicesFile: process.env.GOOGLE_SERVICES_INFO,
      userInterfaceStyle: 'automatic',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './src/assets/images/appicon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.ceunnseo.reMIND',
      permissions: ['INTERNET', 'com.google.android.gms.permission.AD_ID'],
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
      userInterfaceStyle: 'automatic',
    },
    androidStatusBar: {
      translucent: true,
    },
    scheme: 'remind',
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
    },
    extra: {
      appVariant: appVariant,
      APP_ENV: environment,
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
          iosUrlScheme: process.env.IOS_URL_SCHEME,
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
            './src/assets/fonts/KyoboHandwriting2019.ttf',
          ],
        },
      ],
      [
        'expo-notifications',
        {
          icon: './src/assets/images/new_notification.png',
          color: '#31B28E',
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
            useFrameworks: 'static',
          },
        },
      ],
      'expo-apple-authentication',
      'expo-localization',
      '@react-native-firebase/app',
      [
        'expo-asset',
        {
          assets: ['./src/assets/images/'],
        },
      ],
      [
        'react-native-fbsdk-next',
        {
          appID: process.env.FACEBOOK_APP_ID,
          //appID: '545312754691462',
          displayName: 'reMIND',
          clientToken: process.env.FACEBOOK_CLIENT_TOKEN,
          scheme: process.env.FACEBOOK_SCHEME,
          isAutoInitEnabled: true,
          advertiserIDCollectionEnabled: false,
          autoLogAppEventsEnabled: false,
        },
      ],
      ['expo-router'],
      [
        'expo-splash-screen',
        {
          backgroundColor: '#31B28E',
          image: './src/assets/images/logo_1024.png',
          dark: {
            image: './src/assets/images/logo_1024.png',
            backgroundColor: '#31B28E',
          },
          imageWidth: 190,
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission: 'The app accesses your photos to let you share them with your friends.',
        },
      ],
      [
        'react-native-google-mobile-ads',
        {
          androidAppId: 'ca-app-pub-8136917168968629~3476154076',
          iosAppId: 'ca-app-pub-8136917168968629~7618594976',
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission: '리마인드에서 사진을 첨부하기 위해서는 사진 선택 권한이 필요합니다.',
        },
      ],
    ],
    runtimeVersion: '1.0.0',
    updates: {
      url: 'https://u.expo.dev/1cd0480c-0399-4503-ae2d-ec73641ea4fd',
    },
  },
};
