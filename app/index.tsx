import { View, Text } from 'react-native';
import { Redirect } from 'expo-router';
import React from 'react';

export default function Page() {
  //const { user } = useAuth();

  //const user = '1123';
  const user = null;

  //로그인 상태에 따라 리다이렉트
  if (!user) {
    return <Redirect href="/auth" />;
  }

  //return <Redirect href="/stackChat" />;
  return <Redirect href="/home" />;
}
