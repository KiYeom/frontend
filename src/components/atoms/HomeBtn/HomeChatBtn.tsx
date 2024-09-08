import React, { useEffect } from 'react';
import './HomeChatBtn.style';
import {
  HomeBtnTitle,
  HomeBtnText,
  HomeBtn,
  HomeBtnDescription,
  CookieImage,
} from './HomeChatBtn.style';
import { getUserNickname } from '../../../utils/storageUtils';
import { rsHeight, rsWidth } from '../../../utils/responsive-size';
import { HomeStackName, RootStackName } from '../../../constants/Constants';
import Icon from '../../icons/icons';
import palette from '../../../assets/styles/theme';

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

      <HomeBtnDescription>
        <HomeBtnText status={'home'}>쿠키와 대화하러 가기</HomeBtnText>
        <Icon
          name="arrow-right"
          width={rsWidth * 6 + 'px'}
          height={rsHeight * 12 + 'px'}
          color={palette.primary[500]}
        />
      </HomeBtnDescription>

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
