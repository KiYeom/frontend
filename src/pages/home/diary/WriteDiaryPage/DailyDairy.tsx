import { css } from '@emotion/native';
import React, { useEffect, useState, useMemo } from 'react';
import { View, Platform, ImageSourcePropType } from 'react-native';
import { rsHeight, rsWidth, rsFont } from '../../../../utils/responsive-size';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';
import Toast from 'react-native-root-toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabScreenName, RootStackName } from '../../../../constants/Constants';
import EmotionTitleBox from '../SelectEmotionPage/emotionTitleBox';
import Analytics from '../../../../utils/analytics';
import { formatDateKorean } from '../../../../utils/times';
import Header from '../../../../components/header/header';
import { useCalendarStore } from '../../../../store/calendarStore';
import palette from '../../../../assets/styles/theme';
import TierModal from '../../../../components/modals/tier-modal';
import AdsModal from '../../../../components/modals/ads-modal';
import { getUserInfo } from '../../../../apis/setting';
import { ActivityIndicator, StyleSheet } from 'react-native';
import {
  getUserPlan,
  setUserPlan,
  getCanSendPhoto,
  setCanSendPhoto,
} from '../../../../utils/storageUtils';
import Constants from 'expo-constants';
//import adUnitId from '../../../utils/advertise';
import { getUserNickname } from '../../../../utils/storageUtils';
import Button from '../../../../components/button/button';
import useEmotionStore from '../../../../store/useEmotionStore';
import DiaryImageSection from './DiaryImageSection';
import SelectedEmotionChip from '../SelectEmotionPage/SelectedEmotionChip';
import TextInputSection from './TextInputSection';
import { useSaveEmotion, useSaveEmotionWithImage } from '../../../../queries/emotionQueries';

const localImage: ImageSourcePropType = require('../../../../assets/images/cookie_pic_alarm.png');
const adsImage: ImageSourcePropType = require('../../../../assets/images/ads_cookie.png');

const DailyDairy = ({ navigation, route }) => {
  console.log('DailyDairy 컴포넌트 렌더링');
  const { dateID } = route.params;
  const insets = useSafeAreaInsets();

  const { updateEntryStatus } = useCalendarStore();

  //이미지 가지고 오기
  //const [image, setImage] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false); //사진 경고 모달
  //const [adsModalVisible, setAdsModalVisible] = useState<boolean>(false); //광고 모달

  //네비게이션 로딩 상태
  const [isNavigationLoading, setNavigationLoading] = useState(false);

  const saveEmotionMutation = useSaveEmotion();
  const saveEmotionWithImageMutation = useSaveEmotionWithImage();

  //홈으로 돌아가는 코드
  const navigateToHome = (isShownAds: boolean) => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: RootStackName.BottomTabNavigator,
          state: {
            routes: [{ name: TabScreenName.Home }],
          },
        },
      ],
    });
  };

  //기본 감정 선택 함수
  const handleStatusUpdate = (emotion) => {
    console.log('handleStatusUpdate called with emotion:', emotion);
    const targetEmotion = emotion.find((e) => e.type === 'custom') || emotion[0];
    console.log('targetEmotion:', targetEmotion);
    const group = targetEmotion?.group || 'normal';
    const statusToUpdate = `${group}-emotion`;
    console.log('statusToUpdate:', statusToUpdate);
    //console.log('updating status to:', statusToUpdate);
    updateEntryStatus(dateID, statusToUpdate);
  };

  // 일기 저장하기 버튼 클릭
  const onPressSaveDiary = async () => {
    const { image, allSelectedEmotions, diaryText } = useEmotionStore.getState();
    if (image.length === 0) {
      console.log('이미지 없음 - 감정만 저장');
      await saveTextOnlyDiary({ dateID, allSelectedEmotions, diaryText });
    } else {
      console.log('이미지 있음 - 이미지 포함 저장');
      await handleImageDiaryFlow({ dateID, image, allSelectedEmotions, diaryText });
    }
  };

  const saveTextOnlyDiary = async ({ dateID, allSelectedEmotions, diaryText }) => {
    try {
      await saveEmotionMutation.mutateAsync({
        dateID,
        emotions: allSelectedEmotions,
        text: diaryText,
      });
      handleStatusUpdate(allSelectedEmotions);
      setTimeout(() => {
        navigateToHome(false);
      }, 3000);
    } catch (e) {
      Toast.show('일기 저장 중 오류가 발생했습니다.');
    }
  };

  const handleImageDiaryFlow = async ({ dateID, image, allSelectedEmotions, diaryText }) => {
    const userPlan = getUserPlan();
    console.log('사용자 플랜:', userPlan);
    try {
      await saveEmotionWithImageMutation.mutateAsync({
        dateID,
        emotions: allSelectedEmotions,
        text: diaryText,
        images: image,
      });
      handleStatusUpdate(allSelectedEmotions);
      console.log('이미지 포함 일기 저장 성공');
      navigateToHome(false);
    } catch (e) {
      Toast.show('일기 저장 중 오류가 발생했습니다.');
    }
  };

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
          <View
            style={css`
              margin-top: ${rsHeight * 12 + 'px'};
            `}>
            <EmotionTitleBox
              iconName="dairy-cookie"
              mainTitle="오늘 하루를 되돌아봐요."
              subTitle="이 감정을 가장 강하게 느낀 순간은 언제인가요?"
            />
          </View>

          {/* 감정 카드 리스트 */}
          <SelectedEmotionChip />
          {/* 사진 선택 창 */}
          <DiaryImageSection />

          {/* 풀스크린 멀티라인 입력창 */}
          <TextInputSection />
        </KeyboardAwareScrollView>

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
      <TierModal
        modalVisible={modalVisible}
        onClose={() => {
          //console.log('모달 꺼짐');
          setModalVisible(false);
        }}
        onSubmit={() => {
          //console.log('모달 확인');
          setModalVisible(false);
        }}
        imageSource={localImage}
        modalContent="사진은 한 장만 등록할 수 있습니다."
      />
      {isNavigationLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          }}>
          <ActivityIndicator size="large" color={palette.primary[500]} />
        </View>
      )}
    </>
  );
};

export default DailyDairy;
