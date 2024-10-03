import { css } from '@emotion/native';
import { Image } from 'expo-image';
import React, { useEffect } from 'react';
import { Linking, ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Carousel } from 'react-native-ui-lib';
import { getCarousel } from '../../../apis/carousel';
import { TCarousel } from '../../../apis/carousel.types';
import requestNotificationPermission from '../../../utils/NotificationToken';
import { ratio, rsHeight, rsWidth } from '../../../utils/responsive-size';
import EmotionBtn from '../../atoms/EmotionBtn/EmotionBtn';
import HomeChatBtn from '../../atoms/HomeBtn/HomeChatBtn';
import Header from './Homeheader';

const defaultImage = {
  image: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/banner.png',
  url: 'https://linktr.ee/remind4u',
};

const Home: React.FC<any> = ({ navigation }) => {
  const [birth, setBirth] = React.useState('');
  const [carousels, setCarousels] = React.useState<TCarousel[]>([defaultImage]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    //console.log('home 화면');
    requestNotificationPermission();
    getCarousel('home')
      .then((res) => {
        if (!res || res.length === 0) return;
        setCarousels(res);
      })
      .catch((error: any) => {
        console.error('[ERROR] homeCarousel: ', error);
      });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
      }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={css`
            padding-horizontal: ${rsWidth * 20 + 'px'};
            padding-bottom: ${rsWidth * 20 + 'px'};
            flex: 1;
            gap: ${rsWidth * 20 + 'px'};
          `}>
          <Header navigation={navigation} />

          <Carousel
            containerStyle={css`
              height: ${rsHeight * 112 + 'px'};
              border-radius: ${ratio * 20 + 'px'};
              overflow: hidden;
            `}
            loop
            initialPage={0}
            autoplay
            autoplayInterval={3 * 1000}>
            {carousels.map((carousel, i) => (
              <TouchableOpacity
                activeOpacity={1}
                key={i}
                onPress={() => {
                  Linking.openURL(carousel.url);
                }}>
                <Image
                  style={css`
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                  `}
                  source={{ uri: carousel.image }}
                />
              </TouchableOpacity>
            ))}
          </Carousel>

          <HomeChatBtn navigation={navigation} />

          <EmotionBtn navigation={navigation} />
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
