import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import StatisticMain from '../components/pages/StatisticPage/StatisticMain';

const StatisticStack = createNativeStackNavigator();

const StatisticStackNavigator: React.FC = ({}) => {
  return (
    <StatisticStack.Navigator>
      <StatisticStack.Screen
        name={''}
        component={StatisticMain}
        options={{ header: () => <></> }}
      />
    </StatisticStack.Navigator>
  );
};
export default StatisticStackNavigator;
