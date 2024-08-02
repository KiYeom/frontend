import { StyleSheet, View, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Login from './src/components/pages/sign-in/sign-in';
import BottomTabNavigator from './src/navigators/BottomTabNavigator';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Device from 'expo-device';
import axios from 'axios';
import { storage } from './src/utils/storageUtils';
import {
  USER,
  ACCESSTOKEN,
  REFRESHTOKEN,
  CHATLOG,
  NICKNAME,
  GENDER,
  BIRTHDATE,
} from './src/constants/Constants';
import useIsSignInState from './src/store/signInStatus';
import useNoticeState from './src/store/notice';
import { useFonts } from 'expo-font';
import * as Application from 'expo-application';
import { PaperProvider } from 'react-native-paper';
import * as amplitude from '@amplitude/analytics-react-native';
import SettingStackNavigator from './src/navigators/SettingStackNavigator';
import SignUpStackNavigator from './src/navigators/SignUpStackNavigator';
import HomeStackNavigator from './src/navigators/HomeStackNavigator';
amplitude.init(process.env.EXPO_PUBLIC_AMPLITUDE);
amplitude.track('Sign Up');

const RootStack = createNativeStackNavigator();

const App: React.FC = () => {
  const [loading, setLoading] = useState(true); //로딩중이면 true, 로딩이 끝났으면 false
  const { isSignIn, setIsSignIn } = useIsSignInState(); //store에서 가지고 온 전역 state
  //회원인데 로그인이 안 되어있거나 회원이 아니라면 isSignIn == false, 회원이고 로그인도 됐다면 isSignIns == true
  const { notice, setNotice } = useNoticeState(); //store 폴더에서 가지고 온 전역 state

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

  //앱이 처음 실행이 될 때 현재 우리 앱의 유저인지 파악
  useEffect(() => {
    //storage.delete(ACCESSTOKEN);
    //storage.delete(REFRESHTOKEN);
    //setIsSignIn(true);
    bootstrap();
  }, [loaded]);

  const bootstrap = async (): Promise<void> => {
    try {
      const accessToken = storage.getString(ACCESSTOKEN);

      USER.DEVICEOS = '' + Device.osName + Device.osVersion;
      if (Device.osName === 'iOS' || Device.osName == 'iPadOS') {
        const deviceIdCode = await Application.getIosIdForVendorAsync();
        USER.DEVICEID = deviceIdCode;
      } else if (Device.osName === 'Android') {
        const deviceIdCode = await Application.getAndroidId();
        USER.DEVICEID = deviceIdCode;
      }

      //토큰이 있으면 우리 회원 -> refresh token으로 access token 재발급하기
      if (accessToken) {
        axios
          .patch('https://api.remind4u.co.kr/v1/auth/refresh', {
            deviceId: USER.DEVICEID,
            appVersion: USER.APPVERSION,
            deviceOs: USER.DEVICEOS,
            refreshToken: storage.getString(REFRESHTOKEN),
            isAppStart: true,
          })
          .then(function (response) {
            try {
              //요청에 성공한 경우 = access token을 재발급 완료
              storage.set(ACCESSTOKEN, response.data.data.accessToken); //새로 발급된 access token 저장
              storage.set(NICKNAME, response.data.data.nickname); //닉네임, 생년월일, 성별 정보 저장
              storage.set(GENDER, response.data.data.birthDate);
              storage.set(BIRTHDATE, response.data.data.birthDate);
              if (response.data.data.notice != null) {
                setNotice(response.data.data.notice);
              }
              setIsSignIn(true); //로그인에 성공했으므로 signIn = true
            } catch (error) {
              setIsSignIn(false);
            }
          })
          .catch(function (error) {
            //FIXME: console.log 삭제 예정
            console.log('access token 재발급 안 됨 됨 json', error);
            console.log('==============app.tsx==========', USER.PROVIDERCODE);
            console.log('토큰 발급 실패, access token : ', accessToken);
            console.error('토큰 갱신 실패 - 상세 정보: ', error.message);
            console.log('config : ', error.config);
            console.log('config : ', error.code);
            console.log('request : ', error.request);
            console.log('refreshToken error(data): ', error.response.data);
            console.log('refreshToken error(stats)', error.response.status); //TODO : 500번 에러
            console.log('refreshToken error(headers)', error.response.headers);
            setIsSignIn(false); //로그인 실패
            console.log('요청 실패 isSignIn : ', isSignIn);
          });
      } else {
        //토큰이 없으면, 다른 기기에서 접근한 것이거나 우리의 회원이 아니다. 로그인 화면을 보여준다.
        setIsSignIn(false);
        console.log('토큰이 없는 경우 isSignIn : ', isSignIn);
        console.log(
          '토큰이 없다 = 다른 기기에 접근한 유저이거나 새로운 유저이다. 로그인 화면을 보여준다',
        );
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false); //로딩 완료
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#58C3A5" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer theme={navTheme}>
          <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Main">
            {isSignIn ? ( //로그인이 되어있을 경우 보여줄 페이지 : 홈 화면(Tabbar), 채팅화면 (Chat), 설정화면들
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
      </PaperProvider>
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
    background: 'white',
  },
};
export default App;
