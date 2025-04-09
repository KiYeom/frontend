import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function AuthPage() {
  return (
    <View>
      <Text>리마인드 처음 로그인 페이지</Text>
      <Link href="/auth/signup">signup버튼</Link>
    </View>
  );
}
