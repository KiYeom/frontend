import { css } from '@emotion/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import palette from '../../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';
import Icon, { TIconName } from '../../icons/icons';

//simple : 홈 화면에서 보이는 내가 선택한 카드
//default : 일기 작성 페이지에서 삭제 가능한 카드 -> 작은 칩으로 변경 예정
//default-view :
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
        height: ${status === 'default' ? rsHeight * 30 + 'px' : rsHeight * 100 + 'px'};
        //height: ${rsHeight * 100 + 'px'};
        width: ${status === 'simple' ? rsWidth * 60 + 'px' : 'auto'};
        background-color: white;
        border-radius: ${status === 'default' ? 100 + 'px' : 10 + 'px'};
        //border-radius: 10px;
        padding-horizontal: ${rsWidth * 10 + 'px'};
        align-items: center;
        justify-content: center;
        //border: 1px solid ${palette.neutral[100]};
        border: ${status === 'default'
          ? `1px solid ${palette.neutral[300]}`
          : `1px solid ${palette.neutral[100]}`};
        padding-vertical: ${status === 'default' ? rsHeight * 7 + 'px' : 'none'};
        padding-horizontal: ${status === 'default' ? rsWidth * 14 + 'px' : 'none'};
      `}>
      {status !== 'default' && (
        <Icon name={`${emotion.group}-emotion` as TIconName} width={rsWidth * 25 + 'px'} />
      )}
      {status !== 'simple' && (
        <Text
          style={css`
            font-family: Pretendard-Medium;
            font-size: ${rsFont * 14 + 'px'};
            color: ${palette.neutral[900]};
          `}>
          {emotion.keyword}
        </Text>
      )}
      {/*status === 'default' && (
        <TouchableOpacity
          onPress={() => onPress(emotion)}
          style={css`
            position: absolute;
            right: 0;
            top: 0;
            width: ${rsWidth * 20 + 'px'};
            height: ${rsHeight * 22 + 'px'};
            background-color: yellow;
            align-items: center;
            justify-content: center;
          `}>
          <Icon name={'cancel-icon'} width={rsWidth * 10 + 'px'} height={rsHeight * 10 + 'px'} />
        </TouchableOpacity>
      )*/}
    </View>
  );
};
export default EmotionCard;
