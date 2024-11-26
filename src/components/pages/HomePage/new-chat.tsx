import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GiftedChat, IMessage, SendProps } from 'react-native-gifted-chat';
import Header from '../../header/header';
import {
  DANGER_LETTER,
  DangerStackName,
  ERRORMESSAGE,
  HomeStackName,
  RISK_SCORE_THRESHOLD,
  RootStackName,
} from '../../../constants/Constants';
import * as NavigationBar from 'expo-navigation-bar';
import {
  addRefreshChat,
  getIsDemo,
  getNewIMessages,
  getRefreshChat,
  getRiskData,
  getUserNickname,
  setIsScoreDemo,
  setNewIMessages,
  setRiskData,
} from '../../../utils/storageUtils';
import Analytics from '../../../utils/analytics';
import { rsFont, rsWidth } from '../../../utils/responsive-size';
import { chatting, getOldChatting } from '../../../apis/chatting';
import { TabScreenName } from '../../../constants/Constants';
import {
  RenderAvatar,
  RenderBubble,
  RenderComposer,
  RenderDay,
  RenderFooter,
  RenderInputToolbar,
  RenderLoading,
  RenderSend,
  RenderSystemMessage,
  RenderTime,
} from './chat-render';
import { css } from '@emotion/native';
import uuid from 'react-native-uuid';
import { requestAnalytics } from '../../../apis/demo';
import { getKoreanServerTodayDateString } from '../../../utils/times';
import { getRiskScore } from '../../../apis/riskscore';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-root-toast';
import { Hint } from 'react-native-ui-lib';
import palette from '../../../assets/styles/theme';

const HINT_MESSAGE = 'AI로 생성된 답변입니다. 상담 필요 시 전문가와 상의하세요.';

const userObject = {
  _id: 0,
  name: '나',
};

const botObject = {
  _id: 1,
  name: '쿠키',
  avatar: require('../../../assets/images/cookieprofile.png'),
};

const NewChat: React.FC = ({ navigation }) => {
  const [init, setInit] = useState<boolean>(false);
  const [screenLoading, setScreenLoading] = useState<boolean>(false);
  const [refreshTimerMS, setRefreshTimerMS] = useState<number>(500);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [sending, setSending] = useState<boolean>(false);
  const [buffer, setBuffer] = useState<string | null>(null);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [riskScore, setRiskScore] = React.useState<number>(0);
  const [riskStatus, setRiskStatus] = React.useState<'safe' | 'danger' | 'danger-opened'>('safe');
  const [hintStatus, setHintStatus] = React.useState<boolean>(false);

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
          navigation.replace(HomeStackName.NewChatRefresh);
        }
      }
      setScreenLoading(false);
    });
  };

  const getIMessageFromServer = async (lastMessageDate: Date): Promise<IMessage[]> => {
    const messages: IMessage[] = [];
    const lastDateAddSecond = new Date(lastMessageDate.getTime() + 10 * 1000);
    const serverMessages = await getOldChatting(botObject._id, lastDateAddSecond.toISOString());

    if (serverMessages && serverMessages.chats && serverMessages.chats.length > 0) {
      for (let i = 0; i < serverMessages.chats.length; i++) {
        const chat = serverMessages.chats[i];
        const text = chat.text;
        const texts = text.split('\n');
        for (let j = 0; j < texts.length; j++) {
          const text = texts[j];
          let splitTexts: string[] = [text];
          if (chat.status !== 'user') {
            splitTexts =
              text.match(
                /\s*([^.!?;:…。？！~…」»]+[.!?;:…。？！~…」»](?:\s*[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F251}]*)?)\s*/gu,
              ) || [];
          }

          for (let k = 0; k < splitTexts.length; k++) {
            if (splitTexts[k] === '') continue;
            messages.push({
              _id: uuid.v4().toString(),
              text: splitTexts[k],
              createdAt: new Date(new Date(chat.utcTime).getTime()),
              user: chat.status === 'user' ? userObject : botObject,
            });
          }
        }
      }
    }
    return messages.reverse();
  };

  const getHistory = async (): Promise<IMessage[]> => {
    //대화 내역을 가져오는 함수
    let messages: IMessage[] = [];
    const deviceHistory = getNewIMessages();
    if (deviceHistory) {
      const deviceArray = JSON.parse(deviceHistory);
      messages.push(...deviceArray);
    }

    //서버에서 그동안의 대화를 가져온다.
    const lastMessageDate: Date =
      messages.length > 0 ? new Date(messages[0].createdAt) : new Date(0);
    const serverMessages = await getIMessageFromServer(lastMessageDate);
    messages = [...serverMessages, ...messages];

    //대화 내역이 없을 경우, 환영 메시지를 추가
    if (messages.length === 0) {
      const welcomeMessage = {
        _id: new Date().getTime(),
        text: `반가워요, ${getUserNickname()}님!💚 저는 ${getUserNickname()}님 곁에서 힘이 되어드리고 싶은 골든 리트리버 쿠키예요🐶 이 곳은 ${getUserNickname()}님과 저만의 비밀 공간이니, 어떤 이야기도 편하게 나눠주세요!\n\n반말이 편할까요, 아니면 존댓말이 좋으실까요? 원하는 말투로 대화할게요! 🍀💕`,
        createdAt: new Date(),
        user: botObject,
      };
      messages.push(welcomeMessage);
      setNewIMessages(JSON.stringify([welcomeMessage]));
    }
    return messages;
  };

  const setIMessages = (previousMessages: IMessage[], newMessages: IMessage[]) => {
    const messagesString = JSON.stringify([...newMessages, ...previousMessages]);
    setNewIMessages(messagesString);
  };

  const sendMessageToServer = () => {
    if (!buffer) return;
    setSending(true);
    const question = buffer ?? '';
    const isDemo = getIsDemo();
    chatting(1, question, isDemo)
      .then((res) => {
        if (res && res.answer) {
          const answers =
            res.answer.match(
              /\s*([^.!?;:…。？！~…」»]+[.!?;:…。？！~…」»](?:\s*[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F251}]*)?)\s*/gu,
            ) || [];
          const newMessages: IMessage[] = [];
          for (let i = 0; i < answers.length; i++) {
            newMessages.push({
              _id: uuid.v4().toString(),
              text: answers[i],
              createdAt: new Date(new Date().getTime() + i),
              user: botObject,
            });
          }
          setMessages((previousMessages) => {
            setIMessages(previousMessages, newMessages.reverse());
            return GiftedChat.append(previousMessages, newMessages);
          });
        }
      })
      .catch((err) => {
        const newMessages: IMessage[] = [
          {
            _id: uuid.v4().toString(),
            text: ERRORMESSAGE,
            createdAt: new Date(),
            user: botObject,
          },
        ];
        setMessages((previousMessages) => {
          setIMessages(previousMessages, newMessages.reverse());
          return GiftedChat.append(previousMessages, newMessages);
        });
      })
      .finally(() => {
        setBuffer(null);
        setSending(false);
      });
  };

  const resetTimer = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendMessageToServer();
    }, 2 * 1000);
  };

  const resetRefreshTimer = (height: number, ms: number) => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    setScreenLoading(true);
    refreshTimeoutRef.current = setTimeout(() => {
      decideRefreshScreen(height);
    }, Math.floor(ms));
  };

  useEffect(() => {
    setInit(true);
    if (getRefreshChat() === 0) {
      Analytics.watchNewChatScreen();
    }
    getHistory()
      .then((messageHistory) => {
        setMessages(messageHistory);
        setInit(false);
      })
      .catch((err) => {
        alert('대화 내역을 불러오는 중 오류가 발생했어요. 다시 시도해주세요.');
        navigation.navigate(TabScreenName.Home);
      });
  }, []);

  const onSend = (newMessages: IMessage[] = []) => {
    Analytics.clickChatSendButton();
    if (newMessages.length !== 1 || !newMessages[0].text.trim()) return;
    setBuffer(buffer ? buffer + newMessages[0].text + '\n' : newMessages[0].text + '\n');
    setMessages((previousMessages) => {
      setIMessages(previousMessages, newMessages.reverse());
      return GiftedChat.append(previousMessages, newMessages);
    });
  };

  useEffect(() => {
    if (buffer) {
      resetTimer();
    }
  }, [buffer]);

  //헤더 아이콘 클릭했을 때 이동 페이지
  const handleDangerPress = () => {
    if (riskStatus === 'danger') {
      Analytics.clickDangerLetterButton(riskScore);
      const letterIndex = Math.floor(Math.random() * DANGER_LETTER.length);
      setRiskData({
        timestamp: new Date().getTime(),
        isRead: true,
        letterIndex,
      });
      navigation.navigate(RootStackName.DangerStackNavigator, {
        screen: DangerStackName.DangerAlert,
        params: { letterIndex },
      }); //쿠키 편지 화면으로 이동한다
      return;
    }
    if (riskStatus === 'danger-opened') {
      //위험한 상태일 때 확인을 했으면
      Analytics.clickOpenedDangerLetterButton(riskScore);
      const letterIndex = getRiskData()?.letterIndex;
      navigation.navigate(RootStackName.DangerStackNavigator, {
        screen: DangerStackName.DangerAlert,
        params: { letterIndex: letterIndex ?? 0 },
      }); //쿠키 편지 화면으로 이동한다
      return;
    }
    if (riskStatus === 'safe') {
      setHintStatus(true);
      return;
    }
  };

  const refreshRiskScore = () => {
    const date = getKoreanServerTodayDateString(new Date());
    getRiskScore(date).then((res) => {
      setRiskScore(res);
      if (res >= RISK_SCORE_THRESHOLD && !getRiskData()) {
        setRiskData({
          timestamp: new Date().getTime(),
          isRead: false,
          letterIndex: null,
        });
      }
      refreshRiskStatus();
    });
  };

  const refreshRiskStatus = () => {
    const riskData = getRiskData();
    if (!riskData) setRiskStatus('safe');
    else if (riskData.isRead) setRiskStatus('danger-opened');
    else setRiskStatus('danger');
  };

  //헤더 아이콘 설정하기
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', refreshRiskScore);
    // 컴포넌트 unmount 시 리스너를 해제
    return () => {
      unsubscribe();
    };
  }, [navigation]);

  const showToast = () => {
    Toast.show('메시지가 복사했습니다.', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.CENTER,
    });
  };

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

      <Header
        title="쿠키의 채팅방"
        leftFunction={() => {
          Analytics.clickHeaderBackButton();
          if (getIsDemo()) requestAnalytics();
          navigation.navigate(TabScreenName.Home);
        }}
        isRight
        rightFunction={handleDangerPress}
        rightIcon={
          riskStatus === 'danger'
            ? 'danger-sign'
            : riskStatus === 'danger-opened'
              ? 'danger-sign-opened'
              : 'information'
        }
      />
      <Hint
        visible={hintStatus}
        position={Hint.positions.BOTTOM}
        message={HINT_MESSAGE}
        color={'white'}
        enableShadow
        messageStyle={css`
          font-family: Pretendard-Regular;
          font-size: ${16 * rsFont + 'px'};
          color: ${palette.neutral[900]};
        `}
        onPress={() => setHintStatus(false)}
        onBackgroundPress={() => setHintStatus(false)}
        backdropColor={'rgba(0, 0, 0, 0.5)'}>
        <View />
      </Hint>

      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={userObject}
        onInputTextChanged={(text) => {
          if (typingTimeoutRef.current && !sending && buffer) {
            resetTimer();
          }
        }}
        isStatusBarTranslucentAndroid
        renderAvatar={RenderAvatar}
        showAvatarForEveryMessage
        renderAvatarOnTop
        onPressAvatar={() => {
          Analytics.clickChatCharacterAvatar();
          navigation.navigate(HomeStackName.Profile);
        }}
        onLongPressAvatar={() => {
          if (getIsDemo()) setIsScoreDemo(true);
        }}
        renderBubble={RenderBubble}
        onLongPress={(context, message: IMessage) => {
          Clipboard.setStringAsync(message.text).then(() => {
            showToast();
          });
        }}
        renderFooter={() => RenderFooter(sending)}
        renderTime={RenderTime}
        renderDay={RenderDay}
        renderSystemMessage={RenderSystemMessage}
        renderInputToolbar={RenderInputToolbar}
        renderComposer={RenderComposer}
        textInputProps={{
          placeholder: getIsDemo() ? '메시지 입력.' : '메시지 입력',
          marginLeft: rsWidth * 15,
        }}
        keyboardShouldPersistTaps="never"
        renderSend={(sendProps: SendProps<IMessage>) => RenderSend(sendProps, sending)}
        alwaysShowSend
      />
    </SafeAreaView>
  );
};

export default NewChat;
