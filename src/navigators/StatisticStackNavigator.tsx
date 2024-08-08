import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import StatisticMain from '../components/pages/StatisticPage/StatisticMain';
import Header from '../components/header/header';

const StatisticStackNavigator: React.FC = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Statistic"
        component={StatisticMain}
        options={{ header: () => <Header title="통계" /> }}
      />
    </Stack.Navigator>
  );
};
export default StatisticStackNavigator;
