import React, { useRef, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { View, Text, Carousel, Image, Colors, Spacings, Constants } from 'react-native-ui-lib';
import palette from '../../../assets/styles/theme';
import { rsWidth, rsHeight, rsFont } from '../../../utils/responsive-size';
import { HomeContainer } from './Home.style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Desc, Title } from './EmotionChart.style';
import Button from '../../button/button';
import EmotionChip from '../../atoms/EmotionChip/EmotionChip';
import { HomeStackName, RootStackName, TabScreenName } from '../../../constants/Constants';
const INITIAL_PAGE = 2;
const IMAGES = [
  'https://images.pexels.com/photos/2529159/pexels-photo-2529159.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/2529146/pexels-photo-2529146.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/2529158/pexels-photo-2529158.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
];

const BACKGROUND_COLORS = [
  Colors.red50,
  Colors.yellow20,
  Colors.purple50,
  Colors.green50,
  Colors.cyan50,
  Colors.red50,
];

const SmallEmotionChart = ({ navigation }) => {
  const [count, setCount] = useState(0);
  const insets = useSafeAreaInsets();
  const carouselRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);

  const getWidth = () => {
    //return Constants.windowWidth - Spacings.s5 * 2;
    return rsWidth * 150; //캐러셀 안에 들어있는거 너비
  };

  const onChangePage = (currentPage) => {
    setCurrentPage(currentPage);
  };

  const onPagePress = (index) => {
    console.log('page changed!');
    if (carouselRef.current) {
      carouselRef.current.goToPage(index, true);
    }
  };

  return (
    <HomeContainer insets={insets}>
      <Title>감정 기록</Title>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, backgroundColor: 'yellow' }}
        contentContainerStyle={{ flexGrow: 1 }}>
        <Text h1 margin-20 $textDefault>
          오늘의 감정을 알려주세요
        </Text>

        <Carousel
          ref={carouselRef}
          onChangePage={onChangePage}
          pageWidth={getWidth()}
          itemSpacings={12} //아이템끼리의 거리
          containerMarginHorizontal={Spacings.s2} //캐러셀 전체 화면이랑 요소 사이에 마진값
          initialPage={INITIAL_PAGE} //앱이 처음 실행되고 보여줄 초기 페이지
          containerStyle={{ flex: 1, backgroundColor: 'red' }} //캐러셀 전체 스타일링
          pageControlPosition={Carousel.pageControlPositions.UNDER} //under면 indicator 밑에서 멈추고, over면 indicator를 덮음
          pageControlProps={{ onPagePress }}
          allowAccessibleLayout>
          {BACKGROUND_COLORS.map((color, index) => (
            <View key={index} style={[styles.page, { backgroundColor: color, gap: 12 }]}>
              {/*<Text margin-15>CARD {index}</Text>*/}
              <EmotionChip emotion={{ emoji: '1', label: '테스트' }} />
              <EmotionChip emotion={{ emoji: '1', label: '테스트' }} />
              <EmotionChip emotion={{ emoji: '1', label: '테스트' }} />
              <EmotionChip emotion={{ emoji: '1', label: '테스트' }} />
              <EmotionChip emotion={{ emoji: '1', label: '테스트' }} />
              <EmotionChip emotion={{ emoji: '1', label: '테스트' }} />
            </View>
          ))}
        </Carousel>
      </ScrollView>
      <Title>기록한 감정</Title>
      <View style={{ height: 100, backgroundColor: 'green' }}></View>
      <Button
        title={`감정 ${count}개 기록하기`}
        primary={true}
        onPress={() => navigation.navigate(TabScreenName.Home)}
      />
    </HomeContainer>
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

export default SmallEmotionChart;
