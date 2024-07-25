import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { IconButton } from 'react-native-paper';
import { USER } from '../../constants/Constants';

const UserInfomation: React.FC<any> = ({ navigation }) => {
  return (
    <View style={styles.userName}>
      <Image source={require('../../assets/icons/profileImage.png')} />
      <Text style={styles.userInfoText}>{USER.NICKNAME}</Text>
      <IconButton
        icon="chevron-right"
        iconColor="black"
        size={20}
        onPress={() => {
          //showModal('nickname')
          navigation.navigate('SettingStackNavigator', { screen: 'EditUserInfo' });
        }}
      />
    </View>
  );
};
export default UserInfomation;

const styles = StyleSheet.create({
  userInfo: {
    ///backgroundColor : "yellow",
    width: '100%',
    padding: 16,
    borderColor: 'f0f3f8',
    borderBottomWidth: 0.3,
  },
  userName: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  userInfoText: {
    color: 'black',
    fontSize: 20,
  },
});
