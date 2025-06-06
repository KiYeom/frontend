import React from 'react';
import styled, { css } from '@emotion/native';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Icon, { TIconName } from '../icons/icons';
import { rsWidth, rsHeight, rsFont } from '../../utils/responsive-size';
import palette from '../../assets/styles/theme';
import { Container, DeleteButton } from './AttachmentPreview.style';
import Analytics from '../../utils/analytics';

interface Props {
  image: string;
  onDelete: (image: string) => void;
}
const AttachmentPreview: React.FC<Props> = ({ image, onDelete }) => {
  return (
    <Container>
      <Image
        source={typeof image === 'string' ? { uri: image } : image}
        style={{ width: '100%', height: '100%' }}
        resizeMode="contain"
      />
      <DeleteButton
        hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
        onPress={() => {
          console.log('이미지 미리보기 삭제 버튼');
          Analytics.clickImagePreviewCancelButton();
          onDelete(image);
        }}>
        <Icon name="cancel-icon" width={7} color={'white'} />
      </DeleteButton>
    </Container>
  );
};
export default AttachmentPreview;
