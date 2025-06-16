import { css } from '@emotion/native';
import { useHeaderHeight } from '@react-navigation/elements';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRoute, useFocusEffect } from '@react-navigation/native';
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
  Dimensions,
} from 'react-native';
import { useKeyboardHandler } from 'react-native-keyboard-controller';
import BottomSheet, { BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Icon from '../../../components/icons/icons';
import Toast from 'react-native-root-toast';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { dailyAnalyze, todayEmotion, todayEmotionCheck } from '../../../apis/analyze';
import CustomBottomSheet from '../../../components/custom-bottomsheet/custom-bottomsheet';
import {
  emotionData,
  emotionsByColumn,
  HomeStackName,
  MAXIMUM_EMOTION_COUNT,
  MINIMUM_EMOTION_COUNT,
  TabScreenName,
} from '../../../constants/Constants';
import Header from '../../../components/header/header';
import EmotionTitleBox from './emotionTitleBox';
import Analytics from '../../../utils/analytics';
import useRecordedEmotionStore from '../../../utils/emotion-recorded';
//import useEmotionStore from '../../../store/emotion-status';
import useMemosStore from '../../../store/useEmotionStore';
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
import { RootStackName } from '../../../constants/Constants';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { formatDateKorean } from '../../../utils/times';
import { MAX_SELECTED_EMOTION_COUNT } from '../../../constants/Constants';
import SelectedEmotionDesc from './SelectedEmotionDesc';
import SelectedEmotionChip from './SelectedEmotionChip';
const SmallEmotionChart = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  /*const {
    selectedEmotions,
    diaryText,
    setSelectedEmotions,
    addEmotion,
    removeEmotion,
    setDiaryText,
    setImages,
  } = useEmotionStore();*/
  //const [selectedEmotionsV2, setSelectedEmotionsV2] = useState([]);
  //const { recordedEmotions, setRecordedEmotions } = useRecordedEmotionStore();
  const scrollViewRef = useRef(null);
  const [text, setText] = useState<string>('');
  const headerHeight = useHeaderHeight();
  const [buttonHeight, setButtonHeight] = useState(0);
  //-1이면 닫힘, 0이면 열림
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1);
  const openBottomSheet = () => setBottomSheetIndex(0);
  const closeBottomSheet = () => setBottomSheetIndex(-1);

  const { dateID } = route.params;
  //const dateID = route?.params?.dateID ?? '2025-04-21';
  //console.log('감정 입력 페이지에서 받은 dateID', dateID);

  const width = Dimensions.get('window').width - 24;

  //일일 감정 데이터 가져오기
  /*const fetchData = async () => {
    const diaryData = await todayEmotionCheck(dateID);
    //console.log('new diaryData', diaryData.Keywords);
    //console.log('~~~~~~', selectedEmotions);
    setSelectedEmotions(diaryData.Keywords);
    setDiaryText(diaryData.todayFeeling ?? '');
    setImages(diaryData.images ?? []);
  };*/

  /*useEffect(() => {
    //Analytics.watchEmotionRecordScreen();
    fetchData();
    //setSelectedEmotion(recordedEmotions);
  }, []);*/

  /*const handleEmotionListClick = async (emotion) => {
    //console.log('emotion', emotion);
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
  };*/

  // Chip을 삭제하는 핸들러
  /*const handleRemoveEmotion = (emotion) => {
    removeEmotion(emotion.keyword);
  };*/

  /*useEffect(() => {
    // 스크롤 움직임을 약간 지연시키기 위해 setTimeout 사용
    const timeout = setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true }); // 스크롤을 맨 끝으로 이동
      }
    }, 100); // 100ms 뒤에 스크롤 움직임

    return () => clearTimeout(timeout); // 타이머 제거
  }, [selectedEmotions]); // selectedEmotions가 변경될 때마다 실행*/

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View
        style={css`
          padding-bottom: ${insets.bottom + 'px'};
          flex: 1;
        `}>
        <Header title={formatDateKorean(dateID)} />
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12, gap: 12, flexDirection: 'row' }}>
            {emotionsByColumn.map((column, colIndex) => (
              <View key={colIndex} style={{ gap: 12 /*backgroundColor: 'red'*/ }}>
                {column.map((emotion, i) => (
                  <EmotionChip
                    key={emotion.keyword}
                    group={emotion.group}
                    desc={emotion.desc}
                    keyword={emotion.keyword}
                  />
                ))}
              </View>
            ))}
          </ScrollView>
          <SelectedEmotionDesc />
          <SelectedEmotionChip />
          {/*<EmotionDesc textAlign={'center'}>
            {selectedEmotions.length > 0 &&
            emotionData[selectedEmotions[selectedEmotions.length - 1].keyword] !== undefined
              ? `${selectedEmotions[selectedEmotions.length - 1].keyword} : ${emotionData[selectedEmotions[selectedEmotions.length - 1].keyword].desc}`
              : ''}
          </EmotionDesc>()*/}

          {/*selectedEmotions.length > 0 && (
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
          )*/}
        </KeyboardAwareScrollView>
        <KeyboardStickyView
          offset={{ closed: 0, opened: Platform.OS === 'ios' ? insets.bottom : 0 }}>
          <View
            style={css`
              padding: ${rsHeight * 10 + 'px'};
              flex-direction: column;
              gap: ${rsWidth * 10 + 'px'};
              justify-content: center;
              height: ${rsHeight * 152 + 'px'};
            `}>
            <Button
              title="원하는 감정이 없어요"
              primary={false}
              //disabled={selectedEmotions.length < MINIMUM_EMOTION_COUNT}
              //disabled={
              //selectedEmotions.filter((emotion) => emotion.type !== 'custom').length ===
              //MAX_SELECTED_EMOTION_COUNT
              //}
              onPress={async () => {
                openBottomSheet();
                //console.log('bottom sheet 열기');
                Analytics.clickNoEmotionButton();
              }}
            />
            <Button
              title="마음일기 쓰러가기"
              primary={true}
              //disabled={selectedEmotions.length === 0}
              onPress={() => {
                Analytics.clickGotoDiaryWriteButton();
                navigation.navigate(HomeStackName.DailyDairy, { dateID: dateID });
                //새로운 화면이 push
              }}
            />
          </View>
        </KeyboardStickyView>
      </View>
      {bottomSheetIndex !== -1 && (
        <CustomBottomSheet indexNumber={bottomSheetIndex} onClose={closeBottomSheet} />
      )}
    </GestureHandlerRootView>
  );
};

export default SmallEmotionChart;
