import { css } from '@emotion/native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import {
  Keyboard,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  ImageSourcePropType,
  Alert,
  Linking,
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
import { ActivityIndicator, StyleSheet } from 'react-native';
import config from '../../../utils/config';
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

const ANDROID_AD_UNIT_ID = process.env.EXPO_PUBLIC_ADMOB_ID_ANDROID;
const IOS_AD_UNIT_ID = process.env.EXPO_PUBLIC_ADMOB_ID_IOS;
// development <-> production 에 따라 정해지는 adUnitId

const adUnitId = config.getAdUnitId(ANDROID_AD_UNIT_ID, IOS_AD_UNIT_ID);
//console.log('adUnitId:', adUnitId);
//리스너 중복 등록 확인
//let listenerCount = 0;

const localImage: ImageSourcePropType = require('../../../assets/images/cookie_pic_alarm.png');
const adsImage: ImageSourcePropType = require('../../../assets/images/ads_cookie.png');

const DailyDairy = ({ navigation, route }) => {
  const { dateID } = route.params;
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  // 상태: 텍스트 인풋 높이
  const [inputHeight, setInputHeight] = useState(46); //초기 높이

  const { selectedEmotions, diaryText, setDiaryText, setImages, images } = useEmotionStore();
  const { updateEntryStatus } = useCalendarStore();

  //이미지 가지고 오기
  //const [image, setImage] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false); //사진 경고 모달
  const [adsModalVisible, setAdsModalVisible] = useState<boolean>(false); //광고 모달
  const imageRef = useRef<string[]>(images);
  const diaryTextRef = useRef<string>(diaryText);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  //네비게이션 로딩 상태
  const [isNavigationLoading, setNavigationLoading] = useState(false);
  const [textInputContainerHeight, setTextInputContainerHeight] = useState(200);
  const minInputHeight = 200;

  const lastContentSizeChange = useRef(Date.now());
  const throttleDelay = 100; // 100ms throttle

  const rewarded = useMemo(
    () =>
      RewardedAd.createForAdRequest(adUnitId, {
        keywords: ['fashion', 'clothing'],
      }),
    [],
  );
  // Keyboard event listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  //일기장 화면 진입 시 실행되는 useEffect
  const [loaded, setLoaded] = useState(false);
  useFocusEffect(
    useCallback(() => {
      const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
        //console.log('광고 로드');
        setLoaded(true);
      });
      //광고를 끝까지 봐서 보상을 줄 수 있을 때 일기와 사진을 등록할 수 있는 콜백 함수를 unsubscribeEarned 이라는 이름으로 등록해둔다
      const unsubscribeEarned = rewarded.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        async (reward) => {
          //console.log('User earned reward of ', reward, diaryText);
          try {
            await todayEmotionWithImage(
              dateID,
              selectedEmotions,
              diaryTextRef.current,
              imageRef.current,
            );
            updateEntryStatus(dateID, selectedEmotions[0]?.group + '-emotion');

            //setAdsModalVisible(false);
          } catch (err) {
            //console.log('Error saving diary with image:', err);
            Toast.show('일기 저장 중 오류가 발생했습니다.');
          }
        },
      );
      //광고가 닫힐 때 실행되는 이벤트 리스터
      const unsubscribeClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
        //console.log('Ad was cloesed');
        setAdsModalVisible(false);
        setNavigationLoading(true); //네비게이션 로딩

        // 짧은 지연 후 네비게이션 - 로딩 표시가 보이도록
        setTimeout(() => {
          navigation.navigate(RootStackName.BottomTabNavigator, {
            screen: TabScreenName.Home,
          });
          Toast.show('광고 시청 완료! 일기를 기록했어요.', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.CENTER,
          });
          // 네비게이션 후 로딩 상태 해제
          setNavigationLoading(false);
        }, 1000); // 0.5초 지연
      });
      //광고 로드
      rewarded.load();
      // 컴포넌트 언마운트 시 이벤트 리스너 해제
      return () => {
        //console.log('컴포넌트 언마운트 시 이벤트 리스너 해제');
        //listenerCount--;
        unsubscribeLoaded();
        unsubscribeEarned();
        unsubscribeClosed();
        setNavigationLoading(false);
        //console.log(`리스너 해제됨 : 현재 ${listenerCount}번 등록됨`);
      };
    }, [rewarded, navigation]),
  );

  //사진 접근 권한
  const getPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      //console.log('사진 접근 권한:', status); //사진 접근 권한 버튼 누른 뒤에 실행됨
      if (status !== 'granted') {
        Alert.alert(
          '사진 접근 권한이 필요합니다',
          '사진 업로드를 위해 앱 설정에서 사진 접근 권한을 허용해주세요.',
          [
            { text: '취소', style: 'cancel' },
            {
              text: '설정',
              onPress: () => {
                // iOS, Android 둘 다 앱 설정 화면으로 이동
                Linking.openSettings();
              },
            },
          ],
          { cancelable: true },
        );

        return false;
      }
      return true;
    }
  };

  useEffect(() => {
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
  }, []);

  //image 상태가 변경될 때마다 ref 업데이트
  useEffect(() => {
    imageRef.current = images;
  }, [images]);
  //텍스트 값이 바뀔 때마다 ref 업데이트
  useEffect(() => {
    diaryTextRef.current = diaryText;
  }, [diaryText]);

  const handleContentSizeChange = (event) => {
    const now = Date.now();
    if (now - lastContentSizeChange.current > throttleDelay) {
      lastContentSizeChange.current = now;
      // Only update if there's a significant change (more than 20px)
      const newHeight = event.nativeEvent.contentSize.height;
      if (Math.abs(newHeight - textInputContainerHeight) > 20) {
        setTextInputContainerHeight(Math.max(minInputHeight, newHeight));
      }
    }
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
    //console.log('updating status to:', statusToUpdate);
    updateEntryStatus(dateID, statusToUpdate);
  };

  // 일기 저장 로직
  const saveDiary = async () => {
    Analytics.clickDiaryWriteButton();
    //console.log('클릭');

    if (images.length > 1) {
      //console.log('사진은 최대 1장까지 선택할 수 있습니다. error');
      return;
    }

    const handleSaveError = (err) => {
      //console.log('일기 저장 중 오류 발생', err);
    };

    try {
      if (images.length === 0) {
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
    const permission = await getPermission();
    //console.log('사진 접근 권한:', permission);
    if (!permission) {
      //console.log('사진 접근 권한 없음');
      return;
    }
    if (images.length >= MAX_DIARY_IMAGE_COUNT) {
      setModalVisible(true);
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.5,
      allowsMultipleSelection: false,
    });
    //console.log(result);
    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      //setImage((prev) => [...prev, ...uris]); // 기존 이미지에 추가
      setImages((prev) => [...prev, ...uris]);
    }
    return;
  };

  //광고 시청 함수
  const watchAds = async () => {
    try {
      if (!loaded) {
        Toast.show('광고 로딩중입니다. 잠시 기다려주세요');
        rewarded.load();
        return;
      }
      //console.log('전면 광고 시청');
      //setAdsModalVisible(false);
      await rewarded.show(); // 광고 표시
    } catch (error) {
      //console.error('Error showing ad:', error);
      Toast.show('광고 표시 중 오류가 발생했습니다');
      setLoaded(false);
      rewarded.load(); // Try to load again
    }
  };
  /*if (!loaded) {
    console.log('null');
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
          {images.length > 0 && (
            <View
              style={{
                height: 120,
                backgroundColor: 'gray',
                justifyContent: 'center',
              }}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ height: rsHeight * 100 }}
                contentContainerStyle={{
                  paddingHorizontal: rsWidth * 24,
                  gap: rsWidth * 12,
                  marginTop: rsHeight * 10,
                }}>
                {images.map((img, idx) => (
                  <AttachmentPreview
                    key={idx}
                    image={img}
                    onDelete={(uriToDelete) =>
                      setImages((prev) => prev.filter((uri) => uri !== uriToDelete))
                    }
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* 풀스크린 멀티라인 입력창 */}
          <View
            style={{
              backgroundColor: 'blue',
              flex: 1,
              marginHorizontal: rsWidth * 24,
              marginTop: rsHeight * 6,
              minHeight: textInputContainerHeight,
              padding: 10,
            }}>
            <TextInput
              multiline
              autoFocus
              scrollEnabled={true}
              value={diaryText}
              onChangeText={setDiaryText}
              placeholder="이 감정을 강하게 느낀 순간을 기록해보세요"
              placeholderTextColor="#AAA"
              style={{
                backgroundColor: 'red',
                flex: 1,
                fontSize: rsFont * 16,
                lineHeight: rsFont * 16 * 1.5,
                padding: rsHeight * 12,
                paddingHorizontal: 0,
                textAlignVertical: 'top',
                fontFamily: 'Kyobo-handwriting',
                width: '100%',
              }}
              onContentSizeChange={handleContentSizeChange}
            />
          </View>
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
      <AdsModal
        modalVisible={adsModalVisible}
        onClose={() => {
          //console.log('모달 꺼짐', diaryText);
          setAdsModalVisible(false);
        }}
        onSubmit={async () => {
          //console.log('광고 보기 버튼을 클릭', loaded);
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
