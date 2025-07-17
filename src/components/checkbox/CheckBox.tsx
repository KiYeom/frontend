/** @jsxImportSource @emotion/react */
// 커스텀 체크박스 컴포넌트
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import palette from '../../assets/styles/theme';
import { Container, MessageText, CustomCheckbox, boxSize } from './CheckBox.style';

interface CustomCheckBoxProps {
  checked: boolean;
  onToggle: () => void;
  message: string;
  color?: string;
  uncheckedColor?: string;
}

const CheckBox: React.FC<CustomCheckBoxProps> = ({
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

export default CheckBox;
