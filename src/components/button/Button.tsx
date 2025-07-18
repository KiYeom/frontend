import React from 'react';
import Icon from '../icons/icons';
import './Button.styles';
import { ButtonContainer, ButtonLabel } from './Button.styles';
//버튼

export type ButtonProps = {
  title: string;
  disabled?: boolean;
  primary: boolean;
  onPress?: () => void;
  icon?: string | undefined;
};

const Button = (props: ButtonProps) => {
  const { title, disabled = false, primary = true, onPress = () => {}, icon } = props;

  return (
    <ButtonContainer
      disabled={disabled}
      primary={primary}
      activeOpacity={1}
      onPress={onPress}
      icon={icon}>
      {icon && <Icon name={icon} width={24} height={25} color={'#ffffff'} />}
      <ButtonLabel disabled={disabled} primary={primary}>
        {title}
      </ButtonLabel>
    </ButtonContainer>
  );
};

export default Button;
