import React, { useRef, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { View, Text, Carousel, Image, Colors, Spacings, Constants } from 'react-native-ui-lib';
import palette from '../../../assets/styles/theme';
import { rsWidth, rsHeight, rsFont } from '../../../utils/responsive-size';
import { HomeContainer } from './Home.style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Desc, Title } from './EmotionChart.style';
import Button from '../../button/button';
import EmotionChip from '../../atoms/EmotionChip/EmotionChip';
import { SmallTitle } from './EmotionChart.style';
import { HomeStackName, RootStackName, TabScreenName } from '../../../constants/Constants';
import { DescText } from '../StatisticPage/StatisticMain.style';
import { css } from '@emotion/native';
import { EmotionDesc } from './EmotionChart.style';
import { TIconName } from '../../icons/icons';
import Icon from '../../icons/icons';
import EmotionCard from '../../atoms/EmotionCard/EmotionCard';

const INITIAL_PAGE = 2;
const IMAGES = [
  'https://images.pexels.com/photos/2529159/pexels-photo-2529159.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/2529146/pexels-photo-2529146.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/2529158/pexels-photo-2529158.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
];
import { Container } from './EmotionChart.style';

const BACKGROUND_COLORS = [
  Colors.red50,
  Colors.yellow20,
  Colors.purple50,
  Colors.green50,
  Colors.cyan50,
  Colors.red50,
];

const emotions = [
  [
    { category: 'angry', detail: '격분한', desc: '몹시 분하고 화가 난' },
    { category: 'angry', detail: '질투하는', desc: '남이 잘되는 것을 시기하는' },
    { category: 'angry', detail: '경멸하는', desc: '남을 깔보거나 무시하는' },
    { category: 'sad', detail: '굴욕적인', desc: '수치스럽고 창피한' },
    { category: 'sad', detail: '죄책감 느끼는', desc: '잘못한 일에 대해 미안해하는' },
    { category: 'sad', detail: '비참한', desc: '아주 슬프고 불쌍한' },
  ],
  [
    { category: 'angry', detail: '압도된', desc: '너무 많거나 강해 감당하기 힘든' },
    { category: 'angry', detail: '화난', desc: '기분이 상하거나 불쾌한' },
    { category: 'angry', detail: '걱정하는', desc: '불안하고 염려하는' },
    { category: 'sad', detail: '불안정한', desc: '마음이 안정되지 않은' },
    { category: 'sad', detail: '슬픈', desc: '마음이 아프고 괴로운' },
    { category: 'sad', detail: '지친', desc: '피곤하고 힘이 빠진' },
  ],
  [
    { category: 'angry', detail: '짜증나는', desc: '기분이 나쁘고 성가신' },
    { category: 'angry', detail: '혼란스러운', desc: '정리가 안 되고 어지러운' },
    { category: 'angry', detail: '불편한', desc: '편하지 않고 거북한' },
    { category: 'sad', detail: '지루한', desc: '흥미가 없고 따분한' },
    { category: 'sad', detail: '외로운', desc: '혼자 있어서 쓸쓸한' },
    { category: 'sad', detail: '무력한', desc: '힘이 없고 아무것도 할 수 없는' },
  ],
  [
    { category: 'happy', detail: '놀란', desc: '예상치 못한 일로 깜짝 놀란' },
    { category: 'happy', detail: '활기찬', desc: '생기 있고 에너지가 넘치는' },
    { category: 'happy', detail: '기쁜', desc: '마음이 즐겁고 행복한' },
    { category: 'relax', detail: '차분한', desc: '침착하고 조용한' },
    { category: 'relax', detail: '편안한', desc: '마음이 편하고 안정된' },
    { category: 'relax', detail: '자유로운', desc: '구속받지 않고 마음대로 할 수 있는' },
  ],
  [
    { category: 'happy', detail: '신나는', desc: '기분이 좋고 흥겨운' },
    { category: 'happy', detail: '행복한', desc: '아주 기쁘고 좋은' },
    { category: 'happy', detail: '자신있는', desc: '스스로를 믿고 당당한' },
    { category: 'relax', detail: '존중받는', desc: '남에게 인정받고 귀하게 여겨지는' },
    { category: 'relax', detail: '만족하는', desc: '원하는 대로 되어 기쁜' },
    { category: 'relax', detail: '안정된', desc: '불안함이 없이 편안한' },
  ],
  [
    { category: 'happy', detail: '황홀한', desc: '너무 좋아서 어찌할 바를 모르는' },
    { category: 'happy', detail: '자랑스러운', desc: '스스로 또는 남의 일이 대견한' },
    { category: 'happy', detail: '성취감이 드는', desc: '목표를 이루어 기쁜' },
    { category: 'relax', detail: '사랑받는', desc: '누군가에게 소중하게 여겨지는' },
    { category: 'relax', detail: '감동받는', desc: '마음이 크게 움직이는' },
    { category: 'relax', detail: '감사하는', desc: '고마운 마음을 느끼는' },
  ],
];

const SmallEmotionChart = ({ navigation }) => {
  const [count, setCount] = useState(0);
  const insets = useSafeAreaInsets();
  const carouselRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);
  const [selectedEmotions, setSelectedEmotions] = useState([]); // 선택된 감정들 저장

  const handleEmotionListClick = (emotion) => {
    // 이미 선택된 감정인지 확인
    if (selectedEmotions.some((e) => e.detail === emotion.detail)) {
      // 이미 선택된 경우, 리스트에서 제거
      setSelectedEmotions(selectedEmotions.filter((e) => e.detail !== emotion.detail));
    } else {
      // 선택된 감정 추가
      setSelectedEmotions([...selectedEmotions, emotion]);
    }
  };

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

  // Chip을 삭제하는 핸들러
  const handleRemoveEmotion = (emotion) => {
    console.log('삭제 버튼 누름');
    console.log(selectedEmotions);
    setSelectedEmotions(selectedEmotions.filter((e) => e.detail !== emotion.detail));
  };

  return (
    <Container>
      <Title
        style={css`
          margin-left: ${rsWidth * 24 + 'px'};
          text-align: left;
        `}>
        오늘의 감정을 알려주세요
      </Title>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <Carousel
          ref={carouselRef}
          onChangePage={onChangePage}
          pageWidth={getWidth()} //캐러셀의 너비
          containerPaddingVertical={10 * rsHeight} //캐러셀 전체 화면이랑 요소 사이 마진값
          //containerMarginHorizontal={24 * rsWidth} //캐러셀 전체 화면이랑 요소 사이에 마진값
          initialPage={INITIAL_PAGE} //앱이 처음 실행되고 보여줄 초기 페이지
          containerStyle={{ flexGrow: 1 }} //캐러셀 전체 스타일링
          pageControlPosition={Carousel.pageControlPositions.UNDER} //under면 indicator 밑에서 멈추고, over면 indicator를 덮음
          pageControlProps={{ onPagePress }}
          //allowAccessibleLayout
        >
          {emotions.map((emotionGroup, index) => (
            <View
              key={index}
              style={css`
                flex: 1;
                justify-content: space-between;
              `}>
              {emotions[index].map((emotion, emotionIndex) => (
                <EmotionChip
                  key={emotionIndex}
                  category={emotion.category}
                  detail={emotion.detail}
                  isSelected={selectedEmotions.some((e) => e.detail === emotion.detail)} // 선택된 감정인지 확인
                  onPress={() => handleEmotionListClick(emotion)}
                />
              ))}
            </View>
          ))}
        </Carousel>
      </ScrollView>

      <View
        style={css`
          padding-vertical: 10px;
          padding-horizontal: ${rsWidth * 24 + 'px'};
          flex-grow: 0;
        `}>
        <SmallTitle>기록한 감정 ({selectedEmotions.length}/5)</SmallTitle>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            flexGrow: 0,
            paddingVertical: 15 * rsHeight,
            //backgroundColor: 'orange',
          }}
          contentContainerStyle={{
            flexGrow: 1,
            flexDirection: 'row',
          }}>
          {selectedEmotions.length > 0 ? (
            selectedEmotions.map((emotion, index) => (
              <EmotionCard key={index} emotion={emotion} onPress={handleRemoveEmotion} />
            ))
          ) : (
            <View
              style={css`
                flex: 1;
                align-items: center;
                justify-content: center;
                height: ${rsHeight * 100 + 'px'};
                width: ${rsWidth * 100 + 'px'};
                border-radius: 10px;
                margin-right: ${rsWidth * 8 + 'px'};
              `}>
              <Text>감정을 선택해주세요</Text>
            </View>
          )}
        </ScrollView>
      </View>
      <View
        style={css`
          gap: ${rsHeight * 8 + 'px'};
        `}>
        <View
          style={css`
            padding-vertical: ${rsHeight * 40 + 'px'};
            padding-horizontal: ${rsWidth * 24 + 'px'};
            gap: ${rsHeight * 10 + 'px'};
          `}>
          <EmotionDesc>
            {selectedEmotions.length > 0
              ? `${selectedEmotions[selectedEmotions.length - 1].detail} : ${selectedEmotions[selectedEmotions.length - 1].desc}`
              : ''}
          </EmotionDesc>
          <Button
            title={selectedEmotions.length < 3 ? `3개 이상 감정을 골라주세요` : `감정 기록하기`}
            primary={true}
            disabled={selectedEmotions.length < 3 || selectedEmotions.length > 5}
            onPress={() => navigation.navigate(TabScreenName.Home)}
          />
        </View>
      </View>
    </Container>
  );
};

export default SmallEmotionChart;
