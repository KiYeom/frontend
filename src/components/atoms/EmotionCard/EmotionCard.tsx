import { css } from '@emotion/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import palette from '../../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';
import Icon, { TIconName } from '../../icons/icons';

//simple : 홈 화면에서 보이는 내가 선택한 카드
//default : 일기 작성 페이지에서 삭제 가능한 카드 -> 작은 칩으로 변경힘
//default-view : 일일리포트의 내가 선택한 감정 카드
//small : 안씀
export type EmotionCardProps = {
  status: 'default' | 'simple' | 'default-view' | 'small';
  emotion: any;
  onPress?: (emotion) => void;
};

const EmotionCard = (props: EmotionCardProps) => {
  const { status, emotion, onPress } = props;

  return (
    <View
      style={css`
        height: ${status === 'default' ? rsHeight * 35 + 'px' : rsHeight * 100 + 'px'};
        //height: ${rsHeight * 100 + 'px'};
        width: ${status === 'simple'
          ? rsWidth * 60 + 'px'
          : status === 'default-view'
            ? rsWidth * 100 + 'px'
            : 'auto'};
        background-color: white;
        border-radius: ${status === 'default' ? 100 + 'px' : 10 + 'px'};
        //border-radius: 10px;
        align-items: center;
        justify-content: ${status === 'default-view' ? 'space-evenly' : 'center'};
        //justify-content: center;
        text-align: center;
        //border: 1px solid ${palette.neutral[100]};
        border: ${status === 'default'
          ? `1px solid ${palette.neutral[300]}`
          : `1px solid ${palette.neutral[100]}`};
        padding-vertical: ${status === 'default' ? rsHeight * 7 + 'px' : 'none'};
        padding-horizontal: ${status === 'default' ? rsWidth * 14 + 'px' : 'none'};
        //background-color: ${status === 'default' ? 'pink' : 'blue'};
      `}>
      {status !== 'default' && <Icon name={`${emotion.group}-emotion` as TIconName} width={45} />}
      {status !== 'simple' && (
        <Text
          style={css`
            //margin-top: ${rsWidth * 10 + 'px'};
            font-family: Pretendard-Medium;
            font-size: ${rsFont * 14 + 'px'};
            color: ${palette.neutral[900]};
          `}>
          {emotion.keyword}
        </Text>
      )}
    </View>
  );
};
export default EmotionCard;
