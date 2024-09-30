import React, { useEffect } from 'react';
import { View } from 'react-native';
import palette from '../../../assets/styles/theme';
import { HomeStackName, RootStackName } from '../../../constants/Constants';
import { rsHeight, rsWidth } from '../../../utils/responsive-size';
import { getUserNickname } from '../../../utils/storageUtils';
import Icon from '../../icons/icons';
import './HomeChatBtn.style';
import {
  CookieImage,
  HomeBtn,
  HomeBtnDescription,
  HomeBtnText,
  HomeBtnTitle,
} from './HomeChatBtn.style';

const HomeChatBtn = ({ navigation }) => {
  const [name, setName] = React.useState<string>('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setName(getUserNickname() + '');
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  return (
    <HomeBtn
      onPress={() =>
        navigation.navigate(RootStackName.HomeStackNavigator, { screen: HomeStackName.Chat })
      }
      status={'home'}>
      <HomeBtnTitle>
        {name}님,{'\n'}오늘은 어떤 하루를 보내셨나요?
      </HomeBtnTitle>
      <View>
        <HomeBtnDescription color={palette.primary[400]}>
          <HomeBtnText status={'home'}>쿠키와 대화하러 가기</HomeBtnText>
          <Icon
            name="arrow-right"
            width={rsWidth * 6 + 'px'}
            height={rsHeight * 12 + 'px'}
            color={palette.primary[50]}
          />
        </HomeBtnDescription>
      </View>
      <CookieImage
        style={{
          resizeMode: 'contain',
        }}
        source={require('../../../assets/images/homebuttonimage.png')}
      />
    </HomeBtn>
  );
};
export default HomeChatBtn;
