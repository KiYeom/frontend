import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import StatisticMain from '../components/pages/StatisticPage/StatisticMain';
import { StatisticStackName } from '../constants/Constants';
import PeriodStatisticPage from '../components/pages/StatisticPage/PeriodStatisticPage';

const StatisticStack = createNativeStackNavigator();

const StatisticStackNavigator: React.FC = ({}) => {
  return (
    <StatisticStack.Navigator>
      <StatisticStack.Screen
        name={StatisticStackName.Daily}
        component={StatisticMain}
        options={{
          headerShown: false,
        }}
      />
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
