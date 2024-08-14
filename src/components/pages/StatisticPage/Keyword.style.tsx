import styled from '@emotion/native';
import palette from '../../../assets/styles/theme';
import { rsWidth, rsHeight, rsFont } from '../../../utils/responsive-size';

export const KeywordContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-vertical: ${rsHeight * 14 + 'px'};
  padding-horizontal: ${rsWidth * 12 + 'px'};
  gap: ${rsHeight * 8 + 'px'};
  width: ${rsWidth * 350 + 'px'};
  height: auto;
  max-height: ${rsHeight * 70 + 'px'};
  overflow: hidden;
  box-sizing: border-box;
  background-color: white;
  border-radius: 10px;
`;

//네잎클로버 아이콘 배경 동그라미
export const KeywordIcon = styled.View<{ index: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${rsWidth * 42 + 'px'};
  height: ${rsWidth * 42 + 'px'};
  border-radius: ${rsHeight * 21 + 'px'};
  background-color: ${(props) => {
    switch (props.index) {
      case 0:
        return palette.primary[50];
      case 1:
        return '#FDF9D8';
      case 2:
        return '#EFECFF';
    }
  }};
`;

//키워드에 대한 설명
export const KeywordText = styled.Text`
  font-family: Pretendard-SemiBold;
  font-size: ${16 * rsFont + 'px'};
  color: ${palette.neutral[900]};
`;

//키워드 제목
export const KeywordTitle = styled.Text`
  font-family: Pretendard-SemiBold;
  font-size: ${18 * rsFont + 'px'};
  color: ${palette.neutral[900]};
`;

//키워드 전체 컨테이너 (제목 + 키워드들)
export const Container = styled.View`
  width: ${350 * rsWidth + 'px'};
  height: auto;
  max-height: ${259 * rsHeight + 'px'};
  gap: ${12 * rsHeight + 'px'};
`;
