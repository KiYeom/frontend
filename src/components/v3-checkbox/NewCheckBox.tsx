/** @jsxImportSource @emotion/react */
import React from 'react';
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from '@emotion/native';
import palette from '../../assets/styles/theme';
import { Container, MessageText, CustomCheckbox, boxSize } from './NewCheckBox.style';
/*
const boxSize = 25;

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  //background-color: yellow;
  justify-content: flex-start;
`;

const MessageText = styled.Text`
  font-size: 14px;
  margin-left: 8px;
  font-family: 'Pretendard-Regular';
  color: ${palette.neutral[900]};
`;

// Custom checkbox that mimics Paper's Checkbox.Android
const CustomCheckbox = styled.TouchableOpacity`
  width: ${boxSize + 'px'};
  height: ${boxSize + 'px'};
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  //background-color: red;
`;*/

interface CustomCheckBoxProps {
  checked: boolean;
  onToggle: () => void;
  message: string;
  color?: string;
  uncheckedColor?: string;
}

const NewCheckBox: React.FC<CustomCheckBoxProps> = ({
  checked,
  onToggle,
  message,
  color = palette.primary[400],
  uncheckedColor = palette.neutral[200],
}) => {
  return (
    <Container>
      <CustomCheckbox onPress={onToggle} activeOpacity={0.7}>
        {checked ? (
          <MaterialCommunityIcons
            name="checkbox-marked"
            size={boxSize}
            color={color}
            style={{ padding: 0, margin: 0 }}
          />
        ) : (
          <MaterialCommunityIcons
            name="checkbox-blank-outline"
            size={boxSize}
            color={uncheckedColor}
          />
        )}
      </CustomCheckbox>
      <MessageText>{message}</MessageText>
    </Container>
  );
};

export default NewCheckBox;
