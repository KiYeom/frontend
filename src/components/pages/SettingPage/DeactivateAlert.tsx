import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { View, Text } from 'react-native-ui-lib';
import CustomTextArea from '../../atoms/CustomTextArea';
import CustomCheckBox from '../../atoms/CustomCheckBox';
import DeactivateReasonCheckBoxs from '../../molecules/DeactivateReasonCheckBoxs';
import palette from '../../../assets/styles/theme';
import { storage } from '../../../utils/storageUtils';
import { Image } from 'react-native';
import HeartMessage from '../../../assets/images/heartMessage.svg';
import { CHATLOG } from '../../../constants/Constants';
const DeactivateAlert: React.FC = ({ route, navigation }) => {
  const { deactivateRequest } = route.params;
  const chats = storage.getString(CHATLOG);
  const chatArray = JSON.parse(chats);
  const chatCount = chatArray ? chatArray.length : 0;
  console.log('chats ========', chatCount);
  return (
    <View style={{ justifyContent: 'center', backgroundColor: 'white' }}>
      <Text style={styles.txt}>
        reMIND에서 쿠키와 {'\n'}
        {chatCount}번의 대화를 나누었어요!
      </Text>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <HeartMessage width={100} style={{ padding: 0, margin: 0 }} />
        <Image
          source={require('../../../assets/images/cal.jpg')}
          style={{ width: 150, height: 150, resizeMode: 'contain' }}
        />
      </View>

      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 14, color: palette.neutral[300] }}>
          탈퇴 후, 모든 데이터는 복구가 불가능합니다.
        </Text>
        <Button
          mode="contained"
          style={{ width: '90%' }}
          onPress={() => {
            navigation.navigate('DeactivateReason', { deactivateRequest });
          }}>
          탈퇴하기
        </Button>
      </View>
    </View>
  );
};
export default DeactivateAlert;

const styles = StyleSheet.create({
  checkbox: {
    marginBottom: 20,
  },
  row: {
    alignItems: 'center',
  },
  txt: {
    fontSize: 28,
  },
});
