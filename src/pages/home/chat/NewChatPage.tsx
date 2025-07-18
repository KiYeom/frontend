import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  Dimensions,
  Platform,
  View,
  ActivityIndicator,
  Text,
  Keyboard,
  ImageSourcePropType,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  GiftedChat,
  IMessage,
  SendProps,
  SystemMessage,
  MessageImage,
} from 'react-native-gifted-chat';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../../../components/header/Header';
import * as WebBrowser from 'expo-web-browser';
import {
  DANGER_LETTER,
  DangerStackName,
  ERRORMESSAGE,
  HomeStackName,
  RISK_SCORE_THRESHOLD,
  RootStackName,
} from '../../../constants/Constants';
import * as NavigationBar from 'expo-navigation-bar';
import { setRefreshChat } from '../../../utils/storageUtils';
import {
  addRefreshChat,
  deleteNewIMessages,
  deleteNewIMessagesV3,
  getIsDemo,
  getNewIMessages,
  getRefreshChat,
  getRiskData,
  getUserNickname,
  setIsScoreDemo,
  setNewIMessages,
  setNewIMessagesV3,
  setRiskData,
} from '../../../utils/storageUtils';
import Analytics from '../../../utils/analytics';
import { rsFont, rsWidth } from '../../../utils/responsive-size';
import { chatting, getOldChatting } from '../../../apis/chatting';
import { TabScreenName } from '../../../constants/Constants';
import { Linking } from 'react-native';
import {
  RenderAvatar,
  RenderBubble,
  RenderDay,
  RenderFooter,
  RenderInputToolbar,
  RenderLoading,
  RenderSystemMessage,
  RenderTime,
  RenderMessageImage,
} from './ChatRender';
import { css } from '@emotion/native';
import uuid from 'react-native-uuid';
import { requestAnalytics } from '../../../apis/demo';
import { getKoreanServerTodayDateString } from '../../../utils/times';
import { getRiskScore } from '../../../apis/riskscore';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-root-toast';
import palette from '../../../assets/styles/theme';
import { useRiskStoreVer2 } from '../../../store/useRiskStoreVer2';
import clickHeaderGiftBoxButton from '../../../utils/analytics';
import Home from '../HomePage';
import { doesV3KeyExist, getNewIMessagesV3 } from '../../../utils/storageUtils';
import { getV3OldChatting, updateSendPhotoPermission } from '../../../apis/chatting';
import ChatHeader from '../../../components/chat-header/ChatHeader';
import { searchChatWord } from '../../../apis/chatting';
import { ApiAnswerMessage, ApiQuestionMessage, ExtendedIMessage } from '../../../utils/chatting';
import { reportMessages } from './ChatRender';
import { useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import ImageShow from '../../../components/image-show/ImageShow';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ApiChatResponse, ApiQuestions, ApiAnswers } from '../../../utils/chatting';
import AdsModal from '../../../components/modals/AdsModal';
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
import Constants from 'expo-constants';
import { getUserInfo } from '@apis/setting';
import Animated, { useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';
//import adUnitId from '../../../utils/advertise'; //앱 시작 시 결정된 값
import { useEmojiPanel } from '@hooks/useEmojiPanel';
import { useSelectedEmoji } from '@hooks/useSelectedEmoji';
import NewEmojiPanel from '@components/emoji-panel/NewEmojiPanel';
import AdMobBanner from '@components/ads/AdMobBanner';
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

//유저와 챗봇 오브젝트 정의
const userObject = {
  _id: 0,
  name: '나',
};

const botObject = {
  _id: 1,
  name: '쿠키',
  avatar: require('../../../assets/images/cookieprofile.png'),
  //avatar: require(cookieprofile),
};
const systemObject = {
  _id: -1,
  name: 'system',
  avatar: null,
};
const adsImage: ImageSourcePropType = require('../../../assets/images/ads_cookie.png');

const NewChat: React.FC = ({ navigation }) => {
  //console.log('채팅 화면 진입, adUnitId : ', adUnitId);
  //console.log('채팅 화면 진입, 테스트 아이디인가? : ', adUnitId === TestIds.REWARDED);
  //console.log('광고 아이디', adUnitId);
  //console.log('테스트모드인가요? : ', adUnitId === TestIds.REWARDED);
  const [init, setInit] = useState<boolean>(false);
  const [screenLoading, setScreenLoading] = useState<boolean>(false);
  const [refreshTimerMS, setRefreshTimerMS] = useState<number>(500);

  const [messages, setMessages] = useState<ExtendedIMessage[]>([]); //채팅 메시지 목록을 관리하는 상태
  const [sending, setSending] = useState<boolean>(false); //메시지를 보내고 있는 중인지 여부를 나타내는 상태 (보내고 있으면 true, 아니면 false)
  const [buffer, setBuffer] = useState<string | null>(null); //사용자가 입력한 메시지를 저장하는 임시 버퍼

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null); //타이핑 시간을 관리하는 타이머 (초기값 null, 이후 setTimeout의 반환값인 NodeJS.Timeout 객체를 저장)
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  //1.5.7 검색 추가
  const nowCursor = React.useRef<string | null | undefined>(undefined); //api 결과값이자 현재 커서 값
  const prevCursor = React.useRef<string | null | undefined>(undefined);
  const [searchWord, setSearchWord] = useState<string>(''); //검색어
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false); //검색 비활성화
  const [enableUp, setEnableUp] = useState<boolean>(false);
  const [enableDown, setEnableDown] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

  //1.5.8 사진 추가
  const [image, setImage] = useState<string | null>(null);
  const [isSticker, setIsSticker] = useState<boolean>(false);
  //광고 모달 추가
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  //반말 정보 불러오기
  const [isInFormalMode, setIsInformalMode] = useState<boolean>(true);
  const informalModeRef = useRef<boolean>(true); // API 값을 즉시 저장할 ref

  // 최신의 state를 읽도록 ref를 사용한다.
  const bufferRef = useRef<string | null>(null);
  const imageRef = useRef<string | null>(null);

  //결제 상태
  const [isPurchasing, setIsPurchasing] = useState(false);

  const { selectedEmoji, onSelectEmoji } = useSelectedEmoji();

  // state를 변경할 때마다 ref도 업데이트
  useEffect(() => {
    bufferRef.current = buffer;
    //console.log('buffer ref 업데아트', bufferRef.current);
  }, [buffer]);
  useEffect(() => {
    imageRef.current = image;
    //console.log('image ref 업데아트', imageRef.current);
  }, [image]);
  //textinput 을 가리키고 있는 ref
  const textInputRef = useRef<TextInput>(null);

  const pickImage = async () => {
    //console.log('pickImage 클릭함');
    setIsSticker(false); //이모지 패널 닫기
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });
    //console.log(result);
    if (!result.canceled) {
      //console.log('setImage');
      setImage(result.assets[0].uri);
      //핸드폰에서 선택한 사진의 로컬 주소 (file://~)를 저장
    }
    return;
  };

  const {
    isEmojiPanelVisible,
    emojiPanelHeight,
    translateY,
    opacity,
    toggleEmojiPanel,
    hideEmojiPanel,
    onEmojiSelect,
  } = useEmojiPanel();

  // 채팅 화면 전체에 적용할 애니메이션 스타일
  /*const screenAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(isEmojiPanelVisible ? -emojiPanelHeight : 0, {
          duration: 300, // 300ms 동안 애니메이션
          // easing: Easing.out(Easing.quad), // 필요시 easing 추가
        }),
      },
    ],
    opacity: 1,
  }));*/
  //이모지 패널에 쓸 애니메이션
  /*const emojiPanelAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));*/
  // 1) 패널 애니메이션 스타일
  const emojiPanelAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));
  // 2) 화면 전체 애니메이션 스타일
  const screenAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value - emojiPanelHeight }],
  }));

  //입력 필드 높이
  const [inputHeight, setInputHeight] = useState(rsFont * 16 * 1.5 + 15 * 2);

  //console.log('화면 너비:', width, '화면 높이:', height);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const handleEmojiToggle = useCallback(() => {
    //console.log('이모티콘 패널 토글');
    Analytics.clickHeaderEmojiButton(isEmojiPanelVisible ? 'close' : 'open');
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

  /*const rewarded = useMemo(
    () =>
      RewardedAd.createForAdRequest(adUnitId, {
        keywords: ['fashion', 'clothing'],
      }),
    [],
  );*/
  //

  //광고 로드 상태
  //const [loaded, setLoaded] = useState(false);
  //console.log('이모지 패널', emojiPanelHeight);
  //console.log('rewarded', rewarded);
  /*useFocusEffect(
    useCallback(() => {
      const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
        //console.log('광고 로드');
        setLoaded(true);
      });
      const unsubscribeError = rewarded.addAdEventListener(AdEventType.ERROR, (error) => {
        //console.error('RewardedAd 로드/표시 중 에러:', error);
        Analytics.watchNoEarnRewardScreenInChatting();
      });

      //광고를 끝까지 봐서 보상을 줄 수 있을 때 일기와 사진을 등록할 수 있는 콜백 함수를 unsubscribeEarned 이라는 이름으로 등록해둔다
      const unsubscribeEarned = rewarded.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        async (reward) => {
          Analytics.watchEarnRewardScreenInChatting();
          //.log('User earned reward of ', reward);
          const res = await updateSendPhotoPermission(true);
          //console.log('광고 시청 후 사진 전송 권한 업데이트 결과', res?.canSendPhoto);
          if (res) {
            if (textInputRef.current) {
              //console.log('입력 필드 초기화');
              textInputRef.current.clear(); // 입력 필드 초기화
            }
            sendMessageToServer();
          }
        },
      );
      //광고가 닫힐 때 실행되는 이벤트 리스터
      const unsubscribeClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
        //console.log('Ad was cloesed');
        setModalVisible(false);
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
        unsubscribeError();
        //console.log(`리스너 해제됨 : 현재 ${listenerCount}번 등록됨`);
      };
    }, [rewarded, navigation]),
  );*/

  //위치하는 y좌표 자리는... 화면 높이 - 입력 필드 높이-키보드 높이
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  const onKeyboardDidShow = (event) => {
    // event.endCoordinates.height를 통해 키보드 높이 정보를 얻습니다.
    const keyboardHeight = event.endCoordinates.height;
    setKeyboardHeight(keyboardHeight);
    //console.log('키보드 높이:', keyboardHeight);
  };

  const onKeyboardDidHide = () => {
    setKeyboardHeight(0);
    //console.log('키보드가 숨겨졌습니다.');
  };

  const { riskStatusV2, riskScoreV2, setRiskScoreV2, setRiskStatusV2, setHandleDangerPressV2 } =
    useRiskStoreVer2();

  //즐겨찾기 함수
  const toggleFavorite = async (messageId: string) => {
    //console.log('toggleFavorite 함수 실행', messageId);
    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.map((m) =>
        m._id === messageId ? { ...m, isSaved: !m.isSaved } : m,
      );
      setIMessagesV3(updatedMessages, []); // 변경된 배열을 로컬 저장소에도 업데이트
      return updatedMessages;
    });

    const targetMessage = messages.find((m) => m._id === messageId);
    if (targetMessage) {
      await reportMessages(messageId, targetMessage.isSaved);
    }
    //console.log('setMessages', messages);
  };

  const decideRefreshScreen = (viewHeight: number) => {
    NavigationBar.getVisibilityAsync().then((navBarStatus) => {
      if (navBarStatus === 'visible') {
        const screenHeight = Dimensions.get('screen').height;
        if (
          screenHeight - 2 < viewHeight &&
          viewHeight < screenHeight + 2 &&
          getRefreshChat() <= 2
        ) {
          addRefreshChat(1);
          //navigation.replace(HomeStackName.NewChatRefresh);
        }
      }
      setScreenLoading(false);
    });
  };

  //광고 시청 함수
  /*const watchAds = async () => {
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
      //console.log('광고 표시 중 오류가 발생했습니다', error);
      setLoaded(false);
      rewarded.load(); // Try to load again
    }
  };*/

  //1.5.7v3 서버에서 대화 내용을 불러오는 함수 (직접 이미지인지 판단하지 않음)
  /*
  const v3getIMessageFromServer = async (lastMessageDate: Date): Promise<ExtendedIMessage[]> => {
    const messages: ExtendedIMessage[] = [];
    const lastDateAddSecond = new Date(lastMessageDate.getTime() + 10 * 1000);
    const serverMessages = await getV3OldChatting(botObject._id, lastDateAddSecond.toISOString());
    //console.log('서버에서 불러온 v3 데이터 전체 확인하기', serverMessages);
    if (serverMessages && serverMessages.chats && serverMessages.chats.length > 0) {
      const imageUrlPattern = /https:\/\/bucket\.remind4u\.co\.kr\/gemini\/[a-f0-9]+\.jpg/;
      for (let i = 0; i < serverMessages.chats.length; i++) {
        const chat = serverMessages.chats[i];
        const originalText = chat.text || '';
        // 이미지 URL이 포함된 메시지인지 확인
        const imageUrlMatch = originalText.match(imageUrlPattern);
        if (imageUrlMatch && originalText.includes('\n')) {
          // 줄바꿈으로 텍스트와 이미지 URL 분리
          const textParts = originalText.split('\n').filter((part) => part.trim() !== '');

          // 텍스트 부분과 이미지 URL 부분 구분
          const textOnly = textParts.filter((part) => !imageUrlPattern.test(part)).join('\n');
          const imageUrls = textParts.filter((part) => imageUrlPattern.test(part));

          // 이미지 URL마다 별도 메시지 추가
          imageUrls.forEach((imageUrl) => {
            messages.push({
              _id: `${chat.id}-PIC`, // 이미지 메시지에 -PIC 접미사 추가
              text: imageUrl,
              image: imageUrl, // 이미지 URL을 image 필드에 별도 저장
              createdAt: new Date(new Date(chat.utcTime).getTime()),
              user: chat.status === 'user' ? userObject : botObject,
              isSaved: chat.isSaved,
              hightlightKeyword: '',
            });
          });
          // 텍스트가 있으면 텍스트 메시지 추가
          if (textOnly.trim() !== '') {
            messages.push({
              _id: chat.id,
              text: textOnly,
              createdAt: new Date(new Date(chat.utcTime).getTime()),
              user: chat.status === 'user' ? userObject : botObject,
              isSaved: chat.isSaved,
              hightlightKeyword: '',
            });
          }
        } else {
          // 일반 텍스트 메시지는 그대로 추가
          messages.push({
            _id: chat.id,
            text: originalText,
            createdAt: new Date(new Date(chat.utcTime).getTime()),
            user: chat.status === 'user' ? userObject : botObject,
            isSaved: chat.isSaved,
            hightlightKeyword: '',
          });
        }
      }
    }
    return messages.reverse();
  };*/
  //1.5.7v3 서버에서 대화 내용을 불러오는 함수
  const v3getIMessageFromServer = async (lastMessageDate: Date): Promise<ExtendedIMessage[]> => {
    const messages: ExtendedIMessage[] = [];
    const lastDateAddSecond = new Date(lastMessageDate.getTime() + 10 * 1000);
    const serverMessages = await getV3OldChatting(botObject._id, lastDateAddSecond.toISOString());

    if (serverMessages && serverMessages.chats && serverMessages.chats.length > 0) {
      for (let i = 0; i < serverMessages.chats.length; i++) {
        const chat = serverMessages.chats[i];
        const originalText = chat.text || '';

        // ID에 "-PIC" 접미사가 있는지 확인하여 이미지인지 판단
        if (chat.id.includes('-PIC')) {
          // 이미지 메시지 처리
          messages.push({
            _id: chat.id,
            text: originalText,
            image: originalText, // 이미지 URL을 image 필드에 저장
            createdAt: new Date(new Date(chat.utcTime).getTime()),
            user: chat.status === 'user' ? userObject : botObject,
            isSaved: chat.isSaved,
            hightlightKeyword: '',
          });
        } else {
          // 일반 텍스트 메시지 처리
          messages.push({
            _id: chat.id,
            text: originalText,
            createdAt: new Date(new Date(chat.utcTime).getTime()),
            user: chat.status === 'user' ? userObject : botObject,
            isSaved: chat.isSaved,
            hightlightKeyword: '',
          });
        }
      }
    }
    return messages.reverse();
  };

  //대화 내용을 불러오는 getHistory 함수
  const getHistory = async (): Promise<ExtendedIMessage[]> => {
    // 1. 로컬에서 먼저 저장된 대화 내역들을 가지고 온다.
    // 로그아웃을 하고 다시 실행하면, 디바이스에 저장한 대화를 삭제하기 때문에 undefined이다.
    // 반대로 로그아웃 이후 한 번이라도 대화를 하게 되면 디바이스에 실시간으로 모든 대화들이 저장이 되기 때문에 모든 대화 로그가 있음
    let messages: ExtendedIMessage[] = [];
    const isV3KeyExist = doesV3KeyExist();
    //console.log('getHistory 실행', isV3KeyExist);
    //deleteNewIMessagesV3(); //이거 삭제하기

    if (!isV3KeyExist) {
      //v3 키가 존재하지 않는 경우 (=로그아웃을 실행하고 채팅 화면을 다시 켰을 때)
      //console.log('🔑🔑🔑🔑🔑🔑🔑🔑🔑v3 키가 존재하지 않음🔑🔑🔑🔑🔑🔑🔑🔑', isV3KeyExist);
      const v3lastMessageDate = new Date(0);
      const v3ServerMessages = await v3getIMessageFromServer(v3lastMessageDate); //전체 데이터 가져오기
      //console.log('🔑🔑🔑🔑🔑🔑🔑🔑🔑v3ServerMessages', v3ServerMessages);
      if (v3ServerMessages && v3ServerMessages.length > 0) {
        //console.log('💚💚💚💚💚💚💚💚💚💚💚이전에 썼던 사람 마이그레이션 하기💚💚💚💚💚💚💚💚');
        setNewIMessagesV3(JSON.stringify(v3ServerMessages)); //로컬 마이그레이션
        deleteNewIMessages(); //v3 이전 로컬 데이터 삭제
        messages = [...v3ServerMessages, ...messages]; //데이터 화면에 보여주기
        //console.log('messages', messages);
      } else {
        //새로 온 사람
        //console.log('🤖🤖🤖🤖🤖🤖🤖🤖새로 온 사람🤖🤖🤖🤖🤖🤖🤖🤖');
        const systemMessage = {
          _id: 'systemMessage',
          text: `이 곳은 ${getUserNickname()}님과 저만의 비밀 공간이니, 어떤 이야기도 편하게 나눠주세요!\n\n반말로 대화를 나누고 싶으시다면 위에서 오른쪽에 있는 탭 바를 열고, 반말 모드를 켜 주세요!🍀💕`,
          createdAt: new Date(),
          user: systemObject,
          isSaved: false,
          hightlightKeyword: '',
          system: true,
        };
        const welcomeMessage = {
          _id: 'welcomeMessage',
          text: informalModeRef.current
            ? `반가워, ${getUserNickname()}!💚 나는 ${getUserNickname()}님 곁에서 힘이 되고싶은 골든 리트리버 쿠키야🐶 오늘은 어떤 하루를 보냈어?`
            : `반가워요, ${getUserNickname()}님!💚 저는 ${getUserNickname()}님 곁에서 힘이 되어드리고 싶은 골든 리트리버 쿠키예요🐶 오늘은 어떤 하루를 보내셨나요?`,
          createdAt: new Date(),
          user: botObject,
          isSaved: false,
          hightlightKeyword: '',
          showAvatar: true,
          system: false,
        };

        // systemMessage는 내부 데이터로 저장해두거나, 필요한 경우 별도로 처리
        messages.push(welcomeMessage);
        messages.push(systemMessage);

        const messagesArray = [welcomeMessage, systemMessage];
        const messagesString = JSON.stringify(messagesArray);
        setNewIMessagesV3(messagesString);
      }
    } else {
      //v3 키가 존재하는 경우
      ///console.log('👯👯👯👯👯👯👯👯v3 키가 존재함👯👯👯👯👯👯', isV3KeyExist);
      const v3DeviceHistory = getNewIMessagesV3();
      if (v3DeviceHistory) {
        //console.log('v3DeviceHistory', v3DeviceHistory);
        const v3DeviceArray = JSON.parse(v3DeviceHistory);
        messages.push(...v3DeviceArray);
      }
      //console.log('🦈🦈🦈🦈🦈🦈v3DeviceHistory', messages);
      //console.log('🦈🦈🦈🦈🦈🦈v3DeviceHistory', v3DeviceHistory);
      const v3lastMessageDate: Date =
        messages.length > 0 ? new Date(messages[0].createdAt) : new Date(0);
      const v3ServerMessages = await v3getIMessageFromServer(v3lastMessageDate);
      messages = [...v3ServerMessages, ...messages];
    }
    return messages;
  };

  //v3로 저장된 메시지들을 로컬에 저장하는 함수
  const setIMessagesV3 = (
    previousMessages: ExtendedIMessage[],
    newMessages: ExtendedIMessage[],
  ) => {
    const messagesString = JSON.stringify([...newMessages, ...previousMessages]);
    setNewIMessagesV3(messagesString);
  };

  const sendMessageToServerWithText = (text: string) => {
    //console.log('sendMessageToServerWithText 실행', text, image);

    const buf = text || ''; // 전달받은 텍스트 직접 사용
    const img = imageRef.current;

    if ((!buf && !img) || sending) return;

    setSending(true);
    setBuffer(null);
    setImage(null);
    bufferRef.current = null;
    imageRef.current = null;

    // 나머지 로직은 기존 sendMessageToServer와 동일
    if (img) {
      //console.log('이미지 전송 시작', img);
      const pendingMsg: ExtendedIMessage = {
        _id: uuid.v4().toString(),
        text: buf,
        image: img,
        createdAt: new Date(),
        user: userObject,
        isSaved: false,
      };

      setMessages((prev) => {
        const updated = GiftedChat.append(prev, [pendingMsg]);
        return updated;
      });

      if (buf?.trim() !== '') {
        //console.log('버퍼에 텍스트가 존재함', buf);
        const textMsg: ExtendedIMessage = {
          _id: uuid.v4().toString(),
          text: buf,
          createdAt: new Date(),
          user: userObject,
          isSaved: false,
        };
        setMessages((prev) => {
          const updated = GiftedChat.append(prev, [textMsg]);
          return updated;
        });
      }
    }

    const question = buf;
    const isDemo = getIsDemo();
    //console.log('전송할 텍스트:', question, '이미지:', img);
    const imageToSend = img ?? '';

    chatting(1, question, isDemo, imageToSend, isSticker)
      .then((res) => {
        // 기존 then 로직과 동일
        if (res) {
          const sortedMessages: ApiChatResponse = res?.reverse();
          const apiQuestions: ApiQuestions = sortedMessages.filter(
            (item): item is ApiQuestionMessage =>
              item.question !== null && item.question !== '' && item.answer === null,
          );
          const apiAnswers: ApiAnswers = sortedMessages.filter(
            (item): item is ApiAnswerMessage => item.answer !== null && item.question === null,
          );

          setMessages((previousMessages) => {
            const updatedMessages = [...previousMessages];
            const imageUrlPattern = /https:\/\/bucket\.remind4u\.co\.kr\/gemini\/[a-f0-9]+\.jpg/;

            for (let i = 0; i < apiQuestions.length; i++) {
              const questionIndex = previousMessages.findIndex((msg, idx) => {
                if (msg.text === apiQuestions[i].question) {
                  return true;
                }
                if (imageUrlPattern.test(apiQuestions[i].question)) {
                  if (
                    msg.text &&
                    msg.text.includes(imageUrlPattern.exec(apiQuestions[i].question)?.[0] || '')
                  ) {
                    return true;
                  }
                  if (msg.image && apiQuestions[i].question.includes(msg.image)) {
                    return true;
                  }
                }
                return false;
              });

              if (questionIndex !== -1) {
                updatedMessages[questionIndex] = {
                  ...updatedMessages[questionIndex],
                  _id: apiQuestions[i].id,
                };
              }
            }

            const newBotMessages: ExtendedIMessage[] = apiAnswers.map((item, idx) => ({
              _id: item.id,
              text: item.answer ?? '',
              createdAt: new Date(),
              user: botObject,
              isSaved: false,
            }));

            setIMessagesV3(updatedMessages, newBotMessages);
            return GiftedChat.append(updatedMessages, newBotMessages);
          });
        }
      })
      .catch((err) => {
        //console.log('error 발생', err);
        const newMessages: ExtendedIMessage[] = [
          {
            _id: uuid.v4().toString(),
            text: ERRORMESSAGE,
            createdAt: new Date(),
            user: botObject,
            isSaved: false,
          },
        ];
        setMessages((previousMessages) => {
          setIMessagesV3(previousMessages, newMessages);
          return GiftedChat.append(previousMessages, newMessages);
        });
      })
      .finally(() => {
        setBuffer(null);
        setImage(null);
        setSending(false);
        bufferRef.current = null;
        imageRef.current = null;
      });
  };

  //버퍼에 저장된 메시지를 서버로 전송하는 sendMessageToServer 함수
  const sendMessageToServer = () => {
    //console.log('sendMessageToServer 실행');
    const buf = bufferRef.current;
    const img = imageRef.current;
    //console.log('sendMessageToServer 실행', buffer, image);
    console.log('sendMessageToServer 내에서 읽은 값', buf, img);
    if ((!buf && !img) || sending) return; //텍스트도, 이미지도 없는 경우에는 전송하지 않음
    setSending(true);
    setBuffer(null); // 버퍼 비우기
    setImage(null); // 선택된 이미지 비우기
    bufferRef.current = null;
    imageRef.current = null;

    if (img) {
      //console.log('이미지 전송 시작', img);
      // 1) 화면에 보여줄 임시 메시지 객체 생성
      const pendingMsg: ExtendedIMessage = {
        _id: uuid.v4().toString(), // 랜덤 ID
        //text: img, // 텍스트 있어도 그냥 이미지만 나오게 return 걸어둠
        text: buf ?? '',
        image: img, // 이미지가 있으면 URI
        createdAt: new Date(),
        user: userObject, // '나' 유저
        isSaved: false,
      };

      // 2) UI에 즉시 추가
      // 2) UI에 바로 추가하고, 로컬에도 저장
      setMessages((prev) => {
        //console.log('ui에 즉시 추가');
        const updated = GiftedChat.append(prev, [pendingMsg]);
        //console.log('로컬에도 저장', updated);
        //setIMessagesV3(prev, [pendingMsg]);
        return updated;
      });
      if (buf?.trim() !== '') {
        //console.log('버퍼에 텍스트가 존재함', buf);
        const pendingMsg: ExtendedIMessage = {
          _id: uuid.v4().toString(), // 랜덤 ID
          text: buf ?? '', // 텍스트가 있으면 버퍼, 없으면 빈 문자열
          createdAt: new Date(),
          user: userObject, // '나' 유저
          isSaved: false,
        };
        setMessages((prev) => {
          //console.log('ui에 즉시 추가');
          const updated = GiftedChat.append(prev, [pendingMsg]);
          //console.log('로컬에도 저장');
          //setIMessagesV3(prev, [pendingMsg]);
          return updated;
        });
      } else {
        //console.log('버퍼에 텍스트가 존재하지 않음', buffer);
      }
    }
    const question = buf ?? '';
    const isDemo = getIsDemo();
    //console.log('iamge ', img, question);
    const imageToSend = img ?? '';
    //setImage(null);
    //console.log('이모티콘?', isSticker);

    chatting(1, question, isDemo, imageToSend, isSticker) //버퍼에 저장된 메세지를 서버로 전송하여 질문 & 대화 전체 쌍을 받아옴
      .then((res) => {
        if (res) {
          //const newMessages: IMessage[] = [];
          //console.log('현재 저장된 메세지들', messages);
          const sortedMessages: ApiChatResponse = res?.reverse(); //결과를 역순으로 정렬하여 최신 메세지가 앞으로
          //사용자가 작성한 메세지들을 담은 apiQuestions 배열
          const apiQuestions: ApiQuestions = sortedMessages.filter(
            (item): item is ApiQuestionMessage =>
              item.question !== null && item.question !== '' && item.answer === null,
          );
          //사용자 물음에 대한 응답 결과를 담은 (쿠키 대답) apiAnswers 배열
          const apiAnswers: ApiAnswers = sortedMessages.filter(
            (item): item is ApiAnswerMessage => item.answer !== null && item.question === null,
          );

          //console.log('apiQuestions', apiQuestions);
          //console.log('apiAnswers', apiAnswers);

          setMessages((previousMessages) => {
            const updatedMessages = [...previousMessages];
            // 이미지 URL 패턴 (정확한 패턴으로 조정 필요)
            const imageUrlPattern = /https:\/\/bucket\.remind4u\.co\.kr\/gemini\/[a-f0-9]+\.jpg/;
            for (let i = 0; i < apiQuestions.length; i++) {
              // 최근 메시지부터 시작해서 일치하는 메시지 찾기 (역순)
              const questionIndex = previousMessages.findIndex((msg, idx) => {
                //console.log('msg : ', msg);
                //텍스트들만 있는 경우 Id 매핑
                if (msg.text === apiQuestions[i].question) {
                  //console.log('이 버블은 텍스트만 존재함', msg.text);
                  return true;
                }

                // 이미지가 포함되어 전송된 경우
                if (imageUrlPattern.test(apiQuestions[i].question)) {
                  // 1. 텍스트에 이미지 URL이 포함된 경우
                  //console.log('이미지 URL이 포함된 경우', apiQuestions[i].question);
                  //console.log('이미지 URL 패턴', imageUrlPattern);
                  //console.log('메세지', msg, msg.text);
                  if (
                    msg.text &&
                    msg.text.includes(imageUrlPattern.exec(apiQuestions[i].question)?.[0] || '')
                  ) {
                    //console.log('이 버블은 텍스트와 이미지가 존재함', msg.text);
                    return true;
                  }
                  // 2. image 필드가 있는 경우
                  if (msg.image && apiQuestions[i].question.includes(msg.image)) {
                    //console.log('이 버블은 이미지만 존재함', msg.image);
                    return true;
                  }
                }

                return false;
              });

              // 일치하는 메시지를 찾았으면 ID 업데이트
              if (questionIndex !== -1) {
                //console.log('원하는 메세지를 찾아 Id 업데이트', questionIndex);
                updatedMessages[questionIndex] = {
                  ...updatedMessages[questionIndex],
                  _id: apiQuestions[i].id,
                };
              }
            }

            // API 응답에서 봇의 대답들만 필터링했다고 가정 (예: apiAnswers)
            const newBotMessages: ExtendedIMessage[] = apiAnswers.map((item, idx) => ({
              _id: item.id,
              text: item.answer ?? '', // API에서 받은 봇의 대답 텍스트
              createdAt: new Date(), // 생성 시간 (API에 createdAt이 없으면 현재 시간에 idx를 더해서 대체)
              user: botObject, // 봇을 나타내는 user 객체
              isSaved: false,
            }));

            setIMessagesV3(updatedMessages, newBotMessages);
            return GiftedChat.append(updatedMessages, newBotMessages);
          });
        }
      })
      .catch((err) => {
        //console.log('error 발생', err);
        //console.log(isSticker, 'isSticker');
        //console.log(imageToSend, 'imageToSend');
        const newMessages: ExtendedIMessage[] = [
          {
            _id: uuid.v4().toString(),
            text: ERRORMESSAGE,
            createdAt: new Date(),
            user: botObject,
            isSaved: false,
          },
        ];
        setMessages((previousMessages) => {
          setIMessagesV3(previousMessages, newMessages);
          return GiftedChat.append(previousMessages, newMessages);
        });
      })
      .finally(() => {
        setBuffer(null);
        setImage(null);
        setSending(false);
        bufferRef.current = null; // 버퍼 ref 초기화
        imageRef.current = null; // 이미지 ref 초기화
      });
  };

  //디바운싱을 담당하는 resetTimer 함수
  //타이핑을 하고 있다면 -> 타이머 초기화 & 타이핑 정지했다면 -> 타이머 동작 & 2초 후에 서버로 전송
  //이미지를 전송하는 경우에는 바로 서버로 전송
  const resetTimer = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (!image) {
      //이미지가 없는 경우에만 디바운싱
      typingTimeoutRef.current = setTimeout(() => {
        sendMessageToServer();
      }, 2 * 1000);
    } else {
      //console.log('이미지가 있어요');
    }
  };

  /*
  resetRefreshTimer 함수
  */
  const resetRefreshTimer = (height: number, ms: number) => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    setScreenLoading(true);
    refreshTimeoutRef.current = setTimeout(() => {
      decideRefreshScreen(height);
    }, Math.floor(ms));
  };

  // 검색어에 해당하는 메시지의 highlight 키워드를 업데이트하는 함수
  const updateMessageHighlights = (keyword: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        // 검색어가 포함되어 있으면 highlight 키워드로 업데이트, 없으면 빈 문자열로 초기화
        msg.text.includes(keyword)
          ? { ...msg, hightlightKeyword: keyword }
          : { ...msg, hightlightKeyword: '' },
      ),
    );
  };

  //키워드를 검색하여 id값을 반환해주는 handleSearch 함수
  const handleSearch = async (
    text: string,
    direction: null | 'up' | 'down',
  ): Promise<string | null> => {
    //console.log('새 함수 검색어 : ', text, direction, nowCursor.current);
    setSearchLoading(true);

    // 스크롤 함수가 없거나 더 이상 검색 결과가 없을 경우
    if (!scrollToMessageById || (nowCursor.current === null && prevCursor.current === null)) {
      //console.log('검색 결과가 없습니다');
      Toast.show(`검색 결과가 없습니다`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.CENTER,
      });
      setSearchLoading(false);
      nowCursor.current = undefined; // 초기화
      return null;
    }

    let res: any; // searchChatWord의 반환값 타입에 맞게 수정

    // 검색 방향에 따른 커서 선택
    if (direction === 'up' || direction === null) {
      const apiCursor: string | null = nowCursor.current === undefined ? null : nowCursor.current;
      res = await searchChatWord(text, apiCursor, direction);
    } else if (direction === 'down') {
      const apiCursor: string | null = prevCursor.current;
      res = await searchChatWord(text, apiCursor, direction);
    }

    // 커서 업데이트
    prevCursor.current = nowCursor.current;
    nowCursor.current = res?.nextCursor ?? null;
    setSearchLoading(false);

    if (res?.nextCursor) {
      scrollToMessageById(res.nextCursor);
      updateMessageHighlights(text); //messages의 hightlight 변경
      if (direction === 'up' || direction === null) {
        // 최초 검색인 경우(prevCursor.current가 null 또는 undefined)
        if (prevCursor.current === undefined || prevCursor.current === null) {
          setEnableUp(true);
          setEnableDown(false); // 최초 검색: down 버튼 비활성화
        } else {
          setEnableUp(true);
          setEnableDown(true); // 후속 up 검색: 양쪽 모두 활성화
        }
      } else if (direction === 'down') {
        // down 버튼 클릭: 이전으로 되돌아갔으므로 up 버튼만 활성화
        setEnableUp(true);
        setEnableDown(false);
      }
    } else {
      // 검색 결과가 없는 경우: 요구사항 4 - 둘 다 비활성화
      updateMessageHighlights('');
      if (direction === 'up') {
        setEnableDown(true);
        setEnableUp(false);
        Toast.show(`더 이상 검색 결과가 존재하지 않습니다`, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.CENTER,
        });
      } //위로 더 못 가는 경우
      else {
        setEnableUp(false);
        setEnableDown(false);
        Toast.show(`검색 결과가 없습니다`, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.CENTER,
        });
        prevCursor.current = undefined; // 초기화
        nowCursor.current = undefined; // 초기화
      }
    }
    return res?.nextCursor;
  };

  // 메시지 id로부터 메시지 인덱스를 찾아 해당 메시지로 스크롤하는 scrollToMessageById 함수
  const scrollToMessageById = (messageId: string | number) => {
    const index = messages.findIndex((message) => message._id === messageId);
    if (index === -1) {
      //console.log('해당 메시지를 찾을 수 없습니다.');
      return;
    }
    // 메시지 인덱스로 메시지 객체를 가져옵니다.
    const targetMessage = messages[index];
    //console.log('targetMessage', targetMessage);
    //console.log(`Scrolling to index ${index} for message id: ${messageId}`);
    //console.log('giftedChatRef.current?.props?.messageContainerRef?.current?', giftedChatRef.current?.props?.messageContainerRef?.current?);
    try {
      setTimeout(() => {
        messageContainerRef.current?.scrollToIndex({
          index,
          animated: true,
          viewOffset: 0, // 메시지 시작 부분에 맞추려면 0 또는 원하는 값
          viewPosition: 0, // 0: 상단 정렬, 0.5: 중앙, 1: 하단 정렬
        });
      }, 150);
    } catch (error) {
      //console.log('렌더링이 되지 않아 스크롤 실패', error);
    }
  };

  /* 
  채팅 화면이 처음 보였을 때 대화 기록을 가지고 오는 과정
  getHistory() : 서버에서 그 동안의 모든 대화 히스토리를 가지고 옴
  ** 성공할 경우 (then) : 서버에서 가지고 온 대화인 messageHistory를 messages 상태에 저장
  ** 실패할 경우 (catch) : 사용자에게 안내와 함께 홈 화면으로 이동
  */

  useEffect(() => {
    //console.log('getUserInfo 실행');
    getUserInfo()
      .then((res) => {
        //res.isInformal === false => 반말 모드
        //console.log('getUserInfo 결과', res, res.isInFormal);
        //res && setIsInformalMode(res.isInFormal);
        if (res) {
          //console.log(`현재 모드 : ${res.isInFormal}`);
          informalModeRef.current = res.isInFormal;
        } else {
          informalModeRef.current = false; //기본값 : 반말 모드
        }
        loadChatHistory();
      })
      .catch((error) => {
        informalModeRef.current = false; //기본값 : 반말 모드
        loadChatHistory();
      });
  }, []);

  const loadChatHistory = () => {
    //console.log('loadChatHistory 실행');
    setInit(true);
    if (getRefreshChat() === 0) {
      Analytics.watchNewChatScreen();
    }
    getHistory()
      .then((messageHistory) => {
        //console.log('😀😀😀😀😀😀useEffect 결과😀😀😀😀', messageHistory);
        setMessages(messageHistory);
        setInit(false);
      })
      .catch((err) => {
        alert('대화 내역을 불러오는 중 오류가 발생했어요. 다시 시도해주세요.');
        //console.log(err);
        navigation.navigate(TabScreenName.Home);
      });
  };

  // useFocusEffect를 사용하여 화면이 포커스될 때마다 refresh flag를 확인
  /*
  useFocusEffect(
    useCallback(() => {
      if (getRefreshChat() > 0) {
        // refresh flag가 설정되어 있다면 메시지를 새로 불러오고 flag를 초기화
        setRefreshChat(0);
        setInit(true);
        getHistory()
          .then((messageHistory) => {
            setMessages(messageHistory);
            setInit(false);
          })
          .catch((err) => {
            console.log('대화 내역을 불러오는 중 오류가 발생했어요. 다시 시도해주세요.');
            console.log(err);
            navigation.navigate('Home');
          });
      }
    }, [navigation]),
  ); */

  //비행기를 클릭헀을 때 실행되는 onSend 함수
  //api 로 유저 - 채팅 한 쌍을 받아오기 전에는 id 값을 임의로 설정하여 화면에 보여준다.
  const onSend = (newMessages: ExtendedIMessage[] = []) => {
    //console.log('onSend 실행', newMessages);
    if (!newMessages[0].text.trim() && !newMessages[0].image) {
      return;
    }
    //console.log('onsend ');
    //setBuffer(buffer ? buffer + newMessages[0].text + '\t' : newMessages[0].text + '\t');
    /*setMessages((previousMessages) => {
      //setIMessagesV3(previousMessages, newMessages.reverse());
      return GiftedChat.append(previousMessages, newMessages);
    });*/
    Analytics.clickChatSendButton(
      !!newMessages[0].text,
      image ? true : false,
      image && isSticker ? true : false,
    );
    if (image) {
      if (isSticker) {
        //이모티콘은 바로 전송
        //console.log('😀이모티콘 전송 같이 보내는 글자 : ', newMessages[0].text);
        setBuffer(newMessages[0].text);
        sendMessageToServerWithText(newMessages[0].text);
        return;
      }
      //console.log('🧞‍♂️이미지 전송');
      // 이미지를 보낸 경우
      //setBuffer(buffer ? buffer + newMessages[0].text + '\t' : newMessages[0].text + '\t');
      //console.log('이미지 전송~~~', newMessages);
      setBuffer(newMessages[0].text);
      /*if (textInputRef.current) {
        //console.log('입력 필드 초기화');
        textInputRef.current.clear(); // 입력 필드 초기화
      }*/
      /*setMessages((previousMessages) => {
        //setIMessagesV3(previousMessages, newMessages.reverse());
        console.log('이미지 전송', newMessages);
        return GiftedChat.append(previousMessages, newMessages);
      });*/
      sendMessageToServerWithText(newMessages[0].text);

      //setModalVisible(true);
      /*
      이미지가 화면에 보이려면
          setMessages((previousMessages) => {
      //setIMessagesV3(previousMessages, newMessages.reverse());
      return GiftedChat.append(previousMessages, newMessages);
    });
      */
    } else {
      //console.log('텍스트만 전송');
      // 텍스트만 보낸 경우 (디바운싱)
      setBuffer(buffer ? buffer + newMessages[0].text + '\t' : newMessages[0].text + '\t');
      // Timer will be reset in the useEffect that watches buffer
      setMessages((previousMessages) => {
        //setIMessagesV3(previousMessages, newMessages.reverse());
        return GiftedChat.append(previousMessages, newMessages);
      });
    }
  };

  const scrollToIndexFailed = (info) => {
    //console.log('scrollToIndexFailed');
    setSearchLoading(true);
    const offset = info.averageItemLength * info.index * 2;
    const flatList = messageContainerRef.current;
    // 임시 오프셋으로 스크롤
    //console.log('정보1', info.index);
    //console.log('정보2', info.averageItemLength);
    flatList.scrollToOffset({ offset: offset });
    // 잠시 후 정확한 인덱스로 다시 스크롤 시도
    setTimeout(() => {
      flatList.scrollToIndex({ index: info.index, animated: true });
    }, 50);
  };

  //버퍼가 변경됨에 따라 타이머를 재설정함
  //타이머 = 유저의 타이핑 시간 (연속된 타이핑인지를 체크)
  useEffect(() => {
    if (buffer) {
      resetTimer();
    }
  }, [buffer]);

  const showToast = () => {
    Toast.show('메시지가 복사했습니다.', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.CENTER,
    });
  };

  // NewChat.tsx에서 handleEmojiSelect 함수 추가
  const handleEmojiSelectAsImage = useCallback((emoji: string) => {
    //console.log('이모티콘 선택', emoji);

    // 이모티콘을 이미지 상태에 설정
    setImage(emoji);
    setIsSticker(true);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setRiskScoreV2;
    });
    // 컴포넌트 unmount 시 리스너를 해제
    return () => {
      unsubscribe();
    };
  }, [navigation]);

  const messageContainerRef = useRef<React.ElementRef<typeof GiftedChat>>(null);

  const insets = useSafeAreaInsets();
  //console.log('insets', insets);

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
      <AdMobBanner />
      <ChatHeader
        isSearchMode={isSearchMode}
        setIsSearchMode={setIsSearchMode}
        riskStatusV2={riskStatusV2}
        isEvent={true}
        isRight={true}
        isLeft={true}
        leftFunction={() => {
          navigation.popToTop(); // 스택 최상단으로 이동
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
          //console.log('돋보기 버튼을 누름');
          Analytics.clickHeaderSearchButton();
          setIsSearchMode((prev) => !prev);
        }}
        scrollToMessageById={scrollToMessageById}
        searchWord={searchWord}
        setSearchWord={setSearchWord}
        handleSearch={handleSearch}
        updateMessageHighlights={updateMessageHighlights}
      />

      <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={hideEmojiPanel}>
        <Animated.View style={[screenAnimatedStyle, { flexGrow: 1 }]}>
          <GiftedChat
            listViewProps={{
              onScrollToIndexFailed: scrollToIndexFailed,
              onMomentumScrollEnd: () => {
                // 스크롤 애니메이션이 종료되면 재귀 호출이 더 이상 발생하지 않는다고 가정하고 로딩 스피너를 숨김
                setSearchLoading(false);
              },
            }}
            as
            any
            messageContainerRef={messageContainerRef}
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={userObject}
            onInputTextChanged={(text) => {
              if (typingTimeoutRef.current) {
                resetTimer();
              }
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
            renderBubble={(props) => <RenderBubble {...props} onFavoritePress={toggleFavorite} />}
            onLongPress={(context, message: IMessage) => {
              Clipboard.setStringAsync(message.text).then(() => {
                showToast();
              });
            }}
            renderFooter={() => RenderFooter(sending)}
            renderTime={RenderTime}
            renderDay={RenderDay}
            renderSystemMessage={RenderSystemMessage}
            renderInputToolbar={(sendProps: SendProps<ExtendedIMessage>) =>
              RenderInputToolbar(
                sendProps,
                sending,
                isSearchMode,
                enableUp,
                enableDown,
                setEnableUp,
                setEnableDown,
                handleSearch,
                searchWord,
                pickImage,
                setInputHeight,
                image,
                setImage,
                textInputRef,
                //추가
                isEmojiPanelVisible,
                emojiPanelHeight,
                translateY,
                opacity,
                handleEmojiToggle, // 이모티콘 패널 토글 함수
                hideEmojiPanel,
                selectedEmoji,
                onSelectEmoji,
              )
            }
            lightboxProps={undefined}
            textInputProps={{
              placeholder: getIsDemo() ? '메시지 입력.' : '메시지 입력',
              marginLeft: rsWidth * 15,
            }}
            //renderMessageImage={RenderMessageImage}
            keyboardShouldPersistTaps={'never'}
            alwaysShowSend
          />
        </Animated.View>
      </TouchableOpacity>
      {searchLoading && (
        <View
          style={{
            position: 'absolute', // 절대 위치 지정
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999, // 다른 컴포넌트보다 위에 렌더링
          }}>
          <ActivityIndicator />
        </View>
      )}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          pointerEvents: 'box-none',
        }}
        pointerEvents="box-none"></Animated.View>

      <Animated.View
        // 항상 렌더링은 하지만, 애니메이션 값으로 위치와 불투명도를 제어합니다
        style={[
          {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 100,
          },
          emojiPanelAnimatedStyle, // ← 이렇게 배열로 넣어야 Reanimated가 읽습니다
        ]}
        pointerEvents={isEmojiPanelVisible ? 'auto' : 'none'}>
        <NewEmojiPanel
          key="uniqueEmojiPanelKey"
          height={emojiPanelHeight + insets.bottom}
          selectedEmoji={selectedEmoji}
          onSelectEmoji={handleEmojiSelectAsImage}
          insets={insets}
          onPurchaseStart={() => setIsPurchasing(true)}
          onPurchaseEnd={() => setIsPurchasing(false)}
        />
      </Animated.View>
      {/*<AdsModal
        modalVisible={modalVisible}
        onClose={() => {
          Analytics.clickNoWatchAdsButtonInChatting();
          setModalVisible(false);
        }}
        onSubmit={() => {
          Analytics.clickWatchAdsButtonInChatting();
          //watchAds(); //1. 광고 시청하기
          //2. 광고 시청을 성공적으로 하여 보상을 받은 경우, api 를 호출하여 사용자의 사진 추가 권한을 true 로 변경한다. (O)
          //3. 변경 후, 홈 화면으로 가서 사용자의 질문을 보낸다 (화면과 서버에, sendMessageToServer())
          //4. 사용자의 질문과 쿠키의 답변을 화면에 나타낸다.
        }}
        imageSource={adsImage}
        modalContent={
          TestIds.REWARDED === adUnitId
            ? `광고를 시청하면\n쿠키에게 사진을 보여줄 수 있어요 :)`
            : `광고를 시청하면\n쿠키에게 사진을 보여줄 수 있어요`
        }
      />*/}
      {isPurchasing && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: '#fff', marginTop: 10 }}>이모티콘 구매 중...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default NewChat;
