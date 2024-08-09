import { StyleSheet, View, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Login from './src/components/pages/sign-in/sign-in';
import BottomTabNavigator from './src/navigators/BottomTabNavigator';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  clearInfoWhenLogout,
  getAccessToken,
  getRefreshToken,
  setDeviceId,
} from './src/utils/storageUtils';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { PaperProvider } from 'react-native-paper';
import SettingStackNavigator from './src/navigators/SettingStackNavigator';
import SignUpStackNavigator from './src/navigators/SignUpStackNavigator';
import HomeStackNavigator from './src/navigators/HomeStackNavigator';
import StatisticStackNavigator from './src/navigators/StatisticStackNavigator';
import palette from './src/assets/styles/theme';
import { getDeviceId } from './src/utils/device-info';
import { UseSigninStatus } from './src/utils/signin-status';
import { reissueAccessToken } from './src/apis/interceptor';
import * as amplitude from '@amplitude/analytics-react-native';

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
      alert('디바이스 정보를 가져오는데 실패했습니다. 앱을 다시 실행해주세요.');
      return;
    }
    setDeviceId(deviceId);
    const signinResult = await checkSignIn();
    if (!signinResult) {
      clearInfoWhenLogout();
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
    <NavigationContainer theme={navTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Main">
        {SigninStatus ? ( //로그인이 되어있을 경우 보여줄 페이지 : 홈 화면(Tabbar), 채팅화면 (Chat), 설정화면들
          <>
            <RootStack.Screen
              name="BottomTabNavigator"
              component={BottomTabNavigator}
              options={{
                title: 'Home',
              }}
            />
            <RootStack.Screen name="HomeStackNavigator" component={HomeStackNavigator} />
            <RootStack.Screen name="SettingStackNavigator" component={SettingStackNavigator} />
            <RootStack.Screen name="StatisticStackNavigator" component={StatisticStackNavigator} />
          </>
        ) : (
          //로그인이 안 되어있을 때 보여줄 페이지 : 소셜 로그인 페이지 (Login), 회원가입 페이지 (InfoScreen)
          <>
            <RootStack.Screen name="Login" component={Login} />
            <RootStack.Screen name="SignUpStackNavigator" component={SignUpStackNavigator} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
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
    background: 'white',
  },
};
export default App;
