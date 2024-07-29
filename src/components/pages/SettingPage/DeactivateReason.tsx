import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import CustomTextArea from '../../atoms/CustomTextArea';
import DeactivateReasonCheckBoxs from '../../molecules/DeactivateReasonCheckBoxs';
import Calender from '../../../assets/images/calendar.svg';
import { Alert } from 'react-native';
import { USER } from '../../../constants/Constants';

const DeactivateReason: React.FC = ({ route }) => {
  const { deactivateRequest } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.txt}>
        {USER.NICKNAME}님,{'\n'}떠나시는 이유를 알려주세요
      </Text>
      <View style={{ flexGrow: 1, marginTop: 40 }}>
        <DeactivateReasonCheckBoxs />
        <CustomTextArea />
      </View>
      <Button
        mode="contained"
        onPress={() => {
          console.log('탈퇴 버튼 누름');
          Alert.alert(
            '정말 탈퇴하시겠어요?', // 첫번째 text: 타이틀 큰 제목
            '탈퇴 버튼 선택 시, 계정은 삭제되며 복구되지 않습니다', // 두번째 text: 작은 제목
            [
              { text: '취소', onPress: () => console.log('탈퇴 취소함') },
              {
                text: '탈퇴', // 버튼 제목
                onPress: () => deactivateRequest(),
              },
            ],
            { cancelable: false } //alert 밖에 눌렀을 때 alert 안 없어지도록
          );
        }}
        style={{ marginVertical: 40 }}>
        탈퇴하기
      </Button>
    </View>
  );
};
export default DeactivateReason;
const styles = StyleSheet.create({
  checkbox: {
    marginBottom: 20,
  },
  row: {
    alignItems: 'center',
  },
  txt: {
    fontSize: 28,
    marginTop: 40,
  },
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    flex: 1,
  },
});
