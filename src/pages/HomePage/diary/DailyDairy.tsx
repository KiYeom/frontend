import { css } from '@emotion/native';
import { useHeaderHeight } from '@react-navigation/elements';
import React, { useEffect, useState } from 'react';
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
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Icon from '../../../components/icons/icons';
import Toast from 'react-native-root-toast';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { dailyAnalyze, todayEmotion, todayEmotionCheck } from '../../../apis/analyze';
import StickyFooter from './StickyFooter';
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
  useKeyboardHandler,
  KeyboardAwareScrollView,
  KeyboardToolbar,
  KeyboardStickyView,
} from 'react-native-keyboard-controller';
import palette from '../../../assets/styles/theme';
import { Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Header from '../../../components/header/header';
import { useCalendarStore } from '../../../store/calendarStore';
import { TEmotionCheck } from '~/src/apis/analyze.type';
import { formatDateKorean } from '../../../utils/times';
import { RootStackName } from '../../../constants/Constants';

const validateDairy = (sentence: string): 'error' | 'default' | 'correct' => {
  if (sentence.length > 0 && sentence.length <= 300) return 'correct';
  else return 'default';
};

const DailyDairy = ({ navigation, route }) => {
  const maxLength = 300;
  const insets = useSafeAreaInsets();
  const { selectedEmotions, setSelectedEmotions, diaryText, setDiaryText } = useEmotionStore();

  const { calendarData, fetchCalendarData, updateEntryStatus, logCalendarState } =
    useCalendarStore();
  const [isRecordKeywordList, setIsRecordKeywordList] = useState<TEmotionCheck[]>([]);
  const [isNullRecordKeywordList, setIsNullRecordKeywordList] = useState(true);

  const { dateID } = route.params;

  const fetchData = async () => {
    const dailyStatistics = await dailyAnalyze(dateID);
    if (!dailyStatistics) return;
    setIsRecordKeywordList(dailyStatistics.record.Keywords);
    setIsNullRecordKeywordList(dailyStatistics.record.isNULL);
  };

  const handleSubmit = () => {
    // Add your submission logic here
    Alert.alert('Success', '일기가 저장되었습니다.');
    navigation.goBack();
  };

  useEffect(() => {
    Analytics.watchDiaryWriteScreen();
    fetchData();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: 'yellow' }}>
      <Header title={formatDateKorean(dateID)} />
      <KeyboardAwareScrollView
        style={css`
          flex: 1;
        `}
        contentContainerStyle={css`
          flex-grow: 1;
        `}
        keyboardShouldPersistTaps="handled">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={css`
              background-color: red;
            `}>
            <View
              style={css`
                margin-top: ${rsHeight * 12 + 'px'};
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
                  flex-direction: row;
                  flex-wrap: wrap;
                  gap: ${rsWidth * 6 + 'px'};
                  background-color: gray;
                  padding-horizontal: ${rsWidth * 24 + 'px'};
                `}>
                {selectedEmotions.map((emotion, i) => (
                  <EmotionCard key={i} emotion={emotion} status={'default'} />
                ))}
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
        <TextInput
          style={css`
            width: 100%;
            border-radius: 10px;
            background-color: ${palette.neutral[100]};
            font-size: ${rsFont * 16 + 'px'};
            line-height: ${rsFont * 16 * 1.5 + 'px'};
            margin-top: ${rsHeight * 12 + 'px'};
            margin-bottom: ${rsHeight * 6 + 'px'};
            padding-horizontal: ${rsWidth * 12 + 'px'};
            padding-vertical: ${rsHeight * 12 + 'px'};
            height: ${rsHeight * 240 + 'px'};
            text-align-vertical: top;
            font-family: Kyobo-handwriting;
          `}
          placeholder="오늘은 어떤 일이 있었나요?"
          placeholderTextColor={palette.neutral[400]}
          multiline={true}
          scrollEnabled={true}
          value={diaryText}
          onChangeText={(text) => setDiaryText(text)}
        />
      </KeyboardAwareScrollView>

      <StickyFooter></StickyFooter>
    </View>
  );
};

export default DailyDairy;
