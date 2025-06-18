import React, { useState, useCallback } from 'react';
import {
  GiftedChat,
  IMessage,
  ActionsProps,
  InputToolbar,
  SendProps,
  InputToolbarProps,
  Composer,
  ComposerProps,
  Send,
} from 'react-native-gifted-chat';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessages, setInputText, toggleMessageSaved } from '../../../../redux/chatSlice';
import { selectMessagesWithDate, selectInputText } from '../../../../redux/selectors/chatSelectors';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import palette from '../../../../assets/styles/theme';
import { rsHeight, rsWidth, rsFont } from '../../../../utils/responsive-size';
import Icon from '../../../../components/icons/icons';
import { TextInput } from 'react-native';
import { MessageBubble } from './components/MessageBubble';
import { UpgradeChatMessage } from './type/upgradeChat-types';
import ChatHeader from './components/ChatHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AdMobBanner from '../../../../components/ads/AdMobBanner';
const UpgradeNewChat = ({ navigation }) => {
  const dispatch = useDispatch();
  const messages = useSelector(selectMessagesWithDate);
  const [image, setImage] = useState<string | null>(null);
  const [localText, setLocalText] = useState<string>('');

  const onSend = useCallback(
    (newMessages: IMessage[] = []) => {
      const safe = newMessages.map((m) => ({
        ...m,
        //createdAt: m.createdAt.toISOString(),
      }));
      dispatch(sendMessages(safe));
    },
    [dispatch],
  );

  const onPressAlbum = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('앨범 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImage(uri);
      const imageMessage: IMessage = {
        _id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        user: { _id: 1 },
        image: uri,
        text: '',
      };
      dispatch(sendMessages([imageMessage]));
    }
  }, [dispatch]);

  const renderInputToolbar = useCallback(
    (props: InputToolbarProps) => (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbarContainer}
        primaryStyle={styles.inputToolbarPrimary}></InputToolbar>
    ),
    [],
  );
  const renderComposer = useCallback(
    (props: ComposerProps) => (
      <TextInput
        {...props}
        style={styles.inputText}
        placeholder="메시지를 입력하세요"
        placeholderTextColor={palette.neutral[400]}
        value={props.text}
        onChangeText={props.onTextChanged}
        multiline={true}
        autoFocus={true}
      />
    ),
    [],
  );
  {
    /*<Composer
        {...props}
        textInputStyle={styles.inputText}
        placeholder="메시지를 입력하세요"
        placeholderTextColor={palette.neutral[400]}
        //text={localText}
        onTextChanged={(text) => {
          setLocalText(text);
        }}
        text={props.text}
        onTextChanged={(text) => {
          //props.text 로 관리하고 있음
          props.text = text; // 직접적으로 props.text를 수정하는 것은 권장되지 않지만, 예시로 사용
        }}
        multiline={true}
      />*/
  }

  const renderActions = useCallback(
    (props: ActionsProps) => (
      <TouchableOpacity style={styles.actionButton} onPress={onPressAlbum}>
        <Icon name="picture-icon" width={20} />
      </TouchableOpacity>
    ),
    [onPressAlbum],
  );

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
                user: { _id: 1 },
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

  const renderBubble = useCallback(
    (props) => (
      <MessageBubble
        message={props.currentMessage}
        onToggleSave={(id) => dispatch(toggleMessageSaved(id))}
      />
    ),
    [dispatch],
  );
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top, flex: 1 }}>
      <AdMobBanner />
      <ChatHeader navigation={navigation} />
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: 1 }}
        renderActions={renderActions}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderComposer={renderComposer}
        renderSend={renderSend}
        textInputProps={{ autoCorrect: false }}
      />
    </View>
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
    marginLeft: 10,
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
    fontSize: rsFont * 14,
    color: 'red',
    flex: 1,
  },
});

export default UpgradeNewChat;
