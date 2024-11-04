import { useEffect, useRef, useState } from 'react';
import { Dimensions, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GiftedChat, IMessage, SendProps } from 'react-native-gifted-chat';
import Header from '../../header/header';
import { ERRORMESSAGE, HomeStackName } from '../../../constants/Constants';
import * as NavigationBar from 'expo-navigation-bar';
import {
  addRefreshChat,
  getNewIMessages,
  getRefreshChat,
  getUserNickname,
  setNewIMessages,
} from '../../../utils/storageUtils';
import Analytics from '../../../utils/analytics';
import { rsWidth } from '../../../utils/responsive-size';
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
    const lastDateAdd1s = new Date(lastMessageDate.getTime() + 10 * 1000);
    const serverMessages = await getOldChatting(botObject._id, lastDateAdd1s.toISOString());

    if (serverMessages && serverMessages.chats && serverMessages.chats.length > 0) {
      for (let i = 0; i < serverMessages.chats.length; i++) {
        const chat = serverMessages.chats[i];
        const text = chat.text;
        const texts = text.split('\n');
        for (let j = 0; j < texts.length; j++) {
          const text = texts[j];
          const splitTexts = text.match(/\s*([^.!?;:…。？！~…」»]+[.!?;:…。？！~…」»]?)\s*/g) || [];
          for (let k = 0; k < splitTexts.length; k++) {
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
    chatting(1, question)
      .then((res) => {
        if (res && res.answer) {
          const answers =
            res.answer.match(/\s*([^.!?;:…。？！~…」»]+[.!?;:…。？！~…」»]?)\s*/g) || [];
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
          navigation.navigate(TabScreenName.Home);
        }}
      />

      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={userObject}
        onInputTextChanged={(text) => {
          if (typingTimeoutRef.current) {
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
        renderBubble={RenderBubble}
        renderChatFooter={() => RenderFooter(sending)}
        isCustomViewBottom
        renderTime={RenderTime}
        renderDay={RenderDay}
        renderSystemMessage={RenderSystemMessage}
        renderInputToolbar={RenderInputToolbar}
        renderComposer={RenderComposer}
        textInputProps={{
          placeholder: '메시지 입력',
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
