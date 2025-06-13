import React, { useRef } from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { rsHeight, rsWidth, rsFont } from '../../../utils/responsive-size';
import palette from '../../../assets/styles/theme';
import Carousel, { Pagination, ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
interface ImageCarouselProps {
  images: string[];
}
const DailyGallery: React.FC<ImageCarouselProps> = ({ images }) => {
  //캐러셀 추가
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };
  if (images.length === 0) return null;
  return (
    <View style={{ position: 'relative', gap: rsHeight * 12 }}>
      <Text
        style={{
          fontFamily: 'Kyobo-handwriting',
          fontSize: 18 * rsFont,
          color: palette.neutral[900],
        }}>
        그 때 내가 기록한 순간을 담았어요!
      </Text>

      <Carousel
        ref={ref}
        width={rsWidth * 350}
        height={rsHeight * 263}
        data={images}
        onProgressChange={progress}
        defaultIndex={0}
        loop={images.length > 1 ? true : false}
        enabled={images.length > 1 ? true : false}
        style={{
          borderRadius: 10,
          overflow: 'hidden',
        }}
        renderItem={({ item }) => (
          <Image
            style={{
              width: '100%',
              height: '100%',
            }}
            contentFit="cover"
            source={{ uri: item }}
          />
        )}
      />
      {images.length > 1 && (
        <View
          style={{
            position: 'absolute',
            bottom: 10,
            left: 0,
            right: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Pagination.Basic
            progress={progress}
            data={images}
            dotStyle={{ backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 50 }}
            activeDotStyle={{ backgroundColor: '#FFFFFF' }}
            containerStyle={{ gap: 5 }}
            onPress={onPressPagination}
          />
        </View>
      )}
    </View>
  );
};
export default DailyGallery;
