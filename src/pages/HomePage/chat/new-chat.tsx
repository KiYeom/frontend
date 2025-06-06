import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import {
  Dimensions,
  Platform,
  View,
  ActivityIndicator,
  Keyboard,
  ImageSourcePropType,
  TextInput,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GiftedChat, IMessage, SendProps } from 'react-native-gifted-chat';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { searchChatWord } from '../../../apis/chatting';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-root-toast';
import { useEmojiPanel } from '../../../hooks/useEmojiPanel';
import EmojiPanel from '../../../components/emoji-panel/EmojiPanel';
import NewEmojiPanel from '../../../components/emoji-panel/NewEmojiPanel';
// 기존 chat-render 파일에서 필요한 것만 임포트 (RenderInputToolbar의 prop 변경에 따라 수정 필요)
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
import { ExtendedIMessage } from '../../../utils/chatting'; // IMessage 확장 타입
import AdsModal from '../../../components/modals/ads-modal';
import { TestIds } from 'react-native-google-mobile-ads'; // TestIds는 광고 로직에서만 사용될 것
import { getUserInfo } from '../../../apis/setting';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
// 새로 만든 훅 임포트

import { useChatMessages } from '../../../hooks/useChatMessages';
import { useImageAndAdManagement } from '../../../hooks/useImageAndAdManagement';

// adsImage만 NewChat.tsx에 남겨둠 (Modal 컴포넌트 prop으로 전달)
const adsImage: ImageSourcePropType = require('../../../assets/images/ads_cookie.png');

const emojiPanelIcons: ImageSourcePropType[] = [
  require('../../../assets/images/emoji/ver1_item1_goodmorning.png'),
];

// NewChat 컴포넌트 시작
const NewChat: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [init, setInit] = useState<boolean>(false);
  const [screenLoading, setScreenLoading] = useState<boolean>(false);
  const [refreshTimerMS, setRefreshTimerMS] = useState<number>(500);

  // 반말 모드 정보를 useChatMessages 훅에 전달하기 위한 ref
  const informalModeRef = useRef<boolean>(true);

  const {
    isEmojiPanelVisible,
    emojiPanelHeight,
    translateY,
    opacity,
    toggleEmojiPanel,
    hideEmojiPanel,
    onEmojiSelect,
  } = useEmojiPanel();

  // useChatMessages 훅에서 필요한 상태와 함수들을 가져옵니다.
  const {
    messages,
    setMessages, // 검색 하이라이트를 위해 필요
    sending,
    buffer, // useImageAndAdManagement 훅으로 전달할 현재 버퍼 상태
    image, // useImageAndAdManagement 훅으로 전달할 현재 이미지 상태
    setBuffer, // useImageAndAdManagement 훅에서 호출될 setBuffer 함수
    setImage, // useImageAndAdManagement 훅에서 호출될 setImage 함수
    onSend,
    loadInitialMessages,
    toggleFavorite,
  } = useChatMessages({
    informalMode: informalModeRef.current,
    // onShowAdsModal은 useImageAndAdManagement 훅에서 제공하는 `modalVisible` 상태를 설정하는 함수를 직접 전달해야 함.
    // 여기서는 useImageAndAdManagement 훅의 `setModalVisible`을 직접 호출합니다.
    onShowAdsModal: () => {
      /* useImageAndAdManagement 훅에서 자체적으로 처리 */
    }, // 더 이상 필요 없음
  });

  // useImageAndAdManagement 훅에서 필요한 상태와 함수들을 가져옵니다.
  const {
    imageForPreview, // 이 훅에서 관리하는 이미지 미리보기 상태 (NewChat.tsx의 UI에 표시)
    modalVisible, // 광고 모달 가시성 (NewChat.tsx의 AdsModal에 전달)
    loadedAd, // 광고 로드 완료 여부
    loadingAd, // 광고 로드 중 여부
    showImageSourceSelection, // 이미지 원본 선택 함수 (앨범/카메라)
    handleModalClose, // 모달 닫기 핸들러 (AdsModal에 전달)
    watchAds, // 광고 시청 함수 (AdsModal에 전달)
    clearImageForPreview, // 이미지 미리보기 상태 지우는 함수
    showAdsModal,
    adUnitId, // 광고 ID (AdsModal의 `modalContent` prop에서 사용)
  } = useImageAndAdManagement({
    setChatImage: setImage, // useChatMessages 훅의 setImage 함수를 전달 (광고 시청 후 메시지 전송 트리거용)
    setChatBuffer: setBuffer, // useChatMessages 훅의 setBuffer 함수를 전달 (광고 시청 후 메시지 전송 트리거용)
    currentChatImage: image, // useChatMessages 훅의 현재 이미지 상태 전달 (전송용 이미지)
    currentChatBuffer: buffer, // useChatMessages 훅의 현재 버퍼 상태 전달 (전송용 버퍼)
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

  // TextInput을 가리키는 ref
  const textInputRef = useRef<TextInput>(null);

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

  // Risk Store v2 사용
  const { riskStatusV2, setRiskScoreV2 } = useRiskStoreVer2();

  // 채팅 화면 전체에 적용할 애니메이션 스타일
  const screenAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(isEmojiPanelVisible ? -emojiPanelHeight : 0, {
          duration: 300, // 300ms 동안 애니메이션
          // easing: Easing.out(Easing.quad), // 필요시 easing 추가
        }),
      },
    ],
    opacity: 1,
  }));

  //이모지 패널에 적용할 애니메이션 스타일
  const emojiPanelAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const insets = useSafeAreaInsets();

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
      // setRiskScoreV2가 함수라면 호출 형태가 되어야 함 (setRiskScoreV2())
      // 현재는 단순히 `setRiskScoreV2`를 참조하고 있으므로, 목적에 맞게 수정해야 합니다.
    });
    return () => {
      unsubscribe();
    };
  }, [navigation]);

  const messageContainerRef = useRef<React.ElementRef<typeof GiftedChat>>(null);

  // GiftedChat의 renderInputToolbar에서 toggleEmojiPanel 대신 새로운 함수 사용
  const handleEmojiToggle = useCallback(() => {
    // 키보드가 열려 있으면 키보드를 닫고 이모티콘 패널을 연다
    if (keyboardHeight > 0) {
      Keyboard.dismiss();
      // 키보드가 닫힌 후 이모티콘 패널을 연다
      setTimeout(() => {
        toggleEmojiPanel();
      }, 500); // 약간의 딜레이를 주어 부드럽게 동작
      return;
    }
    // 키보드가 닫혀 있으면 이모티콘 패널만 토글
    toggleEmojiPanel();
  }, [keyboardHeight, toggleEmojiPanel]);

  /* 채팅 화면 전체 구성 */
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
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

      <Animated.View style={[screenAnimatedStyle, { flex: 1 }]}>
        <GiftedChat
          emojiPanelHeight={emojiPanelHeight}
          isEmojiPanelVisible={isEmojiPanelVisible}
          wrapInSafeArea={false}
          //bottomOffset={insets.bottom}
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
              showImageSourceSelection, // <-- 변경: pickImage 대신 showImageSourceSelection 호출
              setInputHeight,
              imageForPreview, // <-- 변경: image 대신 imageForPreview 사용 (미리보기용)
              clearImageForPreview, // <-- 추가: 이미지 미리보기 지우는 함수 전달
              textInputRef,
              showAdsModal,
              //toggleEmojiPanel, // 이모티콘 버튼 클릭 핸들러
              //isEmojiPanelVisible, // 이모티콘 패널 표시 상태
              //추가
              isEmojiPanelVisible,
              emojiPanelHeight,
              translateY,
              opacity,
              handleEmojiToggle, // 이모티콘 패널 토글 함수
              hideEmojiPanel,
              onEmojiSelect,
            )
          }
          lightboxProps={undefined}
          textInputProps={{
            placeholder: getIsDemo() ? '메시지 입력.' : '메시지 입력',
            marginLeft: rsWidth * 15,
          }}
          keyboardShouldPersistTaps={'never'}
          alwaysShowSend
          onPressIn={() => {
            if (isEmojiPanelVisible) {
              console.log('이모티콘 패널이 열려있습니다. 닫습니다.');
              hideEmojiPanel();
            }
          }}
        />
      </Animated.View>
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
        modalVisible={modalVisible} // useImageAndAdManagement 훅의 modalVisible 사용
        onClose={handleModalClose} // useImageAndAdManagement 훅의 handleModalClose 사용
        onSubmit={async () => {
          console.log('광고 시청하기 클릭');
          Analytics.clickWatchAdsButtonInChatting(); // `handleModalClose`의 `onSubmit` 타입에서 이미 처리
          const adSuccess = await watchAds(); // useImageAndAdManagement 훅의 watchAds 사용
          if (!adSuccess) {
            console.log('광고 시청 실패');
            return;
          }
          console.log('광고 시청 성공??', adSuccess);
          // 광고 시청 성공 후, useImageAndAdManagement 훅 내부에서 setChatBuffer/setChatImage가 호출됩니다.
          // 여기서는 textInputRef.current.clear()만 직접 실행합니다.
          if (textInputRef.current) {
            textInputRef.current.clear();
          }
        }}
        imageSource={adsImage}
        modalContent={
          TestIds.REWARDED === adUnitId // adUnitId는 이제 useImageAndAdManagement 훅에서 가져온 것을 사용
            ? `광고를 시청하면\n쿠키에게 사진을 보여줄 수 있어요 :), ${adUnitId === TestIds.REWARDED ? '테스트용' : '찐'}`
            : `광고를 시청하면\n쿠키에게 사진을 보여줄 수 있어요  ${adUnitId}`
        }
      />
      {/*<EmojiPanel
        isVisible={isEmojiPanelVisible}
        height={emojiPanelHeight}
        translateY={translateY}
        opacity={opacity}
        onEmojiSelect={onEmojiSelect}
      />*/}
      {/*isEmojiPanelVisible && (
        <EmojiPanel
          isVisible={isEmojiPanelVisible}
          height={emojiPanelHeight}
          translateY={translateY}
          opacity={opacity}
          onEmojiSelect={onEmojiSelect}
        />
      )*/}
      {isEmojiPanelVisible && (
        <Animated.View
          style={[
            css`
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
            `,
            emojiPanelAnimatedStyle,
          ]}>
          <NewEmojiPanel height={emojiPanelHeight} />
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default NewChat;
