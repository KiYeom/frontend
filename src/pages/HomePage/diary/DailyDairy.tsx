import { css } from '@emotion/native';
import { useHeaderHeight } from '@react-navigation/elements';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  Keyboard,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  ImageSourcePropType,
} from 'react-native';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';
import Icon from '../../../components/icons/icons';
import Toast from 'react-native-root-toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { dailyAnalyze, todayEmotion, todayEmotionWithImage } from '../../../apis/analyze';
import { TabScreenName, RootStackName, HomeStackName } from '../../../constants/Constants';
import EmotionTitleBox from './emotionTitleBox';
import EmotionChip from '../../../components/atoms/EmotionChip/EmotionChip';
import EmotionCard from '../../../components/atoms/EmotionCard/EmotionCard';
import Analytics from '../../../utils/analytics';
import useEmotionStore from '../../../store/emotion-status';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';
import { formatDateKorean } from '../../../utils/times';
import Header from '../../../components/header/header';
import { useCalendarStore } from '../../../store/calendarStore';
import palette from '../../../assets/styles/theme';
import * as ImagePicker from 'expo-image-picker';
import AttachmentPreview from '../../../components/image-container/AttachmentPreview';
import { MAX_DIARY_IMAGE_COUNT } from '../../../constants/Constants';
import TierModal from '../../../components/modals/tier-modal';
import AdsModal from '../../../components/modals/ads-modal';
import { getUserInfo } from '../../../apis/setting';

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
} from '../.././../utils/storageUtils';

// development <-> production 에 따라 정해지는 adUnitId
const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

//한 번 만들어지면 되는 인스턴스
const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  keywords: ['fashion', 'clothing'],
});

const localImage: ImageSourcePropType = require('../../../assets/images/cookie_pic_alarm.png');
const adsImage: ImageSourcePropType = require('../../../assets/images/ads_cookie.png');

const DailyDairy = ({ navigation, route }) => {
  const { dateID } = route.params;
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  // 상태: 텍스트 인풋 높이
  const [inputHeight, setInputHeight] = useState(46); //초기 높이

  const { selectedEmotions, diaryText, setDiaryText } = useEmotionStore();
  const { updateEntryStatus } = useCalendarStore();

  //이미지 가지고 오기
  const [image, setImage] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false); //사진 경고 모달
  const [adsModalVisible, setAdsModalVisible] = useState<boolean>(false); //광고 모달
  const [canSendPhoto, setCanSendPhoto] = useState<boolean>(false); //사진 전송 가능 여부

  //일기장 화면 진입 시 실행되는 useEffect
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    Analytics.watchDiaryWriteScreen();
    //일기 화면 진입 시 광고가 로드되면 loaded 상태를 true로 변경할 콜백 함수를 unsubscribeLoaded 이라는 이름으로 등록해둔다
    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setLoaded(true);
    });
    //광고를 끝까지 봐서 보상을 줄 수 있을 때 일기와 사진을 등록할 수 있는 콜백 함수를 unsubscribeEarned 이라는 이름으로 등록해둔다
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      async (reward) => {
        console.log('User earned reward of ', reward);
        try {
          await todayEmotionWithImage(dateID, selectedEmotions, diaryText, image);
          updateEntryStatus(dateID, selectedEmotions[0]?.group + '-emotion');
          navigation.navigate(RootStackName.BottomTabNavigator, {
            screen: TabScreenName.Home,
          });
          Toast.show('광고 시청 완료! 일기를 기록했어요.', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.CENTER,
          });
        } catch (err) {
          console.log('Error saving diary with image:', err);
          Toast.show('일기 저장 중 오류가 발생했습니다.');
        }
      },
    );

    //광고 로드
    rewarded.load();

    getUserInfo()
      .then((res) => {
        res && setUserPlan(res.userTier); //사용자의 tier 정보를 저장)
      })
      .catch((error) => {
        console.log('getUserInfo error', error);
      });

    // 컴포넌트 언마운트 시 이벤트 리스너 해제
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  const handleContentSizeChange = (event) => {
    const { width, height } = event.nativeEvent.contentSize;
    setInputHeight(height);
  };

  //홈으로 돌아가는 코드
  const navigateToHome = (isShownAds: boolean) => {
    navigation.navigate(RootStackName.BottomTabNavigator, {
      screen: TabScreenName.Home,
    });
    isShownAds &&
      Toast.show(`광고를 시청하고 이미지를 첨부했어요!`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.CENTER,
      });
  };

  //기본 감정 선택 함수
  const handleStatusUpdate = (emotion) => {
    const targetEmotion = emotion.find((e) => e.type === 'custom') || emotion[0];
    const group = targetEmotion?.group || 'normal';
    const statusToUpdate = `${group}-emotion`;
    console.log('updating status to:', statusToUpdate);
    updateEntryStatus(dateID, statusToUpdate);
  };

  // 일기 저장 로직
  const saveDiary = async () => {
    Analytics.clickDiaryWriteButton();
    console.log('클릭');

    if (image.length > 1) {
      console.log('사진은 최대 1장까지 선택할 수 있습니다. error');
      return;
    }

    const handleSaveError = (err) => {
      console.log('일기 저장 중 오류 발생', err);
    };

    try {
      if (image.length === 0) {
        await todayEmotion(dateID, selectedEmotions, diaryText);
        handleStatusUpdate(selectedEmotions);
        navigateToHome(false);
      } else if (getUserPlan() === 'free') {
        setAdsModalVisible(true);
      }
    } catch (err) {
      handleSaveError(err);
    }
  };

  //사진 가져오기 로직
  const pickImage = async () => {
    const userTier = getUserPlan();
    const canSendPhoto = getCanSendPhoto();
    // free 사용자 + 사진 전송 불가 상태라면 → 광고 보기
    if (image.length >= MAX_DIARY_IMAGE_COUNT) {
      setModalVisible(true);
      //Toast.show(`사진은 최대 ${MAX_DIARY_IMAGE_COUNT}장까지 선택할 수 있습니다.`);
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: MAX_DIARY_IMAGE_COUNT,
    });
    console.log(result);
    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setImage((prev) => [...prev, ...uris]); // 기존 이미지에 추가
    }
    return;
  };

  //광고 시청 함수
  const watchAds = () => {
    if (!loaded) {
      Toast.show('광고 로딩중입니다. 잠시 기다려주세요');
    }
    console.log('전면 광고 시청');
    rewarded.show(); // 광고 표시
  };
  if (!loaded) {
    return null;
  }

  return (
    <>
      <View style={{ flex: 1, paddingBottom: insets.bottom }}>
        <Header title={formatDateKorean(dateID)} />

        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive">
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
          {selectedEmotions.length > 0 && (
            <View
              style={css`
                margin-top: ${rsHeight * 12 + 'px'};
                flex-direction: row;
                flex-wrap: wrap;
                gap: ${rsWidth * 6 + 'px'};
                padding-horizontal: ${rsWidth * 24 + 'px'};
              `}>
              {selectedEmotions.map((emotion, i) => (
                <EmotionCard key={i} emotion={emotion} status={'default'} />
              ))}
            </View>
          )}
          {image.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: rsWidth * 24,
                gap: rsWidth * 12,
                marginTop: rsHeight * 12,
              }}>
              {image.map((img, idx) => (
                <AttachmentPreview
                  key={idx}
                  image={img}
                  onDelete={(uriToDelete) =>
                    setImage((prev) => prev.filter((uri) => uri !== uriToDelete))
                  }
                />
              ))}
            </ScrollView>
          )}

          {/* 풀스크린 멀티라인 입력창 */}
          <TextInput
            multiline
            autoFocus
            scrollEnabled={false}
            value={diaryText}
            onChangeText={setDiaryText}
            placeholder="이 감정을 강하게 느낀 순간을 기록해보세요"
            placeholderTextColor="#AAA"
            style={css`
              margin-top: ${rsHeight * 12 + 'px'};
              margin-horizontal: ${rsWidth * 24 + 'px'};
              border-radius: 10px;
              //background-color: #f5f5f5;
              font-size: ${rsFont * 16 + 'px'};
              line-height: ${rsFont * 16 * 1.5 + 'px'};
              padding: ${rsHeight * 12 + 'px'} ${rsWidth * 12 + 'px'};
              text-align-vertical: top;
              font-family: Kyobo-handwriting;
              align-self: flex-start;
              height: ${inputHeight}px;
              padding-bottom: ${rsHeight * 50 + 'px'};
            `}
            onContentSizeChange={handleContentSizeChange}
          />
        </KeyboardAwareScrollView>

        <KeyboardStickyView offset={{ closed: 0, opened: insets.bottom }}>
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
              onPress={pickImage}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
              <Icon name="picture-icon" width={20} color={palette.neutral[400]} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={saveDiary}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
              <Icon name="check-icon" width={24} color={palette.neutral[400]} />
            </TouchableOpacity>
          </View>
        </KeyboardStickyView>
      </View>
      <TierModal
        modalVisible={modalVisible}
        onClose={() => {
          console.log('모달 꺼짐');
          setModalVisible(false);
        }}
        onSubmit={() => {
          console.log('모달 확인');
          setModalVisible(false);
        }}
        imageSource={localImage}
        modalContent="사진은 한 장만 등록할 수 있습니다."
      />
      <AdsModal
        modalVisible={adsModalVisible}
        onClose={() => {
          console.log('모달 꺼짐');
          setAdsModalVisible(false);
        }}
        onSubmit={async () => {
          console.log('광고 보기 버튼을 클릭 클릭');
          if (!loaded) {
            Toast.show('광고 로딩중입니다. 잠시 기다려주세요');
            rewarded.load();
            return;
          }
          watchAds(); //광고가 로드된 상태에서 광고 보여주기
          //await todayEmotionWithImage(dateID, selectedEmotions, diaryText, image);
          //handleStatusUpdate(selectedEmotions);
          //navigateToHome(true);
        }}
        imageSource={adsImage}
        modalContent={`광고를 시청하면\n일기에 사진을 첨부할 수 있어요!`}
      />
    </>
  );
};

export default DailyDairy;
