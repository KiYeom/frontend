import React, { useEffect } from 'react';
import {
  HomeBtn,
  HomeBtnTitle,
  HomeBtnDescription,
  HomeBtnText,
} from '../HomeBtn/HomeChatBtn.style';
import '../HomeBtn/HomeChatBtn';
import { css } from '@emotion/native';
import { View } from 'react-native';
import { getUserNickname } from '../../../utils/storageUtils';
import { rsHeight, rsWidth } from '../../../utils/responsive-size';
import { HomeStackName, RootStackName } from '../../../constants/Constants';
import Icon from '../../icons/icons';
import palette from '../../../assets/styles/theme';
import { EmotionImage } from '../HomeBtn/HomeChatBtn.style';

const EmotionBtn = ({ navigation }) => {
  const [name, setName] = React.useState<string>('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setName(getUserNickname() + '');
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);
  return (
    <>
      <HomeBtn
        onPress={() =>
          navigation.navigate(RootStackName.HomeStackNavigator, {
            screen: HomeStackName.LargeEmotionChart,
            //screen: HomeStackName.SmallEmotionChart,
          })
        }
        status={'emotion'}>
        <HomeBtnTitle>
          {name}님,{'\n'}오늘의 마음은 어떤가요?
        </HomeBtnTitle>
        <HomeBtnDescription>
          <HomeBtnText status={'mood'}>감정 기록하기</HomeBtnText>
          <Icon
            name="arrow-right"
            width={rsWidth * 6 + 'px'}
            height={rsHeight * 12 + 'px'}
            color={palette.neutral[500]}
          />
        </HomeBtnDescription>
        <View
          style={css`
            //background-color: pink;
            position: absolute;
            right: 0;
            bottom: 0;
            width: 100%;
            height: ${rsHeight * 130 + 'px'};
            justify-content: center;
            align-items: center;
          `}>
          <EmotionImage
            style={{
              resizeMode: 'contain',
              //backgroundColor: 'black',
            }}
            source={require('../../../assets/images/test.png')}
          />
        </View>
      </HomeBtn>
    </>
  );
};
export default EmotionBtn;
