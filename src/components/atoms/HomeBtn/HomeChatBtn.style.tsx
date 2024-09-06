import styled from '@emotion/native';
import palette from '../../../assets/styles/theme';
import { ratio, rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';

export const HomeBtn = styled.TouchableOpacity<{ status: string }>`
  height: ${rsHeight * 279 + 'px'};
  background-color: ${palette.primary[50]};
  background-color: ${(props) =>
    props.status === 'home' ? palette.primary[50] : palette.neutral[50]};
  border-radius: ${ratio * 20 + 'px'};
`;

export const HomeBtnTitle = styled.Text`
  font-size: ${rsFont * 24 + 'px'};
  font-family: Pretendard-SemiBold;
  color: ${palette.neutral[900]};

  margin-top: ${rsHeight * 40 + 'px'};
  margin-left: ${rsWidth * 24 + 'px'};

  letter-spacing: ${rsWidth * -0.41 + 'px'};
  line-height: ${rsHeight * 32 + 'px'};
`;

export const HomeBtnDescription = styled.View`
  flex-direction: row;
  margin-left: ${rsWidth * 24 + 'px'};
  margin-top: ${rsHeight * 4 + 'px'};
  align-items: center;
  width: auto;
  height: auto;
`;

export const HomeBtnText = styled.Text<{ status: string }>`
  font-size: ${rsFont * 16 + 'px'};
  //color: ${palette.primary[500]};
  color: ${(props) => (props.status === 'home' ? palette.primary[500] : palette.neutral[500])};
  font-family: Pretendard-Medium;
  letter-spacing: ${rsWidth * -0.41 + 'px'};
  line-height: ${rsHeight * 32 + 'px'};
  margin-right: ${rsWidth * 8 + 'px'};
`;

export const CookieImageContainer = styled.View`
  position: 'absolute';
  right: 0;
  bottom: 0;
  width: ${rsWidth * 244 + 'px'};
  height: ${rsHeight * 247 + 'px'};
`;

export const CookieImage = styled.Image`
  position: absolute;
  right: 0;
  bottom: 0;
  width: ${rsWidth * 220 + 'px'};
  height: ${rsHeight * 177 + 'px'};
  object-fit: contain;
`;

export const EmotionImage = styled.Image`
  position: absolute;
  right: 20;
  bottom: -20;
  width: ${rsWidth * 300 + 'px'};
  height: ${rsHeight * 177 + 'px'};
  object-fit: contain;
`;

export const Leaf = styled.Image`
  height: ${rsHeight * 155 + 'px'};
  margin-left: ${rsHeight * 53 + 'px'};
  object-fit: contain;
  position: absolute;
  margin-top: ${rsHeight * 92 + 'px'};
`;

export const LeafTest = styled.Image`
  height: ${rsHeight * 155 + 'px'};
  object-fit: contain;
  background-color: pink;
`;
