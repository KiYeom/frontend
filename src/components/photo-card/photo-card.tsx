import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import {
  PhotoCardTextContainer,
  PhotoCardContainer,
  PhotoCardLyric,
  PhotoCardInfo,
} from './photo-card.styles';
import { happyLyricsObject } from '~/src/constants/Constants';
type PhotoCardProps = {
  lyric?: string;
  singer?: string;
  title?: string;
  lyricObject: happyLyricsObject;
};

const PhotoCard = (props: PhotoCardProps) => {
  const { lyric, singer, title, lyricObject } = props;
  return (
    <PhotoCardContainer>
      <Image
        source={require('../../assets/images/lucky_image_1.png')}
        style={{ width: 310, height: 472 }}
      />
      <PhotoCardTextContainer>
        <PhotoCardLyric>{lyricObject?.lyric}</PhotoCardLyric>
        <PhotoCardInfo>
          {lyricObject?.singer}, {lyricObject?.title}
        </PhotoCardInfo>
      </PhotoCardTextContainer>
    </PhotoCardContainer>
  );
};
export default PhotoCard;
