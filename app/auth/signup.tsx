import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function LoginPage() {
  return (
    <View>
      <Text>회원가입 페이지</Text>
      <Link replace href="/stackChat">
        회원가입 완료 버튼
      </Link>
    </View>
  );
}
