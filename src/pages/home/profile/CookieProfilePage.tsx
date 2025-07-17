import { css } from '@emotion/native';
import { Image } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Carousel from 'react-native-reanimated-carousel';
import { View } from 'react-native';
import { getCarousel } from '../../../apis/carousel';
import { TCarousel } from '../../../apis/carousel.types';
import palette from '../../../assets/styles/theme';
import { rsHeight, rsWidth } from '../../../utils/responsive-size';
import {
  Container,
  ProfileDesc,
  ProfileText,
  ProfileTitle,
  ProfileTitleContainer,
} from './CookieProfile.style';

const INFO = [
  { 견종: '리트리버' },
  { 나이: '귀여운 한 살' },
  { '좋아하는 것': '주인님, 세잎클로버, 대화' },
  { 인스타그램: '@reMIND_cookie' },
];

const defaultProfileCarousel = [
  {
    page: 1,
    image: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/story/story1.png',
    url: 'https://www.instagram.com/remind_cookie/',
  },
  {
    page: 2,
    image: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/story/story2.png',
    url: 'https://www.instagram.com/remind_cookie/',
  },
  {
    page: 3,
    image: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/story/story3.png',
    url: 'https://www.instagram.com/remind_cookie/',
  },
  {
    page: 4,
    image: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/story/story4.png',
    url: 'https://www.instagram.com/remind_cookie/',
  },
  {
    page: 5,
    image: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/story/story5.png',
    url: 'https://www.instagram.com/remind_cookie/',
  },
  {
    page: 6,
    image: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/story/story6.png',
    url: 'https://www.instagram.com/remind_cookie/',
  },
  {
    page: 7,
    image: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/story/story7.png',
    url: 'https://www.instagram.com/remind_cookie/',
  },
];

//쿠키 프로필 페이지
const Profile = () => {
  const [carousels, setCarousels] = React.useState<TCarousel[]>(defaultProfileCarousel);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    getCarousel('cookie_profile')
      .then((res) => {
        if (!res || res.length === 0) return;
        setCarousels(res);
      })
      .catch((error: any) => {
        //console.error('[ERROR] homeCarousel: ', error);
      });
  }, []);
  const width = 350 * rsWidth;
  const height = 350 * rsHeight;

  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>
      <ScrollView>
        <Container>
          <View style={{ alignItems: 'center' }}>
            <Carousel
              width={width}
              height={height}
              data={carousels}
              defaultIndex={0}
              loop
              autoPlay
              autoPlayInterval={5000}
              style={{
                borderRadius: 20,
                overflow: 'hidden',
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    // Analytics.clickTabHomeCarousel(item.image);
                    WebBrowser.openBrowserAsync(item.url);
                  }}>
                  <Image
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    contentFit="cover"
                    source={{ uri: item.image }}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
          <View
            style={css`
              //background-color: red;
              gap: ${rsHeight * 10 + 'px'};
              padding-vertical: ${rsHeight * 10 + 'px'};
            `}>
            <ProfileTitle>쿠키</ProfileTitle>
            <ProfileDesc>주인님을 사랑하고{'\n'}행복을 바라는 강아지</ProfileDesc>
          </View>
          <View
            style={css`
              //background-color: gray;
              flex-direction: column;
              gap: ${rsHeight * 10 + 'px'};
            `}>
            {INFO.map((item, index) => {
              const key = Object.keys(item)[0]; // 객체의 첫 번째 키
              const value = item[key]; // 해당 키의 값
              return (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    if (key === '인스타그램') {
                      WebBrowser.openBrowserAsync('https://www.instagram.com/remind_cookie/');
                    }
                  }}>
                  <View
                    key={index}
                    style={css`
                      flex-direction: column;
                      gap: ${rsHeight * 20 + 'px'};
                      flex-direction: row;
                      //background-color: pink;
                    `}>
                    <ProfileTitleContainer>
                      <ProfileText color="white">{key}</ProfileText>
                    </ProfileTitleContainer>
                    <View
                      style={css`
                        flex: 1;
                        //background-color: green;
                        justify-content: center;
                      `}>
                      <ProfileText color={palette.neutral[900]}>{value}</ProfileText>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </Container>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
  },
  loopCarousel: {
    position: 'absolute',
    bottom: 15,
    left: 10,
  },
});
export default Profile;
