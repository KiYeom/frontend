import React, { useRef, useEffect } from 'react';
import { View, Alert, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { PhotoCardSize } from '../../../constants/Constants';
import palette from '../../../assets/styles/theme';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Constants from 'expo-constants';
import {
  Annotation,
  TitleContainer,
  TitleTextContainter,
  Title,
  ButtonGroup,
  ImageContainer,
} from './QutoePage.style';
import Button from '../../../components/button/Button';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { happyLyrics, happyLyricsObject } from '../../../constants/Constants';
import PhotoCard from '../../../components/photo-card/PhotoCard';
import { useShowCookieAnimation } from '@hooks/useShowCookieAnimation';
import Analytics from '../../../utils/analytics';
const ShowCookieResultView: React.FC<{
  selectedLyricObject: happyLyricsObject | null;
  selectedImageSource: any | null;
  userName: string;
  onSaveImage: () => void;
  onShareImage: () => void;
  imageRef: React.RefObject<View>;
}> = ({
  selectedLyricObject,
  selectedImageSource,
  userName,
  onSaveImage,
  onShareImage,
  imageRef,
}) => {
  const insets = useSafeAreaInsets();

  const { animatedStyle, lottieRef } = useShowCookieAnimation();

  return (
    <View style={{ backgroundColor: `${palette.neutral[50]}`, flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: `${palette.neutral[50]}`,
          gap: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          position: 'relative',
        }}
        showsVerticalScrollIndicator={false}>
        <Animated.View style={animatedStyle}>
          <LottieView
            ref={lottieRef}
            autoPlay
            source={require('../../../assets/motion/new-confetti.json')}
            loop={false}
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              zIndex: 1,
            }}
          />
          <TitleContainer>
            <TitleTextContainter>
              {userName === 'Test_remind_empty' || userName.trim() === '' ? (
                <Annotation>당신을 위한</Annotation>
              ) : (
                <Annotation>{userName}님을 위한</Annotation>
              )}
              <Title>오늘의 행복 한 조각</Title>
            </TitleTextContainter>
          </TitleContainer>
          <ImageContainer>
            <View
              ref={imageRef}
              collapsable={false}
              style={{
                width: PhotoCardSize.width,
                height: PhotoCardSize.height,
              }}>
              {selectedLyricObject && (
                <PhotoCard
                  lyricObject={selectedLyricObject}
                  backgroundImage={selectedImageSource}
                />
              )}
            </View>
          </ImageContainer>
        </Animated.View>
      </ScrollView>
      <ButtonGroup insets={insets}>
        <View style={{ flex: 1 }}>
          <Button
            title="저장하기"
            onPress={async () => {
              Analytics.clickHappyLyricsImageSaveButton();
              await onSaveImage();
            }}
            primary={false}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            title="공유하기"
            onPress={async () => {
              Analytics.clickHappyLyricsImageShareButton();
              await onShareImage();
            }}
            primary={true}
          />
        </View>
      </ButtonGroup>
    </View>
  );
};

export default ShowCookieResultView;
