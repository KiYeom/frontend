import { useEffect, useRef, useState } from 'react';
import { Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GiftedChat, IMessage, SendProps } from 'react-native-gifted-chat';
import Header from '../../header/header';
import { ERRORMESSAGE, HomeStackName, Message } from '../../../constants/Constants';
import * as NavigationBar from 'expo-navigation-bar';
import {
  addRefreshChat,
  getChatting,
  getRefreshChat,
  getUserNickname,
  setChatting,
} from '../../../utils/storageUtils';
import Analytics from '../../../utils/analytics';
import { rsWidth } from '../../../utils/responsive-size';
import { chatting, getOldChatting } from '../../../apis/chatting';
import { TabScreenName } from '../../../constants/Constants';
import {
  RenderAvatar,
  RenderBubble,
  RenderDay,
  RenderFooter,
  RenderInputToolbar,
  RenderLoading,
  RenderSend,
  RenderSystemMessage,
  RenderTime,
} from './chat-render';

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
          getRefreshChat() <= 3
        ) {
          addRefreshChat(1);
          navigation.replace(HomeStackName.NewChatRefresh);
        }
      }
    });
  };

  const getHistory = async (): Promise<IMessage[]> => {
    //대화 내역을 가져오는 함수
    const messageArray: IMessage[] = [];
    const chatJSON = getChatting();
    if (chatJSON) {
      const chatArray = JSON.parse(chatJSON);
      for (let i = 0; i < chatArray.length; i++) {
        const chat = chatArray[i];
        messageArray.push({
          _id: Number(chat.id),
          text: chat.text,
          createdAt: new Date(Number(chat.id)),
          user: chat.sender === 'user' ? userObject : botObject,
        });
      }
    }
    //서버에서 그동안의 대화를 가져온다.
    const lastMessageDate: Date =
      messageArray.length > 0
        ? new Date(Number(messageArray[messageArray.length - 1]._id) + 1000)
        : new Date(0);
    const oldMessages = await getOldChatting(1, lastMessageDate.toISOString());

    if (oldMessages && oldMessages.chats && oldMessages.chats.length > 0) {
      for (let i = 0; i < oldMessages.chats.length; i++) {
        const chat = oldMessages.chats[i];
        const text = chat.text;
        const texts = text.split('\n');
        for (let j = 0; j < texts.length; j++) {
          const text = texts[j];
          const splitTexts = text.match(/\s*([^.!?;:…。？！~…」»]+[.!?;:…。？！~…」»]?)\s*/g) || [];
          for (let k = 0; k < splitTexts.length; k++) {
            messageArray.push({
              _id:
                new Date(chat.utcTime).getTime() +
                j * 100 +
                k * 10 +
                Math.floor(Math.random() * 10),
              text: splitTexts[k],
              createdAt: new Date(
                new Date(chat.utcTime).getTime() +
                  j * 100 +
                  k * 10 +
                  Math.floor(Math.random() * 10),
              ),
              user: chat.status === 'user' ? userObject : botObject,
            });
          }
        }
      }
    }
    //대화 내역이 없을 경우, 환영 메시지를 추가
    if (messageArray.length === 0) {
      const welcomeMessage = {
        _id: new Date().getTime(),
        text: `반가워요, ${getUserNickname()}님!💚 저는 ${getUserNickname()}님 곁에서 힘이 되어드리고 싶은 골든 리트리버 쿠키예요🐶 이 곳은 ${getUserNickname()}님과 저만의 비밀 공간이니, 어떤 이야기도 편하게 나눠주세요!\n\n반말이 편할까요, 아니면 존댓말이 좋으실까요? 원하는 말투로 대화할게요! 🍀💕`,
        createdAt: new Date(),
        user: botObject,
      };
      console.log('add welcome');
      messageArray.push(welcomeMessage);
    }
    return messageArray.reverse();
  };

  const setHistory = (previousMessages: IMessage[], newMessages: IMessage[]) => {
    //대화 내역을 저장하는 함수
    const chatArray: Message[] = [];
    for (let i = 0; i < newMessages.length; i++) {
      const message = newMessages[i];
      chatArray.push({
        id: new Date(message.createdAt).getTime().toString(),
        sender: message.user._id === 0 ? 'user' : 'bot',
        text: message.text,
        time: new Date(message.createdAt).toLocaleTimeString(),
        date: new Date(message.createdAt).toLocaleDateString(),
      });
    }
    chatArray.reverse();
    for (let i = 0; i < previousMessages.length; i++) {
      const message = previousMessages[i];
      chatArray.push({
        id: new Date(message.createdAt).getTime().toString(),
        sender: message.user._id === 0 ? 'user' : 'bot',
        text: message.text,
        time: new Date(message.createdAt).toLocaleTimeString(),
        date: new Date(message.createdAt).toLocaleDateString(),
      });
    }

    setChatting(JSON.stringify(chatArray.reverse()));
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
              _id: new Date().getTime() + i,
              text: answers[i],
              createdAt: new Date(new Date().getTime() + i),
              user: botObject,
            });
          }
          setHistory(messages, newMessages);
          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, newMessages.reverse()),
          );
        }
      })
      .catch((err) => {
        const newMessages: IMessage[] = [
          {
            _id: new Date().getTime(),
            text: ERRORMESSAGE,
            createdAt: new Date(),
            user: botObject,
          },
        ];
        setHistory(messages, newMessages);
        setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
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
        setMessages((pre) => GiftedChat.append(pre, messageHistory));
        setInit(false);
      })
      .catch((err) => {
        console.log('getHistoryError: ', err);
        alert('대화 내역을 불러오는 중 오류가 발생했어요. 다시 시도해주세요.');
        navigation.navigate(TabScreenName.Home);
      });
  }, []);

  const onSend = (newMessages: IMessage[] = []) => {
    Analytics.clickChatSendButton();
    if (newMessages.length !== 1 || !newMessages[0].text.trim()) return;
    setHistory(messages, newMessages);
    setBuffer(buffer ? buffer + newMessages[0].text + '\n' : newMessages[0].text + '\n');
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
  };

  useEffect(() => {
    if (buffer) {
      console.log('useEffect: ', buffer);
      resetTimer();
    }
  }, [buffer]);

  if (init) {
    return <RenderLoading />;
  }

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      edges={['bottom']}
      onLayout={(event) => {
        if (Platform.OS === 'android') {
          const { height } = event.nativeEvent.layout;
          resetRefreshTimer(height, refreshTimerMS);
          setRefreshTimerMS(refreshTimerMS / 2);
        }
      }}>
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
