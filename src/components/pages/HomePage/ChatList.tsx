import { css } from '@emotion/native';
import { Image } from 'expo-image';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import palette from '../../../assets/styles/theme';
import { rsHeight, rsWidth } from '../../../utils/responsive-size';
import Icon from '../../icons/icons';
import { useNavigation } from '@react-navigation/native';
import { RootStackName, HomeStackName } from '../../../constants/Constants';
import { useEffect } from 'react';
const ChatList = () => {
  const navigation = useNavigation();
  return (
    <View
      style={css`
        flex: 1;
        padding-vertical: ${20 * rsHeight + 'px'};
        padding-horizontal: ${20 * rsWidth + 'px'};
        //background-color: pink;
      `}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(RootStackName.HomeStackNavigator, {
            screen: HomeStackName.NewChat,
          });
        }}
        style={css`
          //background-color: red;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          gap: ${30 * rsWidth + 'px'};
        `}>
        <Image
          source={require('../../../assets/images/cookieprofile.png')}
          style={{ objectFit: 'contain', width: 60 * rsWidth, height: 60 * rsHeight }}
        />
        <View
          style={css`
            flex: 1;
            flex-direction: row;
            justify-content: space-between;
          `}>
          <Text
            style={css`
              font-size: ${20 * rsWidth + 'px'};
              font-family: Pretendard-Medium;
              color: ${palette.neutral[900]};
            `}>
            쿠키
          </Text>
          <Icon
            name="arrow-right"
            width={20 * rsWidth}
            height={20 * rsHeight}
            color={palette.neutral[400]}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ChatList;
