//커스텀 바텀 시트 스타일링
import { css } from '@emotion/native';
import styled from '@emotion/native';
import { rsWidth, rsHeight, rsFont } from '../../utils/responsive-size';
import palette from '../../assets/styles/theme';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

export const IntroText = styled.Text`
  font-size: ${rsFont * 16 + 'px'};
  font-family: Pretendard-Medium;
  color: ${palette.neutral[500]};
`;

export const IntroContainer = styled.View`
  //background-color: yellow;
  padding-vertical: ${rsHeight * 14 + 'px'};
  padding-left: ${rsWidth * 20 + 'px'};
  width: 100%;
`;

export const EmotionIconContainer = styled.View`
  flex-direction: row;
  //background-color: black;
  padding-horizontal: ${rsWidth * 20 + 'px'};
  padding-vertical: ${rsHeight * 10 + 'px'};
  justify-content: space-between;
  width: 100%;
`;

export const BottomSheetTextInputContainer = styled.View`
  padding-horizontal: ${rsWidth * 20 + 'px'};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-vertical: ${rsHeight * 10 + 'px'};
`;

export const StyledBottomSheetTextInput = styled(BottomSheetTextInput)`
  width: 100%;
  height: ${rsHeight * 52 + 'px'};
  border-radius: 10px;
  align-items: center;
  background-color: ${palette.neutral[50]};
  padding-vertical: ${rsHeight * 18 + 'px'};
  padding-horizontal: ${rsWidth * 18 + 'px'};
`;

export const TextLengthAlert = styled.Text<{ text?: string }>`
  color: ${(props) =>
    props.text?.length && props.text.length > 10 ? 'red' : palette.neutral[300]};
  font-size: ${rsFont * 12 + 'px'};
  margin-top: ${rsHeight * 4 + 'px'};
  width: 100%;
  text-align: right;
`;

export const ButtonContainer = styled.View`
  padding-top: ${rsHeight * 20 + 'px'};
  width: 100%;
  padding-horizontal: ${rsWidth * 20 + 'px'};
  //background-color: blue;
  flex: 1;
`;
