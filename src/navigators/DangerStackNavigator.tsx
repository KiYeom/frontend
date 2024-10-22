import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Header from '../components/header/header';
import ClinicPage from '../components/pages/DangerPage/ClinicPage';
import DangerAlertPage from '../components/pages/DangerPage/DangerAlertPage';
import { DangerStackName } from '../constants/Constants';

const DangerStack = createNativeStackNavigator();

const DangerStackNavigator: React.FC = () => {
  return (
    <DangerStack.Navigator>
      <DangerStack.Screen
        name={DangerStackName.Clinic}
        component={ClinicPage}
        options={{ header: () => <Header title="상담소 소개" /> }}
      />
      <DangerStack.Screen
        name={DangerStackName.DangerAlert}
        component={DangerAlertPage}
        options={{ header: () => <Header /> }}
      />
    </DangerStack.Navigator>
  );
};
export default DangerStackNavigator;
