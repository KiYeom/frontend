import { StyleSheet, View, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import BottomTabNavigator from './src/navigators/BottomTabNavigator';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import {
  clearInfoWhenLogout,
  getAccessToken,
  getRefreshToken,
  setDeviceId,
} from './src/utils/storageUtils';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import AuthStackNavigator from './src/navigators/AuthStackNavigator';
import palette from './src/assets/styles/theme';
import { getDeviceId } from './src/utils/device-info';
import { UseSigninStatus } from './src/utils/signin-status';
import { reissueAccessToken } from './src/apis/interceptor';
import * as amplitude from '@amplitude/analytics-react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeStackNavigator from './src/navigators/HomeStackNavigator';
import StatisticStackNavigator from './src/navigators/StatisticStackNavigator';
import SettingStackNavigator from './src/navigators/SettingStackNavigator';
import { RootStackName } from './src/constants/Constants';
import { RootSiblingParent } from 'react-native-root-siblings';
import * as Sentry from '@sentry/react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

Sentry.init({
  dsn: 'https://038362834934b1090d94fe368fdbcbf7@o4507944128020480.ingest.us.sentry.io/4507944132870145',
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

if (process.env.EXPO_PUBLIC_AMPLITUDE) {
  amplitude.init(process.env.EXPO_PUBLIC_AMPLITUDE);
  amplitude.track('Sign Up');
}

SplashScreen.preventAutoHideAsync();
const RootStack = createNativeStackNavigator();

const App: React.FC = () => {
  const [loading, setLoading] = useState(true); //로딩중이면 true, 로딩이 끝났으면 false
  const { SigninStatus, setSigninStatus } = UseSigninStatus(); //store에서 가지고 온 전역 state

  const [loaded, error] = useFonts({
    'Pretendard-SemiBold': require('./src/assets/fonts/Pretendard-SemiBold.ttf'),
    'Pretendard-Bold': require('./src/assets/fonts/Pretendard-Bold.ttf'),
    'Pretendard-Regular': require('./src/assets/fonts/Pretendard-Regular.ttf'),
    'Pretendard-Light': require('./src/assets/fonts/Pretendard-Light.ttf'),
    'Pretendard-ExtraLight': require('./src/assets/fonts/Pretendard-ExtraLight.ttf'),
    'Pretnedard-Thin': require('./src/assets/fonts/Pretendard-Thin.ttf'),
    'Pretendard-Black': require('./src/assets/fonts/Pretendard-Black.ttf'),
    'Pretendard-Medium': require('./src/assets/fonts/Pretendard-Medium.ttf'),
  });

  const checkSignIn = async (): Promise<boolean> => {
    //자동 로그인 판단
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      //토큰이 없으면, 다른 기기에서 접근한 것이거나 우리의 회원이 아니다. 로그인 화면을 보여준다.
      console.log('[APP START] LogOut: 1, SigninStatus: ', SigninStatus);
      return false;
    }

    //토큰 재발급
    await reissueAccessToken(refreshToken, true);
    const accessToken = getAccessToken();
    if (!accessToken) {
      console.log('[APP START] LogOut: 2, SigninStatus: ', SigninStatus);
      return false;
    }

    return true;
  };

  const bootstrap = async (): Promise<void> => {
    const deviceId = await getDeviceId();
    if (deviceId === null) {
      console.error('DeviceId is undefined');
      alert('지원하지 않는 운영체제입니다. 문의: admin@remind4u.co.kr');
      return;
    }
    setDeviceId(deviceId);
    const signinResult = await checkSignIn();
    if (!signinResult) {
      clearInfoWhenLogout();
      await GoogleSignin.signOut();
    }
    setSigninStatus(signinResult);
  };

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
    if (loaded) {
      bootstrap().then(() => {
        setLoading(false);
      });
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={palette.primary[500]} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navTheme}>
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
            </>
          ) : (
            <RootStack.Screen
              name={RootStackName.AuthStackNavigator}
              component={AuthStackNavigator}
            />
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
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

export default Sentry.wrap(App);
