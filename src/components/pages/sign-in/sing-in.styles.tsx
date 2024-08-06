import palette from '../../../assets/styles/theme';
import styled from '@emotion/native'; // Add this import
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';

export const LoginBtn = styled.TouchableOpacity<{ vendor: 'kakao' | 'google' | 'apple' }>`
  border-radius: 10px;
  height: 54px;
  gap: ${rsHeight * 12 + 'px'};
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: center;

  background-color: ${(props) =>
    props.vendor === 'kakao' ? '#FEE500' : props.vendor === 'google' ? 'white' : 'black'};
  border: ${(props) => (props.vendor === 'google' ? '1px solid #dcdcdc' : 'none')};
`;

export const LoginBtnLabel = styled.Text<{ vendor: 'kakao' | 'google' | 'apple' }>`
  font-size: ${rsFont * 20 + 'px'};
  font-family: Pretendard-SemiBold;
  color: ${(props) =>
    props.vendor === 'kakao'
      ? 'black'
      : props.vendor === 'google'
        ? 'rgba(0,0,0,0.54)'
        : '#FFFFFF'};
`;

export const LoginBtnIcon = styled.Image`
  width: ${rsWidth * 24 + 'px'};
  height: ${rsHeight * 24 + 'px'};
  object-fit: contain;
`;

export const ButtonContainer = styled.View`
  margin-bottom: ${rsHeight * 60 + 'px'};
  margin-top: auto;
  gap: ${rsHeight * 8 + 'px'};
`;

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  margin-horizontal: 20px;
`;

export const WelcomeTitle = styled.Text`
  font-size: ${rsFont * 30 + 'px'};
  color: ${palette.neutral[900]};
  font-family: Pretendard-SemiBold;
  margin-top: ${rsHeight * 92 + 'px'};
  margin-left: ${rsWidth * 20 + 'px'};
  letter-spacing: ${rsWidth * 0.5 + 'px'};
  line-height: ${rsHeight * 40 + 'px'};
`;

export const ImageContainer = styled.View`
  margin-top: ${rsHeight * 124 + 'px'};
  margin-left: ${rsWidth * 7 + 'px'};
  z-index: 1;
`;

export const CookieImage = styled.Image`
  width: ${rsWidth * 450 + 'px'};
  height: ${rsHeight * 231 + 'px'};
  object-fit: contain;
`;
