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
import Icon from '../../icons/icons';
import Toast from 'react-native-root-toast';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Carousel } from 'react-native-ui-lib';
import { dailyAnalyze, todayEmotion, todayEmotionCheck } from '../../../apis/analyze';
import {
  emotionData,
  emotionsByColumn,
  MAXIMUM_EMOTION_COUNT,
  MINIMUM_EMOTION_COUNT,
  TabScreenName,
} from '../../../constants/Constants';
import EmotionTitleBox from './emotionTitleBox';
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
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
  KeyboardStickyView,
} from 'react-native-keyboard-controller';

const SmallEmotionChart = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { selectedEmotions, setSelectedEmotions, addEmotion, removeEmotion } = useEmotionStore();
  const { recordedEmotions, setRecordedEmotions } = useRecordedEmotionStore();
  const scrollViewRef = useRef(null);
  const [text, setText] = useState('');
  const headerHeight = useHeaderHeight();
  const buttonRef = useRef(null);
  const [buttonHeight, setButtonHeight] = useState(0);

  useEffect(() => {
    Analytics.watchEmotionRecordScreen();
    todayEmotionCheck().then((data) => {
      setText(data.todayFeeling);
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

  useEffect(() => {
    buttonRef.current?.measure((x, y, width, height) => {
      setButtonHeight(height);
    });
  }, []);

  return (
    <View
      style={css`
        padding-bottom: ${insets.bottom + 'px'};
        flex: 1;
      `}>
      <KeyboardAwareScrollView
        bottomOffset={insets.bottom + 70}
        contentContainerStyle={css`
          background-color: red;
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

        <View
          style={css`
            padding-vertical: ${rsHeight * 10 + 'px'};
            padding-horizontal: ${rsWidth * 24 + 'px'};
            gap: ${rsHeight * 10 + 'px'};
          `}>
          <SmallTitle>{selectedEmotions.length}개의 감정을 담았어요🐶</SmallTitle>

          <EmotionDesc textAlign={'center'}>
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
          {/*<View
            style={css`
              display: flex;
              flex-direction: row;
              gap: ${rsWidth * 10 + 'px'};
            `}>
            <Icon name="dairy-cookie" width={80} height={60} />
            <View
              style={css`
                display: flex;
                flex-direction: column;
                justify-content: center;
              `}>
              <SmallTitle>오늘 하루를 되돌아봐요💭</SmallTitle>
              <EmotionDesc>가장 인상깊었던 일은 무엇이었나요?</EmotionDesc>
            </View>
          </View>*/}
        </View>
        <EmotionTitleBox
          iconName={'dairy-cookie'}
          mainTitle={'오늘 하루를 되돌아봐요'}
          subTitle={'이 감정을 가장 강하게 느낀 순간은 언제인가요?'}
        />
        <TextInput
          style={css`
            border: 1px solid #e5e5e5;
            font-size: 16px;
            padding: ${rsHeight * 10 + 'px'};
            margin-top: ${rsHeight * 10 + 'px'};
            margin-bottom: ${rsHeight * 30 + 'px'};
            min-height: ${rsHeight * 100 + 'px'};
            text-align-vertical: top;
          `}
          multiline={true}
          scrollEnabled={false}
          value={text}
          onChangeText={(text) => setText(text)}
        />
      </KeyboardAwareScrollView>
      <KeyboardStickyView offset={{ closed: 0, opened: Platform.OS === 'ios' ? insets.bottom : 0 }}>
        <View
          style={css`
            padding: ${rsHeight * 10 + 'px'};
            background-color: blue;
          `}>
          <Button title="테스트" primary={true} />
        </View>
      </KeyboardStickyView>
    </View>
  );
};

export default SmallEmotionChart;
