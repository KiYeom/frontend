import * as amplitude from '@amplitude/analytics-react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Sentry from '@sentry/react-native';
import { useFonts } from 'expo-font';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { reissueAccessToken } from './src/apis/interceptor';
import palette from './src/assets/styles/theme';
import { HomeStackName, RootStackName, TabScreenName } from './src/constants/Constants';
import AuthStackNavigator from './src/navigators/AuthStackNavigator';
import BottomTabNavigator from './src/navigators/BottomTabNavigator';
import DangerStackNavigator from './src/navigators/DangerStackNavigator';
import HomeStackNavigator from './src/navigators/HomeStackNavigator';
import SettingStackNavigator from './src/navigators/SettingStackNavigator';
import StatisticStackNavigator from './src/navigators/StatisticStackNavigator';
import Analytics from './src/utils/analytics';
import { getDeviceId } from './src/utils/device-info';
import { UseSigninStatus } from './src/utils/signin-status';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { getLatestVersion } from './src/apis/setting';
import { getAppVersion } from './src/utils/device-info';
import { Platform, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as WebBrowser from 'expo-web-browser';
import {
  clearInfoWhenLogout,
  getAccessToken,
  getRefreshToken,
  getUserAccountProvider,
  setDeviceId,
} from './src/utils/storageUtils';
import { setStatusBarStyle } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { RootSiblingParent } from 'react-native-root-siblings';
import { Appearance, useColorScheme } from 'react-native';
import * as SystemUI from 'expo-system-ui';
import 'react-native-gesture-handler';
import Favorites from './src/pages/HomePage/favorites/favorites';
import Constants from 'expo-constants';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { preloadEmojiImages } from './src/services/imagePreloader';
import {
  restoreTransactions,
  initializeInApp,
  NewInitializeInApp,
  NewLoginInApp,
} from './src/services/inappService';
import Purchases from 'react-native-purchases';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
/*const { APP_ENV } = Constants.expoConfig?.extra || {};
// 환경 확인
const isProduction = APP_ENV === 'production';
const isStaging = APP_ENV === 'staging';
const isDevelopment = APP_ENV === 'development' || !APP_ENV; // APP_ENV가 없으면 개발 환경으로 간주
*/

const appVariant = Constants.expoConfig?.extra?.appVariant;
const isProductionOrStaging = appVariant === 'production' || appVariant === 'staging';

if (isProductionOrStaging) {
  Sentry.init({
    dsn: 'https://038362834934b1090d94fe368fdbcbf7@o4507944128020480.ingest.us.sentry.io/4507944132870145',
  });
}
if (isProductionOrStaging && process.env.EXPO_PUBLIC_AMPLITUDE) {
  amplitude.init(process.env.EXPO_PUBLIC_AMPLITUDE, undefined, {
    minIdLength: 1,
  });
}
//앱 시작 시 인앱 결제 초기화
NewInitializeInApp();

/*amplitude.init(process.env.EXPO_PUBLIC_AMPLITUDE, undefined, {
  minIdLength: 1,
});*/

amplitude.init(process.env.EXPO_PUBLIC_AMPLITUDE, undefined, {
  minIdLength: 1,
});

SplashScreen.preventAutoHideAsync();
const RootStack = createNativeStackNavigator();

//set Deep Linking
const prefix = Linking.createURL('/');

const queryClient = new QueryClient();

const App: React.FC = () => {
  const [loading, setLoading] = useState(true); //로딩중이면 true, 로딩이 끝났으면 false
  const { SigninStatus, setSigninStatus } = UseSigninStatus(); //store에서 가지고 온 전역 state

  //useFont를 사용하여 사용할 폰트를 로드 (폰트 로드 시 loaded : true, 로드 중 에러 발생하면 error객체 포함)
  const [loaded, error] = useFonts({
    'Pretendard-SemiBold': require('./src/assets/fonts/Pretendard-SemiBold.ttf'),
    'Pretendard-Bold': require('./src/assets/fonts/Pretendard-Bold.ttf'),
    'Pretendard-Regular': require('./src/assets/fonts/Pretendard-Regular.ttf'),
    'Pretendard-Light': require('./src/assets/fonts/Pretendard-Light.ttf'),
    'Pretendard-ExtraLight': require('./src/assets/fonts/Pretendard-ExtraLight.ttf'),
    'Pretnedard-Thin': require('./src/assets/fonts/Pretendard-Thin.ttf'),
    'Pretendard-Black': require('./src/assets/fonts/Pretendard-Black.ttf'),
    'Pretendard-Medium': require('./src/assets/fonts/Pretendard-Medium.ttf'),
    'Kyobo-handwriting': require('./src/assets/fonts/KyoboHandwriting2019.ttf'),
  });

  const checkSignIn = async (): Promise<boolean> => {
    //자동 로그인 판단
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      //토큰이 없으면, 다른 기기에서 접근한 것이거나 우리의 회원이 아니다. 로그인 화면을 보여준다.
      //console.log('[APP START] LogOut: 1, SigninStatus: ', SigninStatus);
      return false;
    }

    //토큰 재발급
    await reissueAccessToken(refreshToken, true);
    const accessToken = getAccessToken();
    if (!accessToken) {
      //console.log('[APP START] LogOut: 2, SigninStatus: ', SigninStatus);
      return false;
    }

    return true;
  };

  const bootstrap = async (): Promise<void> => {
    setStatusBarStyle('dark');
    const deviceId = await getDeviceId();
    if (deviceId === null) {
      //console.error('DeviceId is undefined');
      alert('지원하지 않는 운영체제입니다. 문의: admin@remind4u.co.kr');
      return;
    }
    setDeviceId(deviceId);
    //console.log('setDevice ID', deviceId);
    const signinResult = await checkSignIn();
    if (!signinResult) {
      clearInfoWhenLogout();
    }
    const accessToken = getAccessToken();
    if (accessToken) {
      Analytics.setUser(accessToken);
      NewLoginInApp(accessToken);
    }
    setSigninStatus(signinResult);
  };
  //업데이트 알림
  //1.5.7 UPDATE : 앱 배포 시 updateAlert 주석처리한 거 다시 해제할 것

  const updateAlert = () => {
    Alert.alert(
      '⚠️업데이트 필요⚠️',
      '새로운 버전의 앱이 출시되었습니다. 업데이트 후 사용 가능합니다‼️',
      [
        {
          text: '업데이트',
          onPress: () => {
            if (Platform.OS === 'ios') {
              WebBrowser.openBrowserAsync('https://apps.apple.com/app/remind/id6544783154');
            } else if (Platform.OS === 'android') {
              WebBrowser.openBrowserAsync(
                'https://play.google.com/store/apps/details?id=com.ceunnseo.reMIND',
              );
            }
            Analytics.clickUpdateAlertButton(getAppVersion() ?? 'undefined', Platform.OS);
          },
        },
      ],
      { cancelable: false }, // 닫을 수 없는 알림
    );
  };

  //앱 버전 체크
  const checkAppVersion = () => {
    getLatestVersion()
      .then((res) => {
        const deviceVersion = getAppVersion() ?? undefined;
        if (res && deviceVersion && deviceVersion !== res.latestVersion) {
          //console.log('😀deviceVersion: ', deviceVersion, 'latestVersion: ', res.latestVersion);
          // updateAlert(); 1.5.7 UPDATE : 주석한 거 해제하기!!!!
          return;
        }
      })
      .catch((error) => console.error(error));
  };

  //앱 처음 실행 시 폰트 로드 진행. 완료되면 로그인 여부를 판단한 뒤에 로딩 화면을 숨김
  useEffect(() => {
    if (loaded || error) {
      //로딩중
      SplashScreen.hideAsync();
    }
    if (loaded) {
      bootstrap().then(() => {
        setLoading(false);
        checkAppVersion();
      });
    }
  }, [loaded, error]);

  // 처음 앱을 실행할 때 amplitude에 로그인 화면에 진입했음을 알려준다.
  useEffect(() => {
    //console.log('⭐️⭐️⭐️ provider', getUserAccountProvider());
    Analytics.watchLoginScreen();
  }, []);

  if (!loaded && !error) {
    return null;
  }

  // 로딩스피너
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={palette.primary[500]} />
      </View>
    );
  }

  /*alert(
    '쿠키와의 시간에 불편을 드려 죄송합니다.🥺 현재 서비스 점검중이며, 오늘(3/6) 저녁 6시 이후 쿠키를 만나뵈실 수 있습니다!',
  );*/

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <KeyboardProvider>
          <SafeAreaProvider>
            <PaperProvider>
              <RootSiblingParent>
                <NavigationContainer
                  theme={navTheme}
                  linking={{
                    prefixes: [prefix],
                    config: {
                      // Configuration for linking
                      screens: {
                        // Define the linking configuration
                        [RootStackName.HomeStackNavigator]: {
                          screens: {
                            [HomeStackName.NewChat]: 'chat', //{"url": "remind://chat" }
                            [HomeStackName.Report]: 'statistic/daily/:dateID',
                          },
                        },
                      },
                    },
                    async getInitialURL() {
                      // First, you may want to do the default deep link handling
                      // Check if app was opened from a deep link
                      const url = await Linking.getInitialURL();

                      if (url != null) {
                        return url;
                      }

                      // Handle URL from expo push notifications
                      const response = await Notifications.getLastNotificationResponseAsync();

                      return response?.notification.request.content.data.url;
                    },
                    subscribe(listener) {
                      const onReceiveURL = ({ url }: { url: string }) => listener(url);

                      // Listen to incoming links from deep linking
                      const eventListenerSubscription = Linking.addEventListener(
                        'url',
                        onReceiveURL,
                      );

                      // Listen to expo push notifications
                      const subscription = Notifications.addNotificationResponseReceivedListener(
                        (response) => {
                          const url = response.notification.request.content.data.url;

                          // Any custom logic to see whether the URL needs to be handled
                          //...

                          // Let React Navigation handle the URL
                          listener(url);
                        },
                      );

                      return () => {
                        // Clean up the event listeners
                        eventListenerSubscription.remove();
                        subscription.remove();
                      };
                    },
                  }}
                  fallback={
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color={palette.primary[500]} />
                    </View>
                  }>
                  <RootStack.Navigator
                    screenOptions={{
                      headerShown: false,
                    }}>
                    {SigninStatus ? (
                      <>
                        <RootStack.Screen
                          name={RootStackName.BottomTabNavigator}
                          component={BottomTabNavigator}
                        />
                        <RootStack.Screen
                          name={RootStackName.StatisStackNavigator}
                          component={StatisticStackNavigator}
                        />
                        <RootStack.Screen
                          name={RootStackName.HomeStackNavigator}
                          component={HomeStackNavigator}
                        />
                        <RootStack.Screen
                          name={RootStackName.SettingStackNavigator}
                          component={SettingStackNavigator}
                        />
                        <RootStack.Screen
                          name={RootStackName.DangerStackNavigator}
                          component={DangerStackNavigator}
                        />
                      </>
                    ) : (
                      <>
                        <RootStack.Screen
                          name={RootStackName.AuthStackNavigator}
                          component={AuthStackNavigator}
                        />
                      </>
                    )}
                  </RootStack.Navigator>
                </NavigationContainer>
              </RootSiblingParent>
            </PaperProvider>
          </SafeAreaProvider>
        </KeyboardProvider>
      </QueryClientProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'rgb(255, 255, 255)',
  },
};

//export default Sentry.wrap(App);
export default App;
