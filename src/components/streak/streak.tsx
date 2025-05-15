import React from 'react';
import { View, Text } from 'react-native';
import Icon from '../icons/icons';
import { Card, IconContainer, TextContainer, ValueText, LabelText } from './streak.styles';
import { TIconName } from '../icons/icons';
type StreakProps = {
  icon?: TIconName;
  value?: string;
  label?: string;
};
const StreakCard = (props: StreakProps) => {
  const { icon, value, label } = props;
  return (
    <Card>
      {icon && (
        <IconContainer backgroundColor="#f9fafb">
          <Icon name={icon} width={45} />
        </IconContainer>
      )}

      <TextContainer>
        <ValueText>{value}</ValueText>
        <LabelText>{label}</LabelText>
      </TextContainer>
    </Card>
  );
};
export default StreakCard;
