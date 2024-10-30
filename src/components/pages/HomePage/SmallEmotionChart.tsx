import { css } from '@emotion/native';
import { useHeaderHeight } from '@react-navigation/elements';
import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  NativeModules,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Toast from 'react-native-root-toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Carousel } from 'react-native-ui-lib';
import { dailyAnalyze, todayEmotion } from '../../../apis/analyze';
import {
  emotionData,
  emotionsByColumn,
  MAXIMUM_EMOTION_COUNT,
  MINIMUM_EMOTION_COUNT,
  TabScreenName,
} from '../../../constants/Constants';
import Analytics from '../../../utils/analytics';
import useRecordedEmotionStore from '../../../utils/emotion-recorded';
import useEmotionStore from '../../../utils/emotion-status';
import { rsHeight, rsWidth } from '../../../utils/responsive-size';
import { getUserNickname } from '../../../utils/storageUtils';
import EmotionCard from '../../atoms/EmotionCard/EmotionCard';
import EmotionChip from '../../atoms/EmotionChip/EmotionChip';
import Button from '../../button/button';
import Input from '../../input/input';
import { EmotionDesc, SmallTitle, Title } from './EmotionChart.style';

const getApiDateString = (date: Date): string => {
  return (
    date?.getFullYear() +
    '-' +
    String(date.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(date.getDate()).padStart(2, '0')
  );
};

const SmallEmotionChart = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { selectedEmotions, setSelectedEmotions, addEmotion, removeEmotion } = useEmotionStore();
  const { recordedEmotions, setRecordedEmotions } = useRecordedEmotionStore();
  const scrollViewRef = useRef(null);
  const [text, setText] = useState('');
  const headerHeight = useHeaderHeight();

  useEffect(() => {
    if (Platform.OS === 'ios') {
      const { StatusBarManager } = NativeModules;
    }
    dailyAnalyze(getApiDateString(new Date())).then((data) => {
      if (!data || !data.record || !data.record.todayFeeling) return;
      setText(data.record.todayFeeling);
    });
    setSelectedEmotions(recordedEmotions);
  }, []);

  const handleEmotionListClick = async (emotion) => {
    // 이미 선택된 감정인지 확인
    if (selectedEmotions.some((e) => e.keyword === emotion.keyword)) {
      removeEmotion(emotion.keyword);
    } else {
      // 선택된 감정 추가
      if (selectedEmotions.length >= MAXIMUM_EMOTION_COUNT) {
        Toast.show(`감정은 ${MAXIMUM_EMOTION_COUNT}개까지 선택할 수 있습니다!`, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.CENTER,
        });
        return;
      }
      addEmotion(emotion);
    }
  };

  useEffect(() => {
    Analytics.watchEmotionRecordScreen();
  }, []);

  useEffect(() => {
    // 스크롤 움직임을 약간 지연시키기 위해 setTimeout 사용
    const timeout = setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true }); // 스크롤을 맨 끝으로 이동
      }
    }, 100); // 100ms 뒤에 스크롤 움직임

    return () => clearTimeout(timeout); // 타이머 제거
  }, [selectedEmotions]); // selectedEmotions가 변경될 때마다 실행

  // Chip을 삭제하는 핸들러
  const handleRemoveEmotion = (emotion) => {
    removeEmotion(emotion.keyword);
  };

  return (
    <View
      style={css`
        flex: 1;
        padding-bottom: ${insets.bottom + 'px'};
      `}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}>
        <ScrollView>
          <Title
            // ellipsizeMode="tail"
            style={css`
              margin-horizontal: ${rsWidth * 24 + 'px'};
              text-align: left;
            `}>
            {getUserNickname()}님,{'\n'}지금 기분은 어떠세요?🐾
          </Title>

          <Carousel
            pageWidth={rsWidth * 150} //캐러셀의 너비
            initialPage={2} //앱이 처음 실행되고 보여줄 초기 페이지
            itemSpacings={12 * rsWidth}>
            {emotionsByColumn.map((emotions, index) => (
              <View key={index}>
                {emotions.map((emotion, i) => (
                  <EmotionChip
                    key={i}
                    group={emotion.group}
                    keyword={emotion.keyword}
                    isSelected={selectedEmotions.some((e) => e.keyword === emotion.keyword)} // 선택된 감정인지 확인
                    onPress={() => handleEmotionListClick(emotion)}
                  />
                ))}
              </View>
            ))}
          </Carousel>

          <View
            style={css`
              padding-vertical: ${rsHeight * 10 + 'px'};
              padding-horizontal: ${rsWidth * 24 + 'px'};
              flex-grow: 0;
              gap: ${rsHeight * 10 + 'px'};
              //background-color: blue;
            `}>
            <SmallTitle>{selectedEmotions.length}개의 감정을 담았어요🐶</SmallTitle>

            <EmotionDesc>
              {selectedEmotions.length > 0
                ? `${selectedEmotions[selectedEmotions.length - 1].keyword} : ${emotionData[selectedEmotions[selectedEmotions.length - 1].keyword].desc}`
                : ''}
            </EmotionDesc>

            <ScrollView
              horizontal
              ref={scrollViewRef}
              showsHorizontalScrollIndicator={false}
              style={css`
                flex-grow: 1;
              `}
              contentContainerStyle={css`
                flex-grow: 1;
                flex-direction: row;
                gap: ${rsWidth * 8 + 'px'};
              `}>
              {selectedEmotions.length > 0 ? (
                selectedEmotions.map((emotion, i) => (
                  <EmotionCard
                    key={i}
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
            <SmallTitle>오늘 하루는 어떠셨나요?💭</SmallTitle>
            <Input value={text} onChange={(text) => setText(text)} />
          </View>

          <View
            style={css`
              padding-top: ${rsHeight * 10 + 'px'};
              padding-bottom: ${rsHeight * 12 + 'px'};
              padding-horizontal: ${rsWidth * 24 + 'px'};
            `}>
            <Button
              title={
                selectedEmotions.length < MINIMUM_EMOTION_COUNT
                  ? `오늘의 마음을 알려주세요`
                  : `쿠키에게 알려주기`
              }
              primary={true}
              disabled={
                (selectedEmotions.length < MINIMUM_EMOTION_COUNT && text.trim() === '') ||
                selectedEmotions.length > MAXIMUM_EMOTION_COUNT
              }
              onPress={async () => {
                Analytics.clickRecordButton();
                setRecordedEmotions(selectedEmotions); // 상태 업데이트
                await todayEmotion(selectedEmotions, text); //
                navigation.navigate(TabScreenName.Home);
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SmallEmotionChart;
