import { useCallback, useEffect, useState } from 'react';
import { Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GiftedChat } from 'react-native-gifted-chat';
import Header from '../../header/header';
import { HomeStackName } from '../../../constants/Constants';
import * as NavigationBar from 'expo-navigation-bar';
import { addRefreshChat, getRefreshChat } from '../../../utils/storageUtils';
import Analytics from '../../../utils/analytics';

const NewChat: React.FC = ({ navigation }) => {
  const [messages, setMessages] = useState([]);

  const decideRefreshScreen = (viewHeight: number) => {
    NavigationBar.getVisibilityAsync().then((navBarStatus) => {
      if (navBarStatus === 'visible') {
        const screenHeight = Dimensions.get('screen').height;
        if (
          screenHeight - 2 < viewHeight &&
          viewHeight < screenHeight + 2 &&
          getRefreshChat() <= 4
        ) {
          addRefreshChat(1);
          navigation.replace(HomeStackName.NewChat);
        }
      }
    });
  };

  useEffect(() => {
    if (getRefreshChat() === 0) {
      Analytics.watchChatScreen();
    }
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      edges={['bottom']}
      onLayout={(event) => {
        if (Platform.OS === 'android') {
          const { height } = event.nativeEvent.layout;
          decideRefreshScreen(height);
        }
      }}>
      <Header title="쿠키의 채팅방" />
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        isStatusBarTranslucentAndroid={true}
        keyboardShouldPersistTaps="never"
        user={{
          _id: 1,
        }}
      />
    </SafeAreaView>
  );
};

export default NewChat;
