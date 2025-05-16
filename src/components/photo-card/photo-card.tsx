import React from 'react';
import { View, Text, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';
import {
  PhotoCardTextContainer,
  PhotoCardContainer,
  PhotoCardLyric,
  PhotoCardInfo,
} from './photo-card.styles';
import { happyLyricsObject } from '~/src/constants/Constants';
type ImageData = {
  id: string;
  source: ImageSourcePropType;
  textPosition: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
};
type PhotoCardProps = {
  lyric?: string;
  singer?: string;
  title?: string;
  lyricObject: happyLyricsObject;
  backgroundImage?: ImageData;
};

const PhotoCard = (props: PhotoCardProps) => {
  const { lyric, singer, title, lyricObject, backgroundImage } = props;
  console.log('backgoundImage', backgroundImage);
  return (
    <PhotoCardContainer>
      <Image source={backgroundImage?.source} style={{ width: 310, height: 472 }} />
      <PhotoCardTextContainer style={{ top: backgroundImage?.textPosition.top }}>
        <PhotoCardLyric imageId={backgroundImage?.id}>{lyricObject?.lyric}</PhotoCardLyric>
        <PhotoCardInfo imageId={backgroundImage?.id}>
          {lyricObject?.singer}, {lyricObject?.title}
        </PhotoCardInfo>
      </PhotoCardTextContainer>
    </PhotoCardContainer>
  );
};
export default PhotoCard;
