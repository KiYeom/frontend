import styled from '@emotion/native';
import palette from '../../../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../../../utils/responsive-size';

export const RContainer = styled.View`
  width: 100%;
  gap: ${12 * rsHeight + 'px'};
  padding-horizontal: ${rsWidth * 20 + 'px'};
`;

//키워드 흰색 컨테이너
export const RecordContainer = styled.View`
  display: flex;
  align-items: start;
  justify-content: flex-start;
  padding-horizontal: ${rsWidth * 12 + 'px'};
  padding-vertical: ${rsHeight * 14 + 'px'};
  gap: ${rsWidth * 8 + 'px'};
  width: 100%;
  height: auto;
  overflow: hidden; //clip content
  box-sizing: border-box;
  background-color: white;
  border-radius: 10px;
`;

//네잎클로버 아이콘 배경 동그라미
export const RecordIcon = styled.View<{ index: number }>`
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

//키워드 제목
export const RecordTitle = styled.Text`
  font-family: Pretendard-SemiBold;
  font-size: ${18 * rsFont + 'px'};
  color: ${palette.neutral[900]};
`;

//키워드에 대한 설명
export const RecordText = styled.Text`
  font-family: Pretendard-SemiBold;
  font-size: ${16 * rsFont + 'px'};
  color: ${palette.neutral[900]};
`;

export const RTitle = styled.Text`
  font-family: Pretendard-SemiBold;
  font-size: ${18 * rsFont + 'px'};
  color: ${palette.neutral[900]};
`;
