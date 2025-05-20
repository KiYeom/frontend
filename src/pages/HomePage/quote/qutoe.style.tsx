import styled from '@emotion/native';
import palette from '../../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';
import { EdgeInsets } from 'react-native-safe-area-context';

export const TitleContainer = styled.View`
  //height: ${rsHeight * 200 + 'px'};
  height: auto;
  gap: ${rsHeight * 10 + 'px'};
  padding: ${rsHeight * 40 + 'px'} ${rsWidth * 24 + 'px'} 0 ${rsWidth * 24 + 'px'};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  //background-color: yellow;
`;
export const ImageContainer = styled.View`
  flex: 1;
  //background-color: pink;
  justify-content: center;
  align-items: center;
`;

export const AnimationContainer = styled.View`
  flex: 1;
  //background-color: pink;
  justify-content: center;
  width: 100%;
`;
export const TitleTextContainter = styled.View`
  gap: ${rsHeight * 5 + 'px'};
  display: flex;
  flex-direction: column;
  //background-color: yellow;
  flex: 1;
`;
export const Annotation = styled.Text`
  font-size: ${rsFont * 18 + 'px'};
  font-family: Pretendard-SemiBold;
  color: ${palette.primary[400]};
`;

export const Title = styled.Text`
  font-size: ${rsFont * 30 + 'px'};
  font-family: Pretendard-SemiBold;
  color: ${palette.neutral[900]};
`;

export const Container = styled.View<{ insets: EdgeInsets }>`
  //padding-top: ${(props) => props.insets.top + 'px'};
  flex: 1;
  justify-content: space-between;
  align-items: center;
  background-color: ${palette.neutral[50]};
`;

export const ButtonGroup = styled.View<{ insets: EdgeInsets }>`
  flex-direction: row;
  justify-content: space-between;
  gap: 20;
  padding-horizontal: 24;
  padding-bottom: ${(props) => props.insets.bottom + 20 + 'px'};
  z-index: 2;
  background-color: ${palette.neutral[50]};
`;
