import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import {
  Dimensions,
  Platform,
  View,
  ActivityIndicator,
  Text, // Text는 현재 사용되지 않으므로 제거 고려
  Keyboard,
  Animated,
  ImageSourcePropType,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GiftedChat, IMessage, SendProps } from 'react-native-gifted-chat';
import { useFocusEffect } from '@react-navigation/native';

// Constants에서 필요한 것만 임포트
import { HomeStackName, RootStackName, TabScreenName } from '../../../constants/Constants';
import * as NavigationBar from 'expo-navigation-bar';
import {
  addRefreshChat,
  getIsDemo,
  getRefreshChat,
  getUserNickname,
  setIsScoreDemo,
} from '../../../utils/storageUtils';
import Analytics from '../../../utils/analytics';
import { rsFont, rsWidth } from '../../../utils/responsive-size';
import { updateSendPhotoPermission, searchChatWord } from '../../../apis/chatting';
import * as ImagePicker from 'expo-image-picker';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-root-toast';

// 기존 chat-render 파일에서 필요한 것만 임포트
import {
  RenderAvatar,
  RenderBubble,
  RenderDay,
  RenderFooter,
  RenderInputToolbar,
  RenderLoading,
  RenderSystemMessage,
  RenderTime,
} from './chat-render';
import { css } from '@emotion/native';
import { useRiskStoreVer2 } from '../../../store/useRiskStoreVer2';
import ChatHeader from '../../../components/chatHeader/chatHeader';
import { ExtendedIMessage } from '../../../utils/chatting';
import AdsModal from '../../../components/modals/ads-modal';
import {
  RewardedAd,
  AdEventType,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import Constants from 'expo-constants';
import { getUserInfo } from '../../../apis/setting';

// 새로 만든 useChatMessages 훅 임포트
import { useChatMessages } from '../../../hooks/useChatMessages';

// 광고 ID 관련 설정 (기존과 동일하게 유지)
const userName = getUserNickname() ?? 'Test_remind_empty';
const appVariant = Constants.expoConfig?.extra?.appVariant;
const isProductionOrStaging = appVariant === 'production' || appVariant === 'staging';
const isTestUser = userName === 'Test_remind';
const adUnitId =
  isProductionOrStaging && !isTestUser
    ? Platform.OS === 'android'
      ? process.env.EXPO_PUBLIC_CHATTING_REWARD_AD_UNIT_ID_ANDROID
      : process.env.EXPO_PUBLIC_CHATTING_REWARD_AD_UNIT_ID_IOS
    : TestIds.REWARDED;

const adsImage: ImageSourcePropType = require('../../../assets/images/ads_cookie.png');

// NewChat 컴포넌트 시작
const NewChat: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [init, setInit] = useState<boolean>(false);
  const [screenLoading, setScreenLoading] = useState<boolean>(false);
  const [refreshTimerMS, setRefreshTimerMS] = useState<number>(500);

  // 반말 모드 정보를 useChatMessages 훅에 전달하기 위한 ref
  const informalModeRef = useRef<boolean>(true);

  // useChatMessages 훅에서 필요한 상태와 함수들을 가져옵니다.
  const {
    messages,
    setMessages, // 검색 하이라이트를 위해 필요한 setMessages
    sending,
    buffer,
    image,
    setBuffer,
    setImage,
    onSend,
    loadInitialMessages,
    toggleFavorite,
  } = useChatMessages({
    informalMode: informalModeRef.current,
    onShowAdsModal: () => setModalVisible(true), // 광고 모달을 띄우는 함수 전달
  });

  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 검색 관련 상태 (현재는 NewChat.tsx에 유지)
  const nowCursor = useRef<string | null | undefined>(undefined);
  const prevCursor = useRef<string | null | undefined>(undefined);
  const [searchWord, setSearchWord] = useState<string>('');
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
  const [enableUp, setEnableUp] = useState<boolean>(false);
  const [enableDown, setEnableDown] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

  // 광고 모달 상태
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const handleModalClose = useCallback((type: 'cancel' | 'submit') => {
    if (type === 'cancel') {
      Analytics.clickNoWatchAdsButtonInChatting();
    } else if (type === 'submit') {
      Analytics.clickWatchAdsButtonInChatting();
    }
    setModalVisible(false);
  }, []);

  // TextInput을 가리키는 ref
  const textInputRef = useRef<TextInput>(null);

  // 사진 첨부 로직 (다음 단계에서 useImagePicker 훅으로 분리 예정)
  const pickImage = useCallback(async () => {
    if (image) {
      // image는 useChatMessages 훅에서 가져온 상태 변수
      Toast.show('이미지는 한 장만 보낼 수 있어요', { duration: Toast.durations.SHORT });
      Analytics.clickIamgePreviewAddButton();
      return;
    }
    try {
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (newStatus !== 'granted') {
          Toast.show('사진 접근 권한이 필요합니다', { duration: Toast.durations.LONG });
          return;
        }
      }
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri); // setImage는 useChatMessages 훅에서 가져온 함수
        Analytics.clickImagePickerConfirmButton();
      } else {
        Analytics.clickImagePickerCancelButton();
      }
    } catch (error: any) {
      console.error('이미지 선택 중 오류 발생:', error);
      Toast.show('이미지 선택 중 오류가 발생했습니다', { duration: Toast.durations.SHORT });
      Analytics.clickImagePickerErrorButton(error.message, error.code);
    }
  }, [image, setImage]);

  // 입력 필드 높이 (InputToolbar에서 사용)
  const [inputHeight, setInputHeight] = useState(rsFont * 16 * 1.5 + 15 * 2);

  // 키보드 높이 관련
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const onKeyboardDidShow = useCallback((event: any) => {
    setKeyboardHeight(event.endCoordinates.height);
  }, []);

  const onKeyboardDidHide = useCallback(() => {
    setKeyboardHeight(0);
  }, []);

  // Google Mobile Ads 관련 로직 (다음 단계에서 useRewardedAd 훅으로 분리 예정)
  const rewarded = useMemo(
    () =>
      RewardedAd.createForAdRequest(adUnitId, {
        keywords: ['fashion', 'clothing'],
      }),
    [],
  );

  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const loadAd = useCallback(() => {
    if (loading || loaded) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      rewarded.load();
    } catch (err: any) {
      console.error('광고 로드 호출 실패:', err);
      setLoading(false);
      setError(err);
    }
  }, [loading, loaded, rewarded]);

  useEffect(() => {
    let mounted = true;

    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      if (mounted) {
        setLoaded(true);
        setLoading(false);
        setError(null);
      }
    });

    const unsubscribeFailedToLoad = rewarded.addAdEventListener(AdEventType.ERROR, (err) => {
      if (mounted) {
        console.error('❌ 광고 로드 실패:', err);
        setLoaded(false);
        setLoading(false);
        setError(err);
        Analytics.watchNoEarnRewardScreenInChatting({
          errorCode: err.code,
          errorMessage: err.message,
          errorDomain: err.domain,
          adUnitId: adUnitId,
          isTestMode: adUnitId === TestIds.REWARDED,
        });
        setTimeout(() => {
          if (mounted) {
            loadAd();
          }
        }, 5000);
      }
    });

    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      async (reward) => {
        if (mounted) {
          Analytics.watchEarnRewardScreenInChatting();
          try {
            const res = await updateSendPhotoPermission(true);
            if (res?.canSendPhoto) {
              setModalVisible(false);
              if (textInputRef.current) {
                textInputRef.current.clear();
              }
              // 광고 시청 성공 후, setBuffer와 setImage를 null로 설정하여
              // useChatMessages 훅 내부에서 메시지 전송 로직이 트리거되도록 유도
              setBuffer(null);
              setImage(null);
            }
          } catch (err: any) {
            console.error('권한 업데이트 실패:', err);
            Analytics.photoPermissionError(err);
            Toast.show('오류가 발생했습니다. 다시 시도해주세요', {
              duration: Toast.durations.SHORT,
              position: Toast.positions.CENTER,
            });
          }
          loadAd();
          setModalVisible(false);
        }
      },
    );

    const unsubscribeClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      if (mounted) {
        loadAd();
      }
    });

    loadAd();
    return () => {
      mounted = false;
      unsubscribeLoaded();
      unsubscribeFailedToLoad();
      unsubscribeEarned();
      unsubscribeClosed();
    };
  }, [rewarded, loadAd, setBuffer, setImage]);

  const watchAds = useCallback(async () => {
    try {
      if (!loaded) {
        if (!loading) {
          Toast.show('광고를 불러오는 중입니다...', { duration: Toast.durations.SHORT });
          loadAd();
        }
        const loadSuccess = await new Promise<boolean>((resolve) => {
          let attempts = 0;
          const maxAttempts = 20;
          const checkInterval = setInterval(() => {
            attempts++;
            if (loaded) {
              clearInterval(checkInterval);
              resolve(true);
            } else if (attempts >= maxAttempts || error) {
              clearInterval(checkInterval);
              resolve(false);
            }
          }, 500);
        });

        if (!loadSuccess) {
          Toast.show('광고를 불러올 수 없습니다. 잠시 후에 다시 시도해주세요😢', {
            duration: Toast.durations.LONG,
          });
          Analytics.adLoadTimeoutInChatting();
          return false;
        }
      }

      return new Promise<boolean>((resolve) => {
        let adClosed = false;
        let rewardEarned = false;

        const tempClosedListener = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
          adClosed = true;
          if (!rewardEarned) {
            Toast.show('광고를 끝까지 시청해야 보상을 받을 수 있습니다', {
              duration: Toast.durations.LONG,
            });
            setLoaded(false);
            loadAd();
            resolve(false);
          }
          tempClosedListener();
          tempEarnedListener();
        });

        const tempEarnedListener = rewarded.addAdEventListener(
          RewardedAdEventType.EARNED_REWARD,
          (reward) => {
            rewardEarned = true;
            setLoaded(false);
            resolve(true);
            tempClosedListener();
            tempEarnedListener();
          },
        );

        rewarded.show().catch((showError: any) => {
          console.error('❌ 광고 표시 실패:', showError);
          Analytics.clickWatchAdsErrorInChatting({
            errorCode: showError.code || 'unknown',
            errorMessage: showError.message || '광고 표시 실패',
            stage: 'show',
          });
          setLoaded(false);
          loadAd();
          resolve(false);
        });
      });
    } catch (err: any) {
      console.error('❌ 광고 시청 오류:', err);
      Toast.show('광고 표시 중 오류가 발생했습니다', { duration: Toast.durations.SHORT });
      Analytics.clickWatchAdsErrorInChatting({
        errorCode: err.code || 'unknown',
        errorMessage: err.message || '알 수 없는 오류',
        stage: 'show',
      });
      setLoaded(false);
      loadAd();
      return false;
    }
  }, [loaded, loading, error, rewarded, loadAd]);

  // Risk Store v2 사용
  const { riskStatusV2, setRiskScoreV2 } = useRiskStoreVer2();

  const decideRefreshScreen = useCallback((viewHeight: number) => {
    NavigationBar.getVisibilityAsync().then((navBarStatus) => {
      if (navBarStatus === 'visible') {
        const screenHeight = Dimensions.get('screen').height;
        if (
          screenHeight - 2 < viewHeight &&
          viewHeight < screenHeight + 2 &&
          getRefreshChat() <= 2
        ) {
          addRefreshChat(1);
          // navigation.replace(HomeStackName.NewChatRefresh); // 필요하면 유지
        }
      }
      setScreenLoading(false);
    });
  }, []);

  // 검색어 하이라이트 함수 (setMessages를 의존성으로 추가)
  const updateMessageHighlights = useCallback(
    (keyword: string) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.text.includes(keyword)
            ? { ...msg, hightlightKeyword: keyword }
            : { ...msg, hightlightKeyword: '' },
        ),
      );
    },
    [setMessages],
  );

  // 메시지 ID로부터 메시지 인덱스를 찾아 스크롤하는 함수 (messages 의존성 추가)
  const scrollToMessageById = useCallback(
    (messageId: string | number) => {
      const index = messages.findIndex((message) => message._id === messageId);
      if (index === -1) {
        return;
      }
      try {
        setTimeout(() => {
          messageContainerRef.current?.scrollToIndex({
            index,
            animated: true,
            viewOffset: 0,
            viewPosition: 0,
          });
        }, 150);
      } catch (error) {
        console.error('렌더링이 되지 않아 스크롤 실패', error);
      }
    },
    [messages],
  );

  // 키워드를 검색하여 id값을 반환해주는 함수 (messages, setMessages, updateMessageHighlights 의존성 추가)
  const handleSearch = useCallback(
    async (text: string, direction: null | 'up' | 'down'): Promise<string | null> => {
      setSearchLoading(true);

      // 스크롤 함수가 없거나 더 이상 검색 결과가 없을 경우
      if (!scrollToMessageById || (nowCursor.current === null && prevCursor.current === null)) {
        Toast.show(`검색 결과가 없습니다`, { duration: Toast.durations.SHORT });
        setSearchLoading(false);
        nowCursor.current = undefined;
        return null;
      }

      let res: any;

      if (direction === 'up' || direction === null) {
        const apiCursor: string | null = nowCursor.current === undefined ? null : nowCursor.current;
        res = await searchChatWord(text, apiCursor, direction);
      } else if (direction === 'down') {
        const apiCursor: string | null = prevCursor.current;
        res = await searchChatWord(text, apiCursor, direction);
      }

      prevCursor.current = nowCursor.current;
      nowCursor.current = res?.nextCursor ?? null;
      setSearchLoading(false);

      if (res?.nextCursor) {
        scrollToMessageById(res.nextCursor);
        updateMessageHighlights(text);
        if (direction === 'up' || direction === null) {
          if (prevCursor.current === undefined || prevCursor.current === null) {
            setEnableUp(true);
            setEnableDown(false);
          } else {
            setEnableUp(true);
            setEnableDown(true);
          }
        } else if (direction === 'down') {
          setEnableUp(true);
          setEnableDown(false);
        }
      } else {
        updateMessageHighlights('');
        if (direction === 'up') {
          setEnableDown(true);
          setEnableUp(false);
          Toast.show(`더 이상 검색 결과가 존재하지 않습니다`, { duration: Toast.durations.SHORT });
        } else {
          setEnableUp(false);
          setEnableDown(false);
          Toast.show(`검색 결과가 없습니다`, { duration: Toast.durations.SHORT });
          prevCursor.current = undefined;
          nowCursor.current = undefined;
        }
      }
      return res?.nextCursor;
    },
    [messages, setMessages, updateMessageHighlights, scrollToMessageById],
  );

  // `onScrollToIndexFailed`는 GiftedChat의 `listViewProps`에 직접 전달
  const scrollToIndexFailed = useCallback((info: any) => {
    setSearchLoading(true);
    const offset = info.averageItemLength * info.index * 2;
    const flatList = messageContainerRef.current;
    flatList?.scrollToOffset({ offset: offset });
    setTimeout(() => {
      flatList?.scrollToIndex({ index: info.index, animated: true });
    }, 50);
  }, []);

  // getUserInfo 호출 및 loadInitialMessages 연동
  useEffect(() => {
    getUserInfo()
      .then((res) => {
        if (res) {
          informalModeRef.current = res.isInFormal;
        } else {
          informalModeRef.current = false;
        }
        setInit(true); // 로딩 시작
        loadInitialMessages() // useChatMessages 훅의 loadInitialMessages 호출
          .then(() => setInit(false)) // 로딩 완료
          .catch((err) => {
            alert('대화 내역을 불러오는 중 오류가 발생했어요. 다시 시도해주세요.');
            console.error(err);
            navigation.navigate(TabScreenName.Home);
          });
      })
      .catch((error) => {
        informalModeRef.current = false; // 에러 시에도 기본값 설정
        setInit(true); // 로딩 시작
        loadInitialMessages() // 에러 시에도 초기 메시지 로드 시도
          .then(() => setInit(false)) // 로딩 완료
          .catch((err) => {
            alert('대화 내역을 불러오는 중 오류가 발생했어요. 다시 시도해주세요.');
            console.error(err);
            navigation.navigate(TabScreenName.Home);
          });
      });
  }, [navigation, loadInitialMessages]);

  // useFocusEffect: 화면 포커스 시 채팅 새로고침 로직
  useFocusEffect(
    useCallback(() => {
      if (getRefreshChat() > 0) {
        //setRefreshChat(0); // refreshChat 상태를 초기화
        setInit(true);
        loadInitialMessages()
          .then(() => setInit(false))
          .catch((err) => {
            console.error('대화 내역을 불러오는 중 오류가 발생했어요. 다시 시도해주세요.', err);
            navigation.navigate(TabScreenName.Home);
          });
      }
    }, [navigation, loadInitialMessages]),
  );

  const showToast = useCallback(() => {
    Toast.show('메시지가 복사되었습니다.', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.CENTER,
    });
  }, []);

  // navigation focus 시 risk score 업데이트 로직
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // setRiskScoreV2가 함수라면 호출 형태가 되어야 함
      // setRiskScoreV2(); // 이전에 어떤 로직을 수행했는지 확인 필요
      // 현재는 단순히 `setRiskScoreV2`를 참조하고 있으므로, 목적에 맞게 수정해야 합니다.
    });
    return () => {
      unsubscribe();
    };
  }, [navigation]);

  const messageContainerRef = useRef<React.ElementRef<typeof GiftedChat>>(null);

  /* 채팅 화면 전체 구성 */
  return (
    <SafeAreaView
      style={{ flex: 1 }}
      edges={['bottom']}
      onLayout={(event) => {
        if (Platform.OS === 'android') {
          const { height } = event.nativeEvent.layout;
          resetRefreshTimer(height, refreshTimerMS);
          setRefreshTimerMS(refreshTimerMS / 2);
        } else {
          setScreenLoading(false);
        }
      }}>
      {(screenLoading || init) && (
        <View
          style={css`
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10;
            pointer-events: none;
            background-color: #ffffff;
          `}>
          <RenderLoading />
        </View>
      )}

      <ChatHeader
        isSearchMode={isSearchMode}
        setIsSearchMode={setIsSearchMode}
        riskStatusV2={riskStatusV2}
        isEvent={true}
        isRight={true}
        isLeft={true}
        leftFunction={() => {
          navigation.popToTop();
          navigation.navigate(RootStackName.BottomTabNavigator, {
            screen: TabScreenName.Home,
          });
          Analytics.clickHeaderBackButton();
        }}
        rightFunction={() => {
          if (!isSearchMode) {
            navigation.openDrawer();
            Analytics.clickHeaderSideMenuButton();
          }
        }}
        eventFunction={() => {
          Analytics.clickHeaderSearchButton();
          setIsSearchMode((prev) => !prev);
        }}
        scrollToMessageById={scrollToMessageById}
        searchWord={searchWord}
        setSearchWord={setSearchWord}
        handleSearch={handleSearch}
        updateMessageHighlights={updateMessageHighlights}
      />

      <GiftedChat
        listViewProps={{
          onScrollToIndexFailed: scrollToIndexFailed,
          onMomentumScrollEnd: () => {
            setSearchLoading(false);
          },
        }}
        messageContainerRef={messageContainerRef}
        messages={messages}
        onSend={onSend} // useChatMessages 훅의 onSend 함수 사용
        user={{ _id: 0, name: '나' }} // useChatMessages 훅의 userObject와 동일
        onInputTextChanged={(text) => {
          setBuffer(text); // useChatMessages 훅의 setBuffer 함수 사용
        }}
        renderAvatar={RenderAvatar}
        showAvatarForEveryMessage
        renderAvatarOnTop
        onPressAvatar={() => {
          navigation.navigate(HomeStackName.Profile);
        }}
        onLongPressAvatar={() => {
          if (getIsDemo()) setIsScoreDemo(true);
        }}
        renderBubble={(props) => <RenderBubble {...props} onFavoritePress={toggleFavorite} />} // useChatMessages 훅의 toggleFavorite 함수 사용
        onLongPress={(context, message: IMessage) => {
          Clipboard.setStringAsync(message.text).then(() => {
            showToast();
          });
        }}
        renderFooter={() => RenderFooter(sending)} // useChatMessages 훅의 sending 상태 사용
        renderTime={RenderTime}
        renderDay={RenderDay}
        renderSystemMessage={RenderSystemMessage}
        renderInputToolbar={(sendProps: SendProps<ExtendedIMessage>) =>
          RenderInputToolbar(
            sendProps,
            sending, // useChatMessages 훅의 sending 상태 사용
            isSearchMode,
            enableUp,
            enableDown,
            setEnableUp,
            setEnableDown,
            handleSearch,
            searchWord,
            pickImage, // NewChat.tsx에 남아있는 함수
            setInputHeight,
            image, // useChatMessages 훅의 image 상태 사용
            setImage, // useChatMessages 훅의 setImage 함수 사용
            textInputRef,
          )
        }
        lightboxProps={undefined}
        textInputProps={{
          placeholder: getIsDemo() ? '메시지 입력.' : '메시지 입력',
          marginLeft: rsWidth * 15,
        }}
        keyboardShouldPersistTaps={'never'}
        alwaysShowSend
      />
      {searchLoading && (
        <View
          style={css`
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            justify-content: center;
            align-items: center;
            z-index: 999;
          `}>
          <ActivityIndicator />
        </View>
      )}
      <Animated.View
        style={css`
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          align-items: center;
          justify-content: center;
          z-index: 100;
          pointer-events: box-none;
        `}
        pointerEvents="box-none"></Animated.View>
      <AdsModal
        modalVisible={modalVisible}
        onClose={handleModalClose}
        onSubmit={async () => {
          Analytics.clickWatchAdsButtonInChatting();
          const adSuccess = await watchAds();
          if (!adSuccess) {
            return;
          }
          // 광고 시청 성공 후, setBuffer와 setImage를 null로 설정하여
          // useChatMessages 훅 내부에서 메시지 전송 로직이 트리거되도록 유도
          setBuffer(null);
          setImage(null);
        }}
        imageSource={adsImage}
        modalContent={
          TestIds.REWARDED === adUnitId
            ? `광고를 시청하면\n쿠키에게 사진을 보여줄 수 있어요 :)`
            : `광고를 시청하면\n쿠키에게 사진을 보여줄 수 있어요`
        }
      />
    </SafeAreaView>
  );
};

export default NewChat;
