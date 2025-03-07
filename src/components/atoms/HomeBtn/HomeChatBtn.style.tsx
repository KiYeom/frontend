import styled from '@emotion/native';
import palette from '../../../assets/styles/theme';
import { ratio, rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';

export const HomeBtn = styled.TouchableOpacity<{ status: string; os: string; riskStatus: string }>`
  height: ${rsHeight * 279 + 'px'};
  background-color: ${(props) =>
    props.status === 'home'
      ? props.riskStatus === 'danger' || 'danger-opened'
        ? palette.risk[100]
        : palette.primary[50]
      : palette.neutral[50]};
  border-radius: ${ratio * 20 + 'px'};
  //elevation in android and box-shadow in ios
  ${(props) =>
    props.os === 'android' ? 'elevation: 8;' : 'box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);'}
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

export const HomeBtnDescription = styled.View<{ color: string }>`
  flex-direction: row;
  margin-left: ${rsWidth * 24 + 'px'};
  margin-top: ${rsHeight * 4 + 'px'};
  align-items: center;
  align-self: flex-start;
  width: auto;
  height: auto;
  background-color: ${(props) => props.color};
  border-radius: 10px;
  padding: 2px 10px;
`;

export const HomeBtnText = styled.Text<{ status: string }>`
  font-size: ${rsFont * 16 + 'px'};
  //color: ${palette.primary[500]};
  color: ${(props) => (props.status === 'home' ? palette.primary[50] : palette.neutral[50])};
  font-family: Pretendard-Bold;
  letter-spacing: ${rsWidth * -0.41 + 'px'};
  line-height: ${rsHeight * 32 + 'px'};
  margin-right: ${rsWidth * 8 + 'px'};
`;

export const CookieImage = styled.Image`
  position: absolute;
  right: 0;
  bottom: 0;
  width: ${rsWidth * 220 + 'px'};
  height: ${rsHeight * 150 + 'px'};
  object-fit: contain;
`;

export const RiskCookieImage = styled.Image`
  position: absolute;
  right: 0;
  bottom: 0;
  width: ${rsWidth * 240 + 'px'};
  height: ${rsHeight * 170 + 'px'};
  object-fit: contain;
`;

export const EmotionImage = styled.Image`
  //position: absolute;
  //right: 0;
  //bottom: 0;
  width: ${rsWidth * 300 + 'px'};
  height: ${rsHeight * 130 + 'px'};
  object-fit: contain;
`;
