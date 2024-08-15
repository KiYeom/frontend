import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import StatisticMain from '../components/pages/StatisticPage/StatisticMain';
import { StatisticStackName } from '../constants/Constants';
import PeriodStatisticPage from '../components/pages/StatisticPage/PeriodStatisticPage';
const StatisticTab = createBottomTabNavigator();

const StatisticStackNavigator: React.FC = ({}) => {
  return (
    <StatisticTab.Navigator>
      <StatisticTab.Screen
        name={StatisticStackName.Daily}
        component={StatisticMain}
        options={{
          header: () => <></>,
        }}
      />
      <StatisticTab.Screen
        name={StatisticStackName.Period}
        component={PeriodStatisticPage}
        options={{
          header: () => <></>,
        }}
      />
    </StatisticTab.Navigator>
  );
};
export default StatisticStackNavigator;
