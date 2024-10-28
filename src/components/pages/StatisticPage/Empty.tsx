import { Image } from 'expo-image';
import React from 'react';
import { rsHeight, rsWidth } from '../../../utils/responsive-size';
import { DescText, EmptyContainer } from './StatisticMain.style';

export type EmptyTypeProps = {
  type: '채팅기록' | '감정기록' | '한줄일기';
};

const Empty = (props: EmptyTypeProps) => {
  const { type } = props;
  let descText: string = '';
  if (type === '채팅기록') {
    descText = '아직 쿠키와 채팅한 내역이 없어요!';
  } else if (type === '감정기록') {
    descText = '기록한 나의 감정이 없어요!';
  } else if (type === '한줄일기') {
    descText = '기록한 한줄 일기가 없어요!';
  }
  return (
    <EmptyContainer>
      <Image
        source={require('../../../assets/images/graycookie.png')}
        style={{
          width: rsWidth * 100,
          height: rsHeight * 65,
          resizeMode: 'contain',
        }}
      />
      <DescText>{descText}</DescText>
    </EmptyContainer>
  );
};
export default Empty;
