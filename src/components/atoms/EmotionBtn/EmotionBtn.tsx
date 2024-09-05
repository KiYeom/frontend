import React, { useEffect } from 'react';
import {
  HomeBtn,
  HomeBtnTitle,
  HomeBtnDescription,
  HomeBtnText,
} from '../HomeBtn/HomeChatBtn.style';
import '../HomeBtn/HomeChatBtn';
import { getUserNickname } from '../../../utils/storageUtils';
import { rsHeight, rsWidth } from '../../../utils/responsive-size';
import { HomeStackName, RootStackName } from '../../../constants/Constants';
import Icon from '../../icons/icons';
import palette from '../../../assets/styles/theme';

const EmotionBtn = ({ navigation }) => {
  return (
    <>
      <HomeBtnDescription>
        <HomeBtnText>오늘의 감정 입력하기</HomeBtnText>
        <Icon
          name="arrow-right"
          width={rsWidth * 6 + 'px'}
          height={rsHeight * 12 + 'px'}
          color={palette.primary[500]}
        />
      </HomeBtnDescription>
      <HomeBtn
        onPress={() =>
          navigation.navigate(RootStackName.HomeStackNavigator, {
            screen: HomeStackName.LargeEmotionChart,
            //screen: HomeStackName.SmallEmotionChart,
          })
        }></HomeBtn>
    </>
  );
};
export default EmotionBtn;
