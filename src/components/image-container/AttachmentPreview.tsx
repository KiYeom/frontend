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
  //console.log('이미지 미리보기 컴포넌트 실행됨', image);
  return (
    <Container>
      <Image
        //source={typeof image === 'string' ? { uri: image } : image}
        /*source={{
          uri: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item6_sleepy.png',
        }}*/
        source={{ uri: image }}
        style={{ width: '100%', height: '100%' }}
        resizeMode="contain"
        //onLoadStart={() => console.log('🔄 이미지 로드 시작')}
        //onLoad={() => console.log('✅ 이미지 로드 성공')}
        /*onError={(error) => {
          console.log('❌ 이미지 로드 실패:', error.nativeEvent);
          console.log('❌ 에러 상세:', JSON.stringify(error.nativeEvent, null, 2));
        }}*/
      />
      <DeleteButton
        hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
        onPress={() => {
          //console.log('이미지 미리보기 삭제 버튼');
          Analytics.clickImagePreviewCancelButton();
          onDelete(image);
        }}>
        <Icon name="cancel-icon" width={7} color={'white'} />
      </DeleteButton>
    </Container>
  );
};
export default AttachmentPreview;
