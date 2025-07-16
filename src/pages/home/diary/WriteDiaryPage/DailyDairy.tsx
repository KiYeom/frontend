import { css } from '@emotion/native';
import React, { useEffect, useState, useMemo } from 'react';
import { View } from 'react-native';
import { rsHeight, rsWidth } from '../../../../utils/responsive-size';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EmotionTitleBox from '../SelectEmotionPage/emotionTitleBox';
import { formatDateKorean } from '../../../../utils/times';
import Header from '../../../../components/header/header';
import useDiarySubmit from '../../../../hooks/useDiarySubmit';
import Button from '../../../../components/button/button';
import DiaryImageSection from './DiaryImageSection';
import SelectedEmotionChip from '../SelectEmotionPage/SelectedEmotionChip';
import TextInputSection from './TextInputSection';
import LoadingOverlay from '@components/LoadingOverlay/LoadingOverlay';

const DailyDairy = ({ navigation, route }) => {
  const { dateID } = route.params;
  const insets = useSafeAreaInsets();

  // 커스텀 훅 사용
  const { onPressSaveDiary, isNavigationLoading } = useDiarySubmit(dateID, navigation);

  return (
    <>
      <View style={{ flex: 1, paddingBottom: insets.bottom }}>
        <Header title={formatDateKorean(dateID)} />

        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          bottomOffset={insets.bottom + 60} // 안전정역 + 스티키뷰 높이
          // 키보드에 올라가는 높이 + 스티키 뷰 높이
          scrollEnabled={true}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: insets.bottom + 60,
          }}>
          {/* 제목 */}
          <EmotionTitleBox
            iconName="dairy-cookie"
            mainTitle="오늘 하루를 되돌아봐요."
            subTitle="이 감정을 가장 강하게 느낀 순간은 언제인가요?"
          />
          {/* 선택된 감정 카드 리스트*/}
          <SelectedEmotionChip />
          {/* 사진 선택 창 */}
          <DiaryImageSection />

          {/* 풀스크린 멀티라인 입력창 */}
          <TextInputSection />
        </KeyboardAwareScrollView>

        {/* 하단 영역 (버튼) */}
        <KeyboardStickyView
          offset={{ closed: 0, opened: insets.bottom }}
          style={{
            paddingHorizontal: rsWidth * 20,
            paddingVertical: rsHeight * 10,
          }}>
          <Button
            title="일기 저장하기"
            onPress={onPressSaveDiary}
            primary={true}
            disabled={false}
          />
        </KeyboardStickyView>
      </View>
      {isNavigationLoading && <LoadingOverlay visible={isNavigationLoading} />}
    </>
  );
};

export default DailyDairy;
