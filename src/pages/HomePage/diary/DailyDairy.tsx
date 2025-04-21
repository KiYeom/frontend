import { css } from '@emotion/native';
import { useHeaderHeight } from '@react-navigation/elements';
import React, { useEffect, useState, useMemo } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  NativeModules,
  Platform,
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
import useEmotionStore from '../../../store/emotion-status';
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
import { Alert, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Header from '../../../components/header/header';
import { useCalendarStore } from '../../../store/calendarStore';
import { TEmotionCheck } from '~/src/apis/analyze.type';
import { formatDateKorean } from '../../../utils/times';
import { RootStackName } from '../../../constants/Constants';
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';
const validateDairy = (sentence: string): 'error' | 'default' | 'correct' => {
  if (sentence.length > 0 && sentence.length <= 300) return 'correct';
  else return 'default';
};

const DailyDairy = ({ navigation, route }) => {
  //const [text, setText] = useState<string>('');
  const maxLength = 300;
  const insets = useSafeAreaInsets();
  console.log('insets', insets);
  const { selectedEmotions, setSelectedEmotions, diaryText, setDiaryText } = useEmotionStore();

  const { calendarData, fetchCalendarData, updateEntryStatus, logCalendarState } =
    useCalendarStore();
  const [isRecordKeywordList, setIsRecordKeywordList] = useState<TEmotionCheck[]>([]);
  const [isNullRecordKeywordList, setIsNullRecordKeywordList] = useState(true);

  //const route = useRoute();
  ///console.log('📌 Route Object:', route);
  //console.log('📌 Route Params:', route.params);
  //const { date } = route.params || {};
  //console.log('일기장 화면 date', date);

  //useEffect(() => {
  //console.log('Updated params:', route.params);
  //}, [route.params]);
  const { dateID } = route.params;
  //console.log('일기 입력 페이지에서 받은 dateID', dateID);

  const inputRef = React.useRef<TextInput>(null);
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  });

  const fetchData = async () => {
    const dailyStatistics = await dailyAnalyze(dateID);
    if (!dailyStatistics) return;
    setIsRecordKeywordList(dailyStatistics.record.Keywords);
    setIsNullRecordKeywordList(dailyStatistics.record.isNULL);
  };
  const { bottom } = useSafeAreaInsets();
  const offset = useMemo(() => ({ closed: 0, opened: bottom }), [bottom]);

  useEffect(() => {
    Analytics.watchDiaryWriteScreen();
    fetchData();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, paddingBottom: insets.bottom }}>
      <View
        style={css`
          padding-bottom: 100px;
          flex: 1;
          //background-color: blue;
        `}>
        <Header title={formatDateKorean(dateID)} />
        <KeyboardAwareScrollView
          style={{ flex: 1, gap: rsHeight * 12 + 'px' }}
          keyboardDismissMode="none">
          <View
            style={css`
              margin-top: ${rsHeight * 12 + 'px'};
              //background-color: pink;
            `}>
            <EmotionTitleBox
              iconName={'dairy-cookie'}
              mainTitle={'오늘 하루를 되돌아봐요.'}
              subTitle={'이 감정을 가장 강하게 느낀 순간은 언제인가요?'}
            />
          </View>
          {selectedEmotions.length > 0 && (
            <View
              style={css`
                margin-top: ${rsHeight * 12 + 'px'};
                background-color: black;
                flex-direction: row;
                flex-wrap: wrap;
                gap: ${rsWidth * 6 + 'px'};
                padding-horizontal: ${rsWidth * 24 + 'px'};
              `}>
              {selectedEmotions.length > 0
                ? selectedEmotions.map((emotion, i) => (
                    <EmotionCard key={i} emotion={emotion} status={'default'} />
                  ))
                : ''}
            </View>
          )}
          <TextInput
            style={css`
              margin-top: ${rsHeight * 12 + 'px'};
              margin-horizontal: ${rsWidth * 24 + 'px'};
              border-radius: 10px;
              background-color: ${palette.neutral[100]};
              background-color: transparent;
              font-size: ${rsFont * 16 + 'px'};
              line-height: ${rsFont * 16 * 1.5 + 'px'};
              //margin-top: ${rsHeight * 12 + 'px'};
              //margin-bottom: ${rsHeight * 6 + 'px'};
              padding-horizontal: ${rsWidth * 12 + 'px'};
              padding-vertical: ${rsHeight * 12 + 'px'};
              text-align-vertical: top;
              font-family: Kyobo-handwriting;
              padding-bottom: ${rsHeight * 50 + 'px'};
              height: ${rsHeight * 200 + 'px'};
              background-color: ${palette.neutral[100]};
            `}
            placeholder="이 감정을 강하게 느낀 순간을 기록해보세요"
            placeholderTextColor={palette.neutral[300]}
            multiline={true}
            scrollEnabled={true}
            value={diaryText}
            onChangeText={(diaryText) => setDiaryText(diaryText)}
            onBlur={() => {
              inputRef.current?.focus();
            }}
          />
        </KeyboardAwareScrollView>
      </View>

      <KeyboardStickyView offset={offset}>
        <View
          style={css`
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: ${rsHeight * 12 + 'px'} ${rsWidth * 16 + 'px'};
            background-color: ${palette.neutral[100]};
            border-top-width: 1px;
            border-top-color: ${palette.neutral[200]};
          `}>
          <TouchableOpacity
            onPress={() => console.log('사진 아이콘 클릭')}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
            <Icon
              name="picture-icon"
              width={rsWidth * 20}
              height={rsHeight * 20}
              color={palette.neutral[400]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => console.log('체크 아이콘 클릭')}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
            <Icon
              name="check-icon"
              width={rsWidth * 20}
              height={rsHeight * 20}
              color={palette.neutral[400]}
            />
          </TouchableOpacity>
        </View>
      </KeyboardStickyView>
    </GestureHandlerRootView>
  );
};
export default DailyDairy;
