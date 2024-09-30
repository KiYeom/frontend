import { css } from '@emotion/native';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import Toast from 'react-native-root-toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Carousel, Text, View } from 'react-native-ui-lib';
import { todayEmotion } from '../../../apis/analyze';
import palette from '../../../assets/styles/theme';
import { emotionData, emotions, TabScreenName } from '../../../constants/Constants';
import useRecordedEmotionStore from '../../../utils/emotion-recorded';
import useEmotionStore from '../../../utils/emotion-status';
import { rsHeight, rsWidth } from '../../../utils/responsive-size';
import { getUserNickname } from '../../../utils/storageUtils';
import EmotionCard from '../../atoms/EmotionCard/EmotionCard';
import EmotionChip from '../../atoms/EmotionChip/EmotionChip';
import Button from '../../button/button';
import { Container, EmotionDesc, SmallTitle, Title } from './EmotionChart.style';

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
  const scrollViewRef = useRef(null);

  useEffect(() => {
    setSelectedEmotions(recordedEmotions);
  }, []);

  const handleEmotionListClick = async (emotion) => {
    // 이미 선택된 감정인지 확인
    if (selectedEmotions.some((e) => e.keyword === emotion.keyword)) {
      removeEmotion(emotion.keyword);
    } else {
      // 선택된 감정 추가
      if (selectedEmotions.length >= 5) {
        Toast.show('감정은 5개까지 선택할 수 있습니다!', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.CENTER,
        });
        return;
      }
      addEmotion(emotion);
    }
  };

  useEffect(() => {
    // 스크롤 움직임을 약간 지연시키기 위해 setTimeout 사용
    const timeout = setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true }); // 스크롤을 맨 끝으로 이동
      }
    }, 100); // 100ms 뒤에 스크롤 움직임

    return () => clearTimeout(timeout); // 타이머 제거
  }, [selectedEmotions]); // selectedEmotions가 변경될 때마다 실행

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
    removeEmotion(emotion.keyword);
  };

  return (
    <Container>
      <Title
        style={css`
          margin-horizontal: ${rsWidth * 24 + 'px'};
          padding-top: ${rsHeight * 40 + 'px'};
          text-align: left;
        `}>
        {getUserNickname()}님,{'\n'}오늘 하루는 어떠셨나요?🐾
      </Title>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <Carousel
          ref={carouselRef}
          onChangePage={onChangePage}
          pageWidth={getWidth()} //캐러셀의 너비
          containerPaddingVertical={10 * rsHeight} //캐러셀 전체 화면이랑 요소 사이 마진값 (vertical)
          containerMarginHorizontal={12 * rsWidth} //캐러셀 전체 화면이랑 요소 사이에 마진값
          initialPage={2} //앱이 처음 실행되고 보여줄 초기 페이지
          containerStyle={{ flexGrow: 1 }} //캐러셀 전체 스타일링
          pageControlProps={{
            onPagePress,
            color: palette.neutral[900],
            size: 10,
            numOfPages: 6,
            limitShownPages: false,
          }}
          itemSpacings={12 * rsWidth}>
          {emotions.map((test, index) => (
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
          ref={scrollViewRef}
          showsHorizontalScrollIndicator={false}
          style={{
            flexGrow: 0,
            paddingVertical: 15 * rsHeight,
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
            setRecordedEmotions(selectedEmotions); // 상태 업데이트
            await todayEmotion(selectedEmotions); //
            navigation.navigate(TabScreenName.Home);
          }}
        />
      </View>
    </Container>
  );
};

export default SmallEmotionChart;
