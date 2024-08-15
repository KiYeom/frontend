import React from 'react';
import { Image } from 'expo-image';
import { DescText } from './StatisticMain.style';
import { EmptyContainer } from './StatisticMain.style';
import { rsWidth, rsHeight } from '../../../utils/responsive-size';

export type EmptyTypeProps = {
  type: string;
};

//아무것도 없을 때 보이는 컨테이너
//type === "채팅기록" : 비어있는 강아지
//type === "감정기록" : 비어있는 달력
const Empty = (props: EmptyTypeProps) => {
  const { type } = props;
  return (
    <EmptyContainer>
      {type === '채팅기록' && (
        <>
          <Image
            source={require('../../../assets/images/graycookie.png')}
            style={{ objectFit: 'contain', width: 100 * rsWidth, height: 52.22 * rsHeight }}
          />
          <DescText>아직 쿠키와 채팅한 내역이 없어요!</DescText>
        </>
      )}
    </EmptyContainer>
  );
};
export default Empty;
