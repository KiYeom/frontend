import { useCallback, useEffect, useState } from 'react';
import { Dimensions, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GiftedChat } from 'react-native-gifted-chat';
import Header from '../../header/header';
import { useWindowDimensions } from 'react-native';

const NewChat: React.FC = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    console.log(`${Platform.OS}-NewChat-insets: top=>${insets.top} bottom=>${insets.bottom}`);
  }, [insets]);

  useEffect(() => {
    console.log(`${Platform.OS}-NewChat-dimensions: width=>${width} height=>${height}`);
  }, [width, height]);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
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
    <View
      style={{ flex: 1, backgroundColor: 'red' }}
      onLayout={(event, date = new Date().getTime()) => {
        if (Platform.OS === 'android') {
          console.log('NewChat height: ', event.nativeEvent.layout.height);
          const bestHeight = insets.top + height;
          console.log('NewChat bestHeight ', bestHeight);
          setMessages([
            {
              _id: date,
              text: `
Viewheight: ${event.nativeEvent.layout.height} \n 
insetTop: ${insets.top} \n 
Hookheight: ${height} \n
DefaultWindowHeight: ${Dimensions.get('window').height} \n
DefaultScreenHeight: ${Dimensions.get('screen').height} \n
insetBottom: ${insets.bottom} \n 
bestHeight: ${bestHeight} \n
`,
              createdAt: new Date(),
              user: {
                _id: 2,
                name: 'React Native',
                avatar: 'https://placeimg.com/140/140/any',
              },
            },
          ]);
          if (
            event.nativeEvent.layout.height < bestHeight - 1 ||
            event.nativeEvent.layout.height > bestHeight + 1
          ) {
            // console.log('❗️refresh❗️ : ', getOpenTimes());
            // navigation.replace(HomeStackName.NewChat);
          }
        }
      }}>
      <Header title="쿠키의 채팅방" />
      {/* <TouchableOpacity
        style={css`
          height: 200px;
          width: 100%;
          background-color: yellow;
        `}
        onPress={() => {
          console.log('click: newChat -> chat');
          navigation.navigate(HomeStackName.Chat);
        }}
        activeOpacity={0.1}
      />
      <TouchableOpacity
        style={css`
          height: 200px;
          width: 100%;
          background-color: blue;
        `}
        onPress={() => {
          console.log('click: newChat -> newChat');
          navigation.navigate(HomeStackName.NewChat);
        }}
        activeOpacity={0.1}
      /> */}
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        isStatusBarTranslucentAndroid={true}
        keyboardShouldPersistTaps="never"
        user={{
          _id: 1,
        }}
      />
    </View>
  );
};

export default NewChat;
