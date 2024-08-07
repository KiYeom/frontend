import styled from '@emotion/native';
import palette from '../../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';

export const HomeBtn = styled.TouchableOpacity`
  flex : 1,
  height: ${rsHeight * 400 + 'px'};
  background-color: ${palette.primary[50]};
  border-radius: 20px;
`;

export const HomeBtnTitle = styled.Text`
  font-size: ${rsFont * 24 + 'px'};
  color: ${palette.neutral[900]};
  font-family: Pretendard-SemiBold;
  margin-top: ${rsHeight * 40 + 'px'};
  margin-left: ${rsWidth * 24 + 'px'};
  letter-spacing: ${rsWidth * -0.41 + 'px'};
  line-height: ${rsHeight * 32 + 'px'};
`;

export const HomeBtnText = styled.Text`
  font-size: ${rsFont * 16 + 'px'};
  color: ${palette.primary[500]};
  font-family: Pretendard-Medium;
  margin-left: ${rsWidth * 24 + 'px'};
  letter-spacing: ${rsWidth * -0.41 + 'px'};
  line-height: ${rsHeight * 32 + 'px'};
`;

export const ImageContainer = styled.View`
  margin-top: ${rsHeight * 13 + 'px'};
  width: 100%;
  flex: 1 0 auto;
  position: relative;
`;

export const Cookie = styled.Image`
  height: ${rsHeight * 155 + 'px'};
  margin-left: ${rsHeight * 103 + 'px'};
  object-fit: contain;
  position: absolute;
`;

export const Leaf = styled.Image`
  height: ${rsHeight * 155 + 'px'};
  margin-left: ${rsHeight * 53 + 'px'};
  object-fit: contain;
  position: absolute;
  margin-top: ${rsHeight * 92 + 'px'};
`;
