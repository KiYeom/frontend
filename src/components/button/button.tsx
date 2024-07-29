import React from 'react';
import './button.styles';
import { ButtonLabel, ButtonContainer } from './button.styles';

export type ButtonProps = {
  title: string;
  disabled?: boolean;
  primary: boolean;
  onPress?: () => void;
};

const Button = (props: ButtonProps) => {
  const { title, disabled = false, primary = true, onPress = () => {} } = props;

  return (
    <ButtonContainer disabled={disabled} primary={primary} activeOpacity={1} onPress={onPress}>
      <ButtonLabel disabled={disabled} primary={primary}>
        {title}
      </ButtonLabel>
    </ButtonContainer>
  );
};

export default Button;
