import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import StatisticMain from '../components/pages/StatisticPage/StatisticMain';
import { StatisticStackName } from '../constants/Constants';
const StatisticStack = createNativeStackNavigator();

const StatisticStackNavigator: React.FC = ({}) => {
  return (
    <StatisticStack.Navigator>
      <StatisticStack.Screen
        name={StatisticStackName.Daily}
        component={StatisticMain}
        options={{
          header: () => <></>,
          gestureEnabled: false, // 스와이프로 뒤로 가기 비활성화
        }}
      />
    </StatisticStack.Navigator>
  );
};
export default StatisticStackNavigator;
