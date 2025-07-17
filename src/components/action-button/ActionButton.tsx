// 홈화면에서 사용하는 오늘의 행복 버튼
import React from 'react';
import { Text, View } from 'react-native';
import Icon from '../icons/icons';
import {
  ActionButtonContainer,
  ActionButtonText,
  ActionButtonIconContainer,
} from './ActionButton.style';
import palette from '../../assets/styles/theme';
type ActionButtonProps = {
  onPress?: () => void;
};
const ActionButton = (props: ActionButtonProps) => {
  const { onPress } = props;
  return (
    <ActionButtonContainer onPress={onPress}>
      <ActionButtonIconContainer>
        <Icon name="default-heart" width={24} color={palette.primary[500]} />
      </ActionButtonIconContainer>
      <ActionButtonText>오늘의 행복을 확인해보세요</ActionButtonText>
    </ActionButtonContainer>
  );
};
export default ActionButton;
