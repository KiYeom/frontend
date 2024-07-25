import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Login from './src/components/pages/SignInPage/Login';
import BottomTabNavigator from './src/navigators/BottomTabNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as Device from 'expo-device';
import { GOOGLE_KEY } from './src/utils/storageUtils';
import axios from 'axios';
import { storage } from './src/utils/storageUtils';
import { USER, ACCESSTOKEN, REFRESHTOKEN, CHATLOG } from './src/constants/Constants';
import useIsSignInState from './src/store/signInStatus';
import useNoticeState from './src/store/notice';
import { Platform } from 'react-native';
import * as Application from 'expo-application';
import { Portal, Modal, PaperProvider } from 'react-native-paper';
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

  //앱이 처음 실행이 될 때 현재 우리 앱의 유저인지 파악
  useEffect(() => {
    //storage.delete(ACCESSTOKEN);
    //storage.delete(REFRESHTOKEN);
    console.log('========== 앱 실행 ==========');

    const bootstrapAsync = async () => {
      try {
        const accessToken = storage.getString(ACCESSTOKEN);
        const refreshToken = storage.getString(REFRESHTOKEN);
        //console.log("access token : ", accessToken);
        //console.log("refresh token : ", refreshToken);
        //setIsSignIn(!!accessToken);  //access Token이 없으면 signin = true, 있으면 false..?
        USER.DEVICEOS = '' + Device.osName + Device.osVersion;
        if (Device.osName == 'iOS' || Device.osName == 'iPadOS') {
          const deviceIdCode = await Application.getIosIdForVendorAsync();
          USER.DEVICEID = deviceIdCode;
        } else if (Device.osName == 'Android') {
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
                USER.NICKNAME = response.data.data.nickname; //전달받은 정보를 저장
                if (response.data.data.notice != null) {
                  setNotice(response.data.data.notice);
                }
                setIsSignIn(true); //로그인에 성공했으므로 signIn = true
              } catch (error: any) {
                setIsSignIn(false);
                //console.log("로그인 완료, isSignIn : ", isSignIn);
                //console.log("로그인 안 됨 json", error)
              }
            })
            .catch(function (error) {
              //요청에 실패한 경우 = access token 재발급 실패 (refresh token도 만료되어 재발급 불가한 상황)
              console.log('access token 재발급 안 됨 됨 json', error);
              console.log('==============app.tsx==========', USER.PROVIDERCODE);
              console.log('토큰 발급 실패, access token : ', accessToken);
              console.error('토큰 갱신 실패 - 상세 정보: ', error.message);
              console.log('config : ', error.config);
              console.log('config : ', error.code);
              console.log('request : ', error.request);
              console.log('refreshToken error(data): ', error.response.data);
              console.log('refreshToken error(stats)', error.response.status);
              console.log('refreshToken error(headers)', error.response.headers);
              setIsSignIn(false); //로그인 실패
              console.log('요청 실패 isSignIn : ', isSignIn);
              setIsSignIn(true); //디버깅을 위한 true (구글 키)
              storage.delete(CHATLOG); //디버깅을 위한 초기화
            });
        } else {
          //토큰이 없으면, 다른 기기에서 접근한 것이거나 우리의 회원이 아니다. 로그인 화면을 보여준다.
          setIsSignIn(false); //로그인 실패
          console.log('토큰이 없는 경우 isSignIn : ', isSignIn);
          console.log(
            '토큰이 없다 = 다른 기기에 접근한 유저이거나 새로운 유저이다. 로그인 화면을 보여준다'
          );
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false); //로딩 완료
    };
    bootstrapAsync();
  }, []);

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
        <NavigationContainer>
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
export default App;
