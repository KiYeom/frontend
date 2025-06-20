import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import PeriodStatisticPage from '../pages/StatisticPage/PeriodStatisticPage';
import StatisticMain from '../pages/StatisticPage/StatisticMain';
import { StatisticStackName } from '../constants/Constants';

const StatisticStack = createNativeStackNavigator();

const StatisticStackNavigator: React.FC = ({}) => {
  return (
    <StatisticStack.Navigator screenOptions={{ headerShown: false }}>
      <StatisticStack.Screen
        name={StatisticStackName.Period}
        component={PeriodStatisticPage}
        options={{
          headerShown: false,
        }}
      />
    </StatisticStack.Navigator>
  );
};
export default StatisticStackNavigator;
