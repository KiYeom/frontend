import { css } from '@emotion/native';
import { useHeaderHeight } from '@react-navigation/elements';
import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  NativeModules,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useKeyboardHandler } from 'react-native-keyboard-controller';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Icon from '../../../components/icons/icons';
import Toast from 'react-native-root-toast';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Carousel } from 'react-native-ui-lib';
import { dailyAnalyze, todayEmotion, todayEmotionCheck } from '../../../apis/analyze';
import {
  emotionData,
  emotionsByColumn,
  HomeStackName,
  MAXIMUM_EMOTION_COUNT,
  MINIMUM_EMOTION_COUNT,
  TabScreenName,
} from '../../../constants/Constants';
import EmotionTitleBox from './emotionTitleBox';
import Analytics from '../../../utils/analytics';
import useRecordedEmotionStore from '../../../utils/emotion-recorded';
import useEmotionStore from '../../../utils/emotion-status';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';
import { getUserNickname } from '../../../utils/storageUtils';
import EmotionCard from '../../../components/atoms/EmotionCard/EmotionCard';
import EmotionChip from '../../../components/atoms/EmotionChip/EmotionChip';
import Button from '../../../components/button/button';
import Input from '../../../components/input/input';
import { EmotionDesc, SmallTitle, Title } from './EmotionChart.style';
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
  KeyboardStickyView,
} from 'react-native-keyboard-controller';
import palette from '../../../assets/styles/theme';

const SmallEmotionChart = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { selectedEmotions, setSelectedEmotions, addEmotion, removeEmotion } = useEmotionStore();
  const { recordedEmotions, setRecordedEmotions } = useRecordedEmotionStore();
  const scrollViewRef = useRef(null);
  const [text, setText] = useState('');
  const headerHeight = useHeaderHeight();
  const [buttonHeight, setButtonHeight] = useState(0);

  useEffect(() => {
    Analytics.watchEmotionRecordScreen();
    //todayEmotionCheck().then((data) => {
    //setText(data.todayFeeling);
    //});
    setSelectedEmotions(recordedEmotions);
  }, []);

  const handleEmotionListClick = async (emotion) => {
    // 이미 선택된 감정인지 확인
    if (selectedEmotions.some((e) => e.keyword === emotion.keyword)) {
      removeEmotion(emotion.keyword);
    } else {
      // 선택된 감정 추가
      if (selectedEmotions.length >= MAXIMUM_EMOTION_COUNT) {
        Toast.show(`감정은 ${MAXIMUM_EMOTION_COUNT}개까지 선택할 수 있어요🐶`, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.CENTER,
        });
        return;
      }
      addEmotion(emotion);
    }
  };

  // Chip을 삭제하는 핸들러
  const handleRemoveEmotion = (emotion) => {
    removeEmotion(emotion.keyword);
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

  return (
    <View
      style={css`
        padding-bottom: ${insets.bottom + 'px'};
        flex: 1;
      `}>
      <KeyboardAwareScrollView
        bottomOffset={insets.bottom + 70}
        contentContainerStyle={css`
          background-color: white;
          margin-top: ${rsHeight * 12 + 'px'};
        `}>
        <EmotionTitleBox
          iconName={'emotion-thinking-cookie'}
          mainTitle={'지금 어떤 감정이 드나요?'}
          subTitle={'나의 마음을 표현해보세요.'}
        />

        <Carousel
          pageWidth={rsWidth * 150} //캐러셀의 너비
          initialPage={0} //앱이 처음 실행되고 보여줄 초기 페이지
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
        <EmotionDesc textAlign={'center'}>
          {selectedEmotions.length > 0
            ? `${selectedEmotions[selectedEmotions.length - 1].keyword} : ${emotionData[selectedEmotions[selectedEmotions.length - 1].keyword].desc}`
            : ''}
        </EmotionDesc>

        {selectedEmotions.length > 0 && (
          <View
            style={css`
              margin-top: ${rsHeight * 12 + 'px'};
              //background-color: gray;
              height: ${rsHeight * 80 + 'px'};
              flex-direction: row;
              flex-wrap: wrap;
              gap: ${rsWidth * 6 + 'px'};
              padding-horizontal: ${rsWidth * 24 + 'px'};
            `}>
            {selectedEmotions.length > 0
              ? selectedEmotions.map((emotion, i) => (
                  <EmotionCard
                    key={i}
                    emotion={emotion}
                    onPress={handleRemoveEmotion}
                    status={'default'}
                  />
                ))
              : ''}
          </View>
        )}
      </KeyboardAwareScrollView>
      <KeyboardStickyView offset={{ closed: 0, opened: Platform.OS === 'ios' ? insets.bottom : 0 }}>
        <View
          style={css`
            padding: ${rsHeight * 10 + 'px'};
            //background-color: pink;
            flex-direction: row;
            gap: ${rsWidth * 10 + 'px'};
            justify-content: center;
          `}>
          {/*<Button
            title={
              selectedEmotions.length < MINIMUM_EMOTION_COUNT
                ? `오늘의 마음을 알려주세요`
                : `쿠키에게 알려주기`
            }
            primary={true}
            disabled={
              (selectedEmotions.length < MINIMUM_EMOTION_COUNT && (!text || text.trim() === '')) ||
              selectedEmotions.length > MAXIMUM_EMOTION_COUNT
            }
            onPress={async () => {
              Analytics.clickRecordButton();
              setRecordedEmotions(selectedEmotions); // 상태 업데이트
              await todayEmotion(selectedEmotions, text);
              navigation.navigate(TabScreenName.Home);
            }}
          />*/}
          <Button
            title="감정만 기록하기"
            primary={false}
            disabled={selectedEmotions.length < MINIMUM_EMOTION_COUNT}
            onPress={async () => {
              //Analytics.clickRecordButton();
              Analytics.clickEmotionRecordButton();
              setRecordedEmotions(selectedEmotions); // 상태 업데이트
              await todayEmotion(selectedEmotions, text);
              navigation.navigate(TabScreenName.Home);
            }}
          />
          <Button
            title="마음일기 쓰러가기"
            primary={true}
            onPress={() => {
              Analytics.clickGotoDiaryWriteButton();
              navigation.navigate(HomeStackName.DailyDairy);
            }}
          />
        </View>
      </KeyboardStickyView>
    </View>
  );
};

export default SmallEmotionChart;
