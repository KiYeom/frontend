// components/molecules/ReportEmotionCard/ReportEmotionCard.tsx
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from '../../../components/icons/icons';
import { CardContainer, EmotionText } from './ReportEmotionCard.style';
import { TEmotionCheck } from '../../../apis/analyze.type';

export interface ReportEmotionCardProps {
  emotion: TEmotionCheck;
}
const ReportEmotionCard = ({ emotion }: ReportEmotionCardProps) => {
  const iconName = `${emotion.group}-emotion`;

  // 읽기 전용 컴포넌트
  return (
    <CardContainer>
      <Icon name={iconName} width={45} />
      <EmotionText>{emotion.keyword}</EmotionText>
    </CardContainer>
  );
};

export default ReportEmotionCard;
