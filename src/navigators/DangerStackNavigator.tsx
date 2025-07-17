import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Header from '../components/header/Header';
import ClinicPage from '../pages/danger/ClinicPage';
import DangerAlertPage from '../pages/danger/DangerAlertPage';
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
