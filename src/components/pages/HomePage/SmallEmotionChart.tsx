import React, { useRef, useState, useEffect } from 'react';
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
import useEmotionStore from '../../../utils/emotion-status';
import { todayEmotion } from '../../../apis/analyze';
import { Container } from './EmotionChart.style';
import Toast from 'react-native-root-toast';
import useRecordedEmotionStore from '../../../utils/emotion-recorded';

const emotions = [
  [
    { group: 'angry', keyword: '격분한', desc: '몹시 분하고 화가 난' },
    { group: 'angry', keyword: '질투하는', desc: '남이 잘되는 것을 시기하는' },
    { group: 'angry', keyword: '경멸하는', desc: '남을 깔보거나 무시하는' },
    { group: 'sad', keyword: '굴욕적인', desc: '수치스럽고 창피한' },
    { group: 'sad', keyword: '죄책감을 느끼는', desc: '잘못한 일에 대해 미안해하는' },
    { group: 'sad', keyword: '비참한', desc: '아주 슬프고 불쌍한' },
  ],
  [
    { group: 'angry', keyword: '압도된', desc: '너무 많거나 강해 감당하기 힘든' },
    { group: 'angry', keyword: '화난', desc: '기분이 상하거나 불쾌한' },
    { group: 'angry', keyword: '걱정하는', desc: '불안하고 염려하는' },
    { group: 'sad', keyword: '불안정한', desc: '마음이 안정되지 않은' },
    { group: 'sad', keyword: '슬픈', desc: '마음이 아프고 괴로운' },
    { group: 'sad', keyword: '지친', desc: '피곤하고 힘이 빠진' },
  ],
  [
    { group: 'angry', keyword: '짜증나는', desc: '기분이 나쁘고 성가신' },
    { group: 'angry', keyword: '혼란스러운', desc: '정리가 안 되고 어지러운' },
    { group: 'angry', keyword: '불편한', desc: '편하지 않고 거북한' },
    { group: 'sad', keyword: '지루한', desc: '흥미가 없고 따분한' },
    { group: 'sad', keyword: '외로운', desc: '혼자 있어서 쓸쓸한' },
    { group: 'sad', keyword: '무력한', desc: '힘이 없고 아무것도 할 수 없는' },
  ],
  [
    { group: 'happy', keyword: '놀란', desc: '예상치 못한 일로 깜짝 놀란' },
    { group: 'happy', keyword: '활기찬', desc: '생기 있고 에너지가 넘치는' },
    { group: 'happy', keyword: '기쁜', desc: '마음이 즐겁고 행복한' },
    { group: 'calm', keyword: '차분한', desc: '침착하고 조용한' },
    { group: 'calm', keyword: '편안한', desc: '마음이 편하고 안정된' },
    { group: 'calm', keyword: '자유로운', desc: '구속받지 않고 마음대로 할 수 있는' },
  ],
  [
    { group: 'happy', keyword: '신나는', desc: '기분이 좋고 흥겨운' },
    { group: 'happy', keyword: '행복한', desc: '아주 기쁘고 좋은' },
    { group: 'happy', keyword: '자신 있는', desc: '스스로를 믿고 당당한' },
    { group: 'calm', keyword: '존중받는', desc: '남에게 인정받고 귀하게 여겨지는' },
    { group: 'calm', keyword: '만족하는', desc: '원하는 대로 되어 기쁜' },
    { group: 'calm', keyword: '안정된', desc: '불안함이 없이 편안한' },
  ],
  [
    { group: 'happy', keyword: '황홀한', desc: '너무 좋아서 어찌할 바를 모르는' },
    { group: 'happy', keyword: '자랑스러운', desc: '스스로 또는 남의 일이 대견한' },
    { group: 'happy', keyword: '성취감이 드는', desc: '목표를 이루어 기쁜' },
    { group: 'calm', keyword: '사랑받는', desc: '누군가에게 소중하게 여겨지는' },
    { group: 'calm', keyword: '감동받은', desc: '마음이 크게 움직이는' },
    { group: 'calm', keyword: '감사하는', desc: '고마운 마음을 느끼는' },
  ],
];

const emotionData = {
  격분한: { desc: '몹시 분하고 화가 난', group: 'angry' },
  질투하는: { desc: '남이 잘되는 것을 시기하는', group: 'angry' },
  경멸하는: { desc: '남을 깔보거나 무시하는', group: 'angry' },
  굴욕적인: { desc: '수치스럽고 창피한', group: 'sad' },
  '죄책감을 느끼는': { desc: '잘못한 일에 대해 미안해하는', group: 'sad' },
  비참한: { desc: '아주 슬프고 불쌍한', group: 'sad' },
  압도된: { desc: '너무 많거나 강해 감당하기 힘든', group: 'angry' },
  화난: { desc: '기분이 상하거나 불쾌한', group: 'angry' },
  걱정하는: { desc: '불안하고 염려하는', group: 'angry' },
  불안정한: { desc: '마음이 안정되지 않은', group: 'sad' },
  슬픈: { desc: '마음이 아프고 괴로운', group: 'sad' },
  지친: { desc: '피곤하고 힘이 빠진', group: 'sad' },
  짜증나는: { desc: '기분이 나쁘고 성가신', group: 'angry' },
  혼란스러운: { desc: '정리가 안 되고 어지러운', group: 'angry' },
  불편한: { desc: '편하지 않고 거북한', group: 'angry' },
  지루한: { desc: '흥미가 없고 따분한', group: 'sad' },
  외로운: { desc: '혼자 있어서 쓸쓸한', group: 'sad' },
  무력한: { desc: '힘이 없고 아무것도 할 수 없는', group: 'sad' },
  놀란: { desc: '예상치 못한 일로 깜짝 놀란', group: 'happy' },
  활기찬: { desc: '생기 있고 에너지가 넘치는', group: 'happy' },
  기쁜: { desc: '마음이 즐겁고 행복한', group: 'happy' },
  차분한: { desc: '침착하고 조용한', group: 'calm' },
  편안한: { desc: '마음이 편하고 안정된', group: 'calm' },
  자유로운: { desc: '구속받지 않고 마음대로 할 수 있는', group: 'calm' },
  신나는: { desc: '기분이 좋고 흥겨운', group: 'happy' },
  행복한: { desc: '아주 기쁘고 좋은', group: 'happy' },
  '자신 있는': { desc: '스스로를 믿고 당당한', group: 'happy' },
  존중받는: { desc: '남에게 인정받고 귀하게 여겨지는', group: 'calm' },
  만족하는: { desc: '원하는 대로 되어 기쁜', group: 'calm' },
  안정된: { desc: '불안함이 없이 편안한', group: 'calm' },
  황홀한: { desc: '너무 좋아서 어찌할 바를 모르는', group: 'happy' },
  자랑스러운: { desc: '스스로 또는 남의 일이 대견한', group: 'happy' },
  '성취감이 드는': { desc: '목표를 이루어 기쁜', group: 'happy' },
  사랑받는: { desc: '누군가에게 소중하게 여겨지는', group: 'calm' },
  감동받은: { desc: '마음이 크게 움직이는', group: 'calm' },
  감사하는: { desc: '고마운 마음을 느끼는', group: 'calm' },
};

const SmallEmotionChart = ({ navigation, route }) => {
  const { page } = route.params || 0;
  //console.log('Selected page:', page);
  //console.log(page);
  const insets = useSafeAreaInsets();
  const carouselRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(page);
  //const [selectedEmotions, setSelectedEmotions] = useState([]); // 선택된 감정들 저장
  const { selectedEmotions, setSelectedEmotions, addEmotion, removeEmotion } = useEmotionStore();
  const { recordedEmotions, setRecordedEmotions } = useRecordedEmotionStore();

  const handleEmotionListClick = async (emotion) => {
    console.log('click', emotion);
    // 이미 선택된 감정인지 확인
    if (selectedEmotions.some((e) => e.keyword === emotion.keyword)) {
      // 이미 선택된 경우, 리스트에서 제거
      //setSelectedEmotions(selectedEmotions.filter((e) => e.detail !== emotion.detail));
      removeEmotion(emotion.keyword);
    } else {
      // 선택된 감정 추가
      if (selectedEmotions.length >= 5) {
        console.log('5개 넘음');
        Toast.show('감정은 5개까지 선택할 수 있습니다!', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.CENTER,
        });
        return;
      }
      addEmotion(emotion);
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
    console.log('page changed!', index);
    if (carouselRef.current) {
      carouselRef.current.goToPage(index, true);
    }
  };

  // Chip을 삭제하는 핸들러
  const handleRemoveEmotion = (emotion) => {
    //console.log('삭제 버튼 누름', emotion);
    //console.log(selectedEmotions);
    //setSelectedEmotions(selectedEmotions.filter((e) => e.detail !== emotion.detail);
    removeEmotion(emotion.keyword);
  };

  return (
    <Container>
      <Title
        style={css`
          margin-left: ${rsWidth * 24 + 'px'};
          text-align: left;
          padding-top: ${rsHeight * 40 + 'px'};
        `}>
        오늘의 감정을 알려주세요
      </Title>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <Carousel
          ref={carouselRef}
          onChangePage={onChangePage}
          pageWidth={getWidth()} //캐러셀의 너비
          containerPaddingVertical={10 * rsHeight} //캐러셀 전체 화면이랑 요소 사이 마진값 (vertical)
          containerMarginHorizontal={12 * rsWidth} //캐러셀 전체 화면이랑 요소 사이에 마진값
          initialPage={4 - page} //앱이 처음 실행되고 보여줄 초기 페이지
          containerStyle={{ flexGrow: 1 }} //캐러셀 전체 스타일링
          //pageControlPosition={Carousel.pageControlPositions.UNDER} //under면 indicator 밑에서 멈추고, over면 indicator를 덮음
          pageControlProps={{
            onPagePress,
            color: palette.neutral[900],
            size: 10,
            numOfPages: 6,
            limitShownPages: false,
          }}
          itemSpacings={12 * rsWidth}
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
                  group={emotion.group}
                  keyword={emotion.keyword}
                  isSelected={selectedEmotions.some((e) => e.keyword === emotion.keyword)} // 선택된 감정인지 확인
                  onPress={() => handleEmotionListClick(emotion)}
                />
              ))}
            </View>
          ))}
        </Carousel>
      </ScrollView>

      <View
        style={css`
          padding-vertical: ${rsHeight * 10 + 'px'};
          padding-horizontal: ${rsWidth * 24 + 'px'};
          flex-grow: 0;
          //background-color: blue;
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
              <EmotionCard
                key={index}
                emotion={emotion}
                onPress={handleRemoveEmotion}
                status={'default'}
              />
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
              <Text style={css``}></Text>
            </View>
          )}
        </ScrollView>
      </View>

      <View
        style={css`
          padding-bottom: ${rsHeight * 40 + 'px'};
          padding-horizontal: ${rsWidth * 24 + 'px'};
          gap: ${rsHeight * 8 + 'px'};
        `}>
        <EmotionDesc>
          {selectedEmotions.length > 0
            ? `${selectedEmotions[selectedEmotions.length - 1].keyword} : ${emotionData[selectedEmotions[selectedEmotions.length - 1].keyword].desc}`
            : ''}
        </EmotionDesc>
        <Button
          title={selectedEmotions.length < 3 ? `3개 이상 감정을 골라주세요` : `감정 기록하기`}
          primary={true}
          disabled={selectedEmotions.length < 3 || selectedEmotions.length > 5}
          onPress={async () => {
            //console.log('버튼 누름 selected emotions : ', selectedEmotions);
            /*const emotionDetails = selectedEmotions.map((item) => ({
              keyword: item.keyword,
              group: item.group,
            }));*/
            setRecordedEmotions(selectedEmotions);
            //console.log('emotionDetails', emotionDetails);
            //console.log('=========', recordedEmotions);
            const res = await todayEmotion(recordedEmotions);
            //console.log('res', res);
            navigation.navigate(TabScreenName.Home);
          }}
        />
      </View>
    </Container>
  );
};

export default SmallEmotionChart;
