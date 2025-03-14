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
import { Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';

const validateDairy = (sentence: string): 'error' | 'default' | 'correct' => {
  if (sentence.length > 0 && sentence.length <= 300) return 'correct';
  else return 'default';
};

const DailyDairy = ({ navigation }) => {
  const [text, setText] = useState<string>('');
  const maxLength = 300;
  const insets = useSafeAreaInsets();
  const { selectedEmotions, setSelectedEmotions } = useEmotionStore();
  const route = useRoute();
  console.log('📌 Route Object:', route);
  console.log('📌 Route Params:', route.params);
  const { date } = route.params || {};
  console.log('일기장 화면 date', date);

  useEffect(() => {
    console.log('Updated params:', route.params);
  }, [route.params]);
  useEffect(() => {
    Analytics.watchDiaryWriteScreen();
    todayEmotionCheck().then((data) => {
      setText(data?.todayFeeling ?? '');
    });
  }, []);

  return (
    <TouchableWithoutFeedback onPressIn={Keyboard.dismiss}>
      <View
        style={css`
          padding-bottom: ${insets.bottom + 'px'};
          flex: 1;
          margin-top: ${rsHeight * 12 + 'px'};
        `}>
        <EmotionTitleBox
          iconName={'dairy-cookie'}
          mainTitle={'오늘 하루를 되돌아봐요.'}
          subTitle={'이 감정을 가장 강하게 느낀 순간은 언제인가요?'}
        />
        {selectedEmotions.length > 0 && (
          <View
            style={css`
              margin-top: ${rsHeight * 12 + 'px'};
              //background-color: gray;
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
        <View
          style={css`
            margin-horizontal: ${rsWidth * 24 + 'px'};
            margin-vertical: ${rsHeight * 12 + 'px'};
            flex-direction: column;
            align-items: flex-end;
          `}>
          <TextInput
            style={css`
              width: 100%;
              border-radius: 10px;
              background-color: ${palette.neutral[100]};
              font-size: ${rsFont * 16 + 'px'};
              line-height: ${rsFont * 16 * 1.5 + 'px'};
              //margin-top: ${rsHeight * 12 + 'px'};
              //margin-bottom: ${rsHeight * 6 + 'px'};
              padding-horizontal: ${rsWidth * 12 + 'px'};
              padding-vertical: ${rsHeight * 12 + 'px'};
              height: ${rsHeight * 240 + 'px'};
              text-align-vertical: top;
              font-family: Kyobo-handwriting;
            `}
            placeholder="오늘은 어떤 일이 있었나요?"
            placeholderTextColor={palette.neutral[500]}
            multiline={true}
            scrollEnabled={true}
            value={text}
            onChangeText={(text) => setText(text)}
          />
          <Text
            style={css`
              font-size: 12px;
              color: #666;
              ${text.length >= maxLength &&
              css`
                color: red;
              `}
            `}>
            {text.length} / {maxLength}
          </Text>
        </View>

        <View
          style={css`
            //background-color: pink;
            //padding-left: ${rsWidth * 200 + 'px'};
            //padding-right: ${rsWidth * 24 + 'px'};
            padding-horizontal: ${rsWidth * 24 + 'px'};
          `}>
          <Button
            title="일기 기록하기"
            primary={true}
            disabled={validateDairy(text) === 'correct' ? false : true}
            onPress={async () => {
              Analytics.clickDiaryWriteButton();
              await todayEmotion(selectedEmotions, text);
              navigation.navigate(TabScreenName.Home);
            }}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
export default DailyDairy;
