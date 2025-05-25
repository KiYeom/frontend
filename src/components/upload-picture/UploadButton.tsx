import React from 'react';
import { View, Text } from 'react-native';
import { Container, ContainerText, UnderlineText } from './UploadButton.style';
import palette from '../../assets/styles/theme';
import Icon from '../icons/icons';

type UploadButtonProps = {
  onPress: () => void;
};
const UploadButton = (props: UploadButtonProps) => {
  const { onPress } = props;
  return (
    <Container activeOpacity={1} onPress={onPress}>
      <Icon name="picture-icon" width={32} color={palette.primary[400]} />
      <ContainerText>
        <UnderlineText>이 곳을 클릭하여</UnderlineText>
        {'\n'}오늘의 사진을 함께 기록해보세요
      </ContainerText>
    </Container>
  );
};
export default UploadButton;
