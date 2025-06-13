import React from 'react';
import styled, { css } from '@emotion/native';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon, { TIconName } from '../icons/icons';
import { rsWidth, rsHeight, rsFont } from '../../utils/responsive-size';
import palette from '../../assets/styles/theme';
import { Container, IconContainer, TextContainer, MainTitle, SubTitle } from './CTAButton.styles';
type CTAButtonProps = {
  mainTitle: string;
  subTitle: string;
  iconName: TIconName;
  iconSize?: number;
  onPress: () => void;
};

const CTAButton: React.FC<CTAButtonProps> = (props: CTAButtonProps) => {
  const { mainTitle, subTitle, iconName, iconSize = 40, onPress } = props;

  return (
    <Container onPress={onPress}>
      <IconContainer>
        <Icon name={iconName} width={iconSize} />
      </IconContainer>
      <TextContainer>
        <MainTitle>{mainTitle}</MainTitle>
        <SubTitle>{subTitle}</SubTitle>
      </TextContainer>
    </Container>
  );
};

export default CTAButton;
