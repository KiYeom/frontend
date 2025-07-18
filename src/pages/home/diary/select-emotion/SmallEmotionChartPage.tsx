import { css } from '@emotion/native';
import React, { useEffect, useState, useCallback } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomBottomSheet from '../../../../components/custom-bottomsheet/CustomBottomSheet';
import { HomeStackName } from '../../../../constants/Constants';
import Header from '../../../../components/header/Header';
import EmotionTitleBox from './emotionTitleBox';
import Analytics from '../../../../utils/analytics';
import useEmotionStore from '../../../../store/useEmotionStore';
import { rsFont, rsHeight, rsWidth } from '../../../../utils/responsive-size';
import EmotionChip from './EmotionChip';
import Button from '../../../../components/button/Button';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { formatDateKorean } from '../../../../utils/times';
import SelectedEmotionDesc from './SelectedEmotionDesc';
import SelectedEmotionChip from './SelectedEmotionChip';
import { useEmotionData } from '../../../../queries/emotionQueries';
import { SelectableEmotion } from '../../../../store/useEmotionStore';
import { getEmotionColumns, allEmotionData } from '../../../../constants/Constants';
import EmotionFooterButtons from './EmotionFooterButton';

type SmallEmotionChartRouteParams = {
  dateID: string; // 날짜 ID, 예: '2025-01-01'
};

type Props = {
  navigation: any; // 나중에 Navigation 타입도 정의 가능
  route: {
    params: SmallEmotionChartRouteParams;
  };
};
// 감정 칩들을 열로 나누는 함수 (6개의 열로 나눔)
const emotionsByColumn = getEmotionColumns(allEmotionData, 6);
const SmallEmotionChart = ({ navigation, route }: Props) => {
  const insets = useSafeAreaInsets();
  //-1이면 닫힘, 0이면 열림
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1);
  const openBottomSheet = () => setBottomSheetIndex(0);
  const closeBottomSheet = () => setBottomSheetIndex(-1);

  const { dateID } = route.params;
  const initializeFromServerData = useEmotionStore((state) => state.initializeFromServerData);
  // React Query로 서버 데이터 관리
  const { data: emotionData, isLoading, error, isError, dataUpdatedAt } = useEmotionData(dateID);

  useEffect(() => {
    if (emotionData) {
      //console.log('emotionData!', emotionData);
      initializeFromServerData(emotionData);
    }
  }, [emotionData, initializeFromServerData]);

  const handleNoEmotion = useCallback(() => {
    openBottomSheet();
    Analytics.clickNoEmotionButton();
  }, [openBottomSheet]);

  const handleGoToDiary = useCallback(() => {
    console.log('handleGoToDiary', dateID);
    Analytics.clickGotoDiaryWriteButton();
    navigation.navigate(HomeStackName.DailyDairy, { dateID });
  }, [navigation, dateID]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View
        style={{
          paddingBottom: insets.bottom,
          flex: 1,
        }}>
        <Header title={formatDateKorean(dateID)} />
        <KeyboardAwareScrollView
          bottomOffset={insets.bottom + 70}
          contentContainerStyle={{
            backgroundColor: 'white',
            marginTop: rsHeight * 12,
          }}>
          <EmotionTitleBox
            iconName={'emotion-thinking-cookie'}
            mainTitle={'지금 어떤 감정이 드나요?'}
            subTitle={'나의 마음을 표현해보세요.'}
          />
          {/* 감정 선택 스크롤뷰 */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 12,
              gap: 12,
              flexDirection: 'row',
            }}>
            {emotionsByColumn.map((column, colIndex) => (
              <View key={colIndex} style={{ gap: 12 /*backgroundColor: 'red'*/ }}>
                {column.map((emotion: SelectableEmotion, i: number) => (
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
          {/* 선택된 감정 설명 */}
          <SelectedEmotionDesc />
          {/* 선택된 감정 칩들 */}
          <SelectedEmotionChip />
        </KeyboardAwareScrollView>
        {/* 하단 선택 버튼 */}
        <EmotionFooterButtons onNoEmotionPress={handleNoEmotion} onGoToDiary={handleGoToDiary} />
      </View>
      {bottomSheetIndex !== -1 && (
        <CustomBottomSheet indexNumber={bottomSheetIndex} onClose={closeBottomSheet} />
      )}
    </GestureHandlerRootView>
  );
};

export default SmallEmotionChart;
