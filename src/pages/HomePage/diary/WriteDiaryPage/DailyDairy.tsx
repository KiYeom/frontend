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
import { updateSendPhotoPermission } from '../../../../apis/chatting';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
  InterstitialAd,
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';
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
const userName = getUserNickname() ?? 'Test_remind_empty';
const appVariant = Constants.expoConfig?.extra?.appVariant;
const isProductionOrStaging = appVariant === 'production' || appVariant === 'staging';
const isTestUser = userName === 'Test_remind';
const adUnitId =
  isProductionOrStaging && !isTestUser
    ? Platform.OS === 'android'
      ? process.env.EXPO_PUBLIC_REWARED_AD_UNIT_ID_ANDROID
      : process.env.EXPO_PUBLIC_REWARED_AD_UNIT_ID_IOS
    : TestIds.REWARDED;

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
  const [adsModalVisible, setAdsModalVisible] = useState<boolean>(false); //광고 모달

  //네비게이션 로딩 상태
  const [isNavigationLoading, setNavigationLoading] = useState(false);

  const saveEmotionMutation = useSaveEmotion();
  const saveEmotionWithImageMutation = useSaveEmotionWithImage();

  /*const rewarded = useMemo(
    () =>
      RewardedAd.createForAdRequest(adUnitId, {
        keywords: ['fashion', 'clothing'],
      }),
    [],
  );*/

  //const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    console.log('DailyDairy useEffect 실행 : getUserInfo');
    //listenerCount++;
    //console.log(`리스너 등록 시작 : 현재 총 ${listenerCount}번 등록됨`);
    Analytics.watchDiaryWriteScreen();
    getUserInfo()
      .then((res) => {
        res && setUserPlan(res.userTier); //사용자의 tier 정보를 저장)
      })
      .catch((error) => {
        //console.log('getUserInfo error', error);
      });
    //광고 이벤트
    /*const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setLoaded(true);
    });
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      async (reward) => {
        console.log('User earned reward of ', reward);
        setUserPlan('pro');
        await onPressSaveDiary();
      },
    );
    const unsubscribeClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('Ad was closed');
      setAdsModalVisible(false);
      setNavigationLoading(true); // 네비게이션 로딩 시작
      // 짧은 지연 후 네비게이션 - 로딩 표시가 보이도록
      setTimeout(() => {
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
        Toast.show('광고 시청 완료! 일기를 기록했어요.', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.CENTER,
        });
        // 네비게이션 후 로딩 상태 해제
        setNavigationLoading(false);
      }, 1000); // 1초 지연
    });

    // Start loading the rewarded ad straight away
    rewarded.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
    };*/
  }, []);

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
    isShownAds &&
      Toast.show(`광고를 시청하고 이미지를 첨부했어요!`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.CENTER,
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

    if (userPlan === 'free') {
      setAdsModalVisible(true); // 광고 보기 유도
    } else {
      try {
        await saveEmotionWithImageMutation.mutateAsync({
          dateID,
          emotions: allSelectedEmotions,
          text: diaryText,
          images: image,
        });
        handleStatusUpdate(allSelectedEmotions);
        console.log('유료 사용자 - 이미지 포함 일기 저장 성공');
      } catch (e) {
        Toast.show('일기 저장 중 오류가 발생했습니다.');
      }
    }
  };

  //광고 보기 모달에서 저장하기 버튼 클릭
  /*const onConfirmWatchAd = () => {
    console.log('광고 보기 버튼 클릭');
    Analytics.clickWatchAdsButton(); // 클릭 이벤트 트래킹
    if (!loaded) {
      Toast.show('광고를 불러오는 중입니다. 잠시만 기다려주세요.');
      rewarded.load(); // 다시 로드 시도
      return;
    }
    rewarded.show(); // 광고 표시
  };

  if (!loaded) {
    console.log('no advert ready to show yet');
    return null;
  }*/

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
      {/*<AdsModal
        modalVisible={adsModalVisible}
        onClose={() => {
          Analytics.clickNoWatchAdsButton();
          setAdsModalVisible(false);
        }}
        onSubmit={() => {
          Analytics.clickWatchAdsButton();
          console.log('광고 보기 버튼 클릭');
          onConfirmWatchAd();
        }}
        imageSource={adsImage}
        modalContent={
          TestIds.REWARDED === adUnitId
            ? `광고를 시청하면\n일기에 사진을 첨부할 수 있어요 :)`
            : `광고를 시청하면\n일기에 사진을 첨부할 수 있어요!`
        }
      />*/}
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
