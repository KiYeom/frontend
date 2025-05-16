import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import {
  PhotoCardTextContainer,
  PhotoCardContainer,
  PhotoCardLyric,
  PhotoCardInfo,
} from './photo-card.styles';
const PhotoCard = () => {
  return (
    <PhotoCardContainer>
      <Image
        source={require('../../assets/images/lucky_image_1.png')}
        style={{ width: 310, height: 472 }}
      />
      <PhotoCardTextContainer>
        <PhotoCardLyric>오늘의 행복</PhotoCardLyric>
        <PhotoCardInfo>데이식스, 제발</PhotoCardInfo>
      </PhotoCardTextContainer>
    </PhotoCardContainer>
  );
};
export default PhotoCard;
