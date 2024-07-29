import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import palette from '../../assets/styles/theme';
const GenderInput: React.FC<any> = () => {
  return (
    <View style={styles.container}>
      <Text>성별</Text>
      <View style={styles.btnContainer}>
        <Button
          mode="contained"
          textColor={palette.neutral[500]}
          rippleColor={palette.primary[400]}
          style={styles.btns}
          onPress={() => console.log('여성 클릭')}>
          여성
        </Button>
        <Button
          mode="contained"
          textColor={palette.neutral[500]}
          rippleColor={palette.primary[400]}
          style={styles.btns}
          onPress={() => console.log('남성 클릭')}>
          남성
        </Button>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    //backgroundColor: 'red',
    //height: 100,
  },
  btnContainer: {
    flexDirection: 'row',
    //backgroundColor: 'blue',
    justifyContent: 'space-between',
    width: '100%',
  },
  btns: {
    borderRadius: 10,
    width: '45%',
    backgroundColor: '#F6F6F6',
  },
});
export default GenderInput;
