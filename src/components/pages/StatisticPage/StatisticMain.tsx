import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native';
const StatisticMain: React.FC<any> = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ backgroundColor: 'pink', flex: 1 }}>
        <Text>통계 페이지</Text>
      </View>
    </SafeAreaView>
  );
};

export default StatisticMain;
