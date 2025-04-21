import React from 'react';
import styled, { css } from '@emotion/native';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Icon, { TIconName } from '../icons/icons';
import { rsWidth, rsHeight, rsFont } from '../../utils/responsive-size';
import palette from '../../assets/styles/theme';
import { Container, DeleteButton } from './AttachmentPreview.style';

interface Props {
  image: string;
  onDelete: (image: string) => void;
}
const AttachmentPreview: React.FC<Props> = ({ image, onDelete }) => {
  console.log('image', image);
  return (
    <Container>
      <Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
      <DeleteButton onPress={() => onDelete(image)}>
        <Icon name="cancel-icon" width={7} color={'white'} />
      </DeleteButton>
    </Container>
  );
};
export default AttachmentPreview;
