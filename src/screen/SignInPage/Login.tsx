import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { Platform } from 'react-native';

import { Button, View, Text, TouchableOpacity, Image } from 'react-native';
import { useEffect, useState } from 'react';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import GoogleLoginButton from '../../components/GoogleLoginButton';
import { StyleSheet } from 'react-native';
import AppleLoginButton from '../../components/AppleLoginButton';

//로그인 페이지
const Login: React.FC<any> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../../assets/cookieSplash.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.btnContainer}>
        <GoogleLoginButton navigation={navigation} />
        {Platform.OS === 'ios' ? <AppleLoginButton navigation={navigation} /> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 50,
  },
  image: {
    width: 500,
    height: 500,
  },
  btnContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 10,
    color: '#333',
  },
});

export default Login;
