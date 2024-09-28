import { css } from '@emotion/native';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Carousel, Constants, Spacings, View } from 'react-native-ui-lib';
import palette from '../../../assets/styles/theme';
import { rsHeight, rsWidth } from '../../../utils/responsive-size';
import {
  Container,
  ProfileDesc,
  ProfileText,
  ProfileTitle,
  ProfileTitleContainer,
} from './profile.style';
const IMAGES = [
  require('../../../assets/images/story1.png'),
  require('../../../assets/images/story2.png'),
  require('../../../assets/images/story3.png'),
  require('../../../assets/images/story4.png'),
  require('../../../assets/images/story5.png'),
  require('../../../assets/images/story6.png'),
  require('../../../assets/images/story7.png'),
];
const INFO = [
  { 견종: '리트리버' },
  { 나이: '영원한 우리의 친구' },
  { '좋아하는 것': '주인님, 세잎클로버, 대화' },
  { 인스타그램: '@reMIND_cookie' },
];

const Profile = () => {
  const [orientation, setOrientation] = useState(Constants.orientation);
  const [width, setWidth] = useState(Constants.windowWidth - Spacings.s5 * 2);

  useEffect(() => {
    const onOrientationChange = () => {
      setOrientation(Constants.orientation);
      setWidth(Constants.windowWidth - Spacings.s5 * 2);
    };

    const dimensionsChangeListener = Constants.addDimensionsEventListener(onOrientationChange);

    return () => {
      Constants.removeDimensionsEventListener(dimensionsChangeListener);
    };
  }, []);
  return (
    <Container>
      <View style={{ alignItems: 'center' }}>
        <Carousel
          containerStyle={{ height: 350 * rsHeight, width: 350 * rsWidth }}
          loop
          pageControlProps={{ size: 10, containerStyle: styles.loopCarousel }}
          pageControlPosition={Carousel.pageControlPositions.OVER}
          showCounter>
          {IMAGES.map((image, i) => (
            <View flex centerV key={i}>
              <Image
                style={{ flex: 1, width: 350 * rsWidth, height: 350 * rsHeight }}
                source={image}
              />
            </View>
          ))}
        </Carousel>
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
          );
        })}
      </View>
    </Container>
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
