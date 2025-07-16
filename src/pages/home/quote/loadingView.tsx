import React from 'react';
import { View, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { Container, AnimationContainer } from './qutoe.style';
import { happyLyrics, happyLyricsObject } from '../../../constants/Constants';
import PhotoCard from '../../../components/photo-card/photo-card';

const LoadingView: React.FC<{
  selectedImageSource: any | null;
  selectedLyricObject: happyLyricsObject | null;
  onLoadingComplete: () => void;
}> = ({ selectedImageSource, selectedLyricObject, onLoadingComplete }) => {
  const insets = useSafeAreaInsets();

  return (
    <Container insets={insets}>
      <AnimationContainer style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* 이미지 미리 로드 */}
        {selectedImageSource && (
          <Image
            source={selectedImageSource.source}
            style={{ width: 1, height: 1, opacity: 0, position: 'absolute' }}
          />
        )}

        {/* PhotoCard 미리 로드 */}
        {selectedLyricObject && selectedImageSource && (
          <View style={{ width: 1, height: 1, opacity: 0, position: 'absolute' }}>
            <PhotoCard lyricObject={selectedLyricObject} backgroundImage={selectedImageSource} />
          </View>
        )}

        <LottieView
          autoPlay
          source={require('../../../assets/motion/loading.json')}
          loop={false}
          speed={1.0}
          onAnimationFinish={() => {
            // Lottie 끝난 후 UI 전환을 300ms 지연
            requestAnimationFrame(() => {
              setTimeout(() => {
                onLoadingComplete();
              }, 300);
            });
          }}
          style={{
            width: 150,
            height: 150,
            position: 'absolute',
          }}
        />
      </AnimationContainer>
    </Container>
  );
};
export default LoadingView;
