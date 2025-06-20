//메인 컨테이너
import React, { useEffect, useState } from 'react';
import {
  Platform,
  View,
  ActivityIndicator,
  Text,
  Keyboard,
  ImageSourcePropType,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { rsHeight, rsWidth, rsFont } from '../../../../utils/responsive-size';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../../../../components/icons/icons';
import {
  GiftedChat,
  IMessage,
  InputToolbar,
  InputToolbarProps,
  ComposerProps,
} from 'react-native-gifted-chat';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessages, toggleMessageSaved } from '../../../../redux/chatSlice';
import { getUserNickname } from '../../../../utils/storageUtils';
import { MessageBubble } from './components/MessageBubble';
import Analytics from '../../../../utils/analytics';
import ChatHeader from '../../../../components/chatHeader/chatHeader';
import { RenderLoading } from '../chat-render';
import { css } from '@emotion/native';
import palette from '../../../../assets/styles/theme';

import { useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AdsModal from '../../../../components/modals/ads-modal';
import { TestIds } from 'react-native-google-mobile-ads';
import Constants from 'expo-constants';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useEmojiPanel } from '../../../../hooks/useEmojiPanel';
import { useSelectedEmoji } from '../../../../hooks/useSelectedEmoji';
import NewEmojiPanel from '../../../../components/emoji-panel/NewEmojiPanel';
import AdMobBanner from '../../../../components/ads/AdMobBanner';
import { fetchChatMessages } from '../../../../redux/chatThunks';
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
  avatar: require('../../../../assets/images/cookieprofile.png'),
  //avatar: require(cookieprofile),
};
const systemObject = {
  _id: -1,
  name: 'system',
  avatar: null,
};
const adsImage: ImageSourcePropType = require('../../../../assets/images/ads_cookie.png');

const UpgradeNewChat: React.FC = ({ navigation }) => {
  const dispatch = useDispatch();
  const { messages, status, error } = useSelector((state: RootState) => state.chat);
  const renderInputToolbar = useCallback(
    (props: InputToolbarProps) => (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbarContainer}
        primaryStyle={styles.inputToolbarPrimary}></InputToolbar>
    ),
    [],
  );
  const onSend = useCallback(
    (newMessages: any[] = []) => {
      console.log('🟢 onSend called with:', newMessages); // ✅ 여기에 로그 삽입
      const safe = newMessages.map((m) => ({
        ...m,
        createdAt: m.createdAt || new Date().toISOString(),
      }));
      dispatch(sendMessages(safe));
    },
    [dispatch],
  );

  const renderComposer = useCallback(
    (props: ComposerProps) => (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          //backgroundColor: palette.neutral[50],
          borderRadius: 20,
          //paddingHorizontal: 15,
          //paddingVertical: 15,
          minHeight: rsFont * 16 * 1.5 + 15 * 2,
          marginHorizontal: 10,
          flex: 1,
          backgroundColor: 'blue',
        }}>
        {/* TextInput */}
        <TextInput
          {...props}
          style={[
            {
              fontFamily: 'Pretendard-Regular',
              fontSize: rsFont * 16,
              lineHeight: rsFont * 16 * 1.5,
              color: palette.neutral[900],
              flex: 1,
              padding: 0,
              margin: 0,
              textAlignVertical: 'top',
              maxHeight: rsFont * 16 * 1.5 * 5,
            },
            styles.inputText,
          ]}
          placeholder="메시지를 입력하세요"
          placeholderTextColor={palette.neutral[400]}
          value={props.text}
          onChangeText={props.onTextChanged}
          multiline={true}
          autoFocus={true}
        />

        {/* 오른쪽 아래 아이콘 */}
        <TouchableOpacity
          onPress={() => {
            console.log('이모티콘 버튼 클릭');
            handleEmojiToggle();
          }}
          style={{
            alignSelf: 'flex-end',
            paddingLeft: 10,
            minWidth: 24,
            height: 24,
            justifyContent: 'center',
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Icon
            name="emojiIcon"
            width={24}
            color={isEmojiPanelVisible ? palette.primary[100] : palette.neutral[300]}
          />
        </TouchableOpacity>
      </View>
    ),
    [],
  );

  const [init, setInit] = useState<boolean>(false);
  const [screenLoading, setScreenLoading] = useState<boolean>(false);

  //광고 모달 추가
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  //결제 상태
  const [isPurchasing, setIsPurchasing] = useState(false);

  const { selectedEmoji, onSelectEmoji } = useSelectedEmoji();

  const {
    isEmojiPanelVisible,
    emojiPanelHeight,
    translateY,
    opacity,
    toggleEmojiPanel,
    hideEmojiPanel,
    onEmojiSelect,
  } = useEmojiPanel();

  const renderBubble = useCallback(
    (props) => (
      <MessageBubble
        message={props.currentMessage}
        onToggleSave={(id) => dispatch(toggleMessageSaved(id))}
      />
    ),
    [dispatch],
  );

  // 1) 패널 애니메이션 스타일
  const emojiPanelAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));
  // 2) 화면 전체 애니메이션 스타일
  const screenAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value - emojiPanelHeight }],
  }));

  const [image, setImage] = useState<string | null>(null);
  const [isSticker, setIsSticker] = useState<boolean>(false);

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

  //위치하는 y좌표 자리는... 화면 높이 - 입력 필드 높이-키보드 높이
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    dispatch(fetchChatMessages(new Date(0).toISOString()));
  }, [dispatch]);
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

  // NewChat.tsx에서 handleEmojiSelect 함수 추가
  const handleEmojiSelectAsImage = useCallback((emoji: string) => {
    //console.log('이모티콘 선택', emoji);

    // 이모티콘을 이미지 상태에 설정
    setImage(emoji);
    setIsSticker(true);
  }, []);

  const renderSend = useCallback(
    (props: SendProps) => {
      const trimmed = props.text?.trim();
      return (
        <TouchableOpacity
          onPress={() => {
            if (trimmed) {
              const newMessage: IMessage = {
                _id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                text: trimmed,
                user: userObject,
              };
              props.onSend([newMessage], true);
            }
          }}
          style={styles.actionButton}>
          <Icon
            name="airplane"
            width={20}
            color={trimmed ? palette.neutral[400] : palette.neutral[300]}
          />
        </TouchableOpacity>
      );
    },
    [onSend],
  );

  const insets = useSafeAreaInsets();
  //console.log('insets', insets);

  const renderActions = useCallback(
    (props: ActionsProps) => (
      <TouchableOpacity style={styles.actionButton} onPress={() => console.log('Action pressed')}>
        <Icon name="picture-icon" width={20} />
      </TouchableOpacity>
    ),
    [],
  );

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
      <AdMobBanner />
      <ChatHeader
        isLeft={true}
        leftFunction={() => {
          console.log('뒤로가기 버튼을 누름');
        }}
      />
      <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={hideEmojiPanel}>
        <Animated.View style={[screenAnimatedStyle, { flexGrow: 1 }]}>
          <GiftedChat
            messages={messages}
            onSend={onSend}
            user={userObject}
            showAvatarForEveryMessage
            renderAvatarOnTop
            renderBubble={renderBubble}
            renderInputToolbar={renderInputToolbar}
            renderActions={renderActions}
            renderComposer={renderComposer}
            renderSend={renderSend}
            lightboxProps={undefined}
            keyboardShouldPersistTaps={'never'}
            alwaysShowSend
          />
        </Animated.View>
      </TouchableOpacity>
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
          emojiPanelAnimatedStyle,
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
      <AdsModal
        modalVisible={modalVisible}
        onClose={() => {
          Analytics.clickNoWatchAdsButtonInChatting();
          setModalVisible(false);
        }}
        onSubmit={() => {
          Analytics.clickWatchAdsButtonInChatting();
          watchAds(); //1. 광고 시청하기
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
      />
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
const styles = StyleSheet.create({
  inputToolbarContainer: {
    borderTopWidth: 0,
    paddingVertical: rsHeight * 8,
    paddingHorizontal: rsWidth * 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'pink',
  },
  inputToolbarPrimary: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    margin: 0,
    width: 35,
    height: 35,
    borderRadius: 50,
    backgroundColor: palette.neutral[100],
    marginLeft: 0,
  },
  messageBubble: {
    backgroundColor: palette.neutral[100],
    paddingHorizontal: rsWidth * 12,
    paddingVertical: rsHeight * 8,
    borderRadius: 10,
    maxWidth: rsWidth * 200,
    marginBottom: rsHeight * 5,
  },
  messageText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: rsFont * 14,
    color: palette.neutral[500],
    margin: 0,
  },
  favoriteButton: {
    marginTop: rsHeight * 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  favoriteIcon: {
    fontSize: 18,
  },
  inputText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: rsFont * 16,
    lineHeight: rsFont * 16 * 1.5,
    color: palette.neutral[900], // 기존 스타일에 맞는 텍스트 색상
    flex: 1,
    marginHorizontal: 10, // 기존 marginHorizontal 제거
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: palette.neutral[50],
    borderRadius: 20,
    textAlignVertical: 'top',
    maxHeight: rsFont * 16 * 1.5 * 5, // 최대 5줄
    minHeight: rsFont * 16 * 1.5 + 15 * 2, // 최소 높이
  },
  avatarContainer: {
    width: rsWidth * 35,
    height: rsHeight * 35,
    backgroundColor: 'black',
  },
  avatarImage: {
    width: rsWidth * 35,
    height: rsHeight * 35,
  },
});

export default UpgradeNewChat;
