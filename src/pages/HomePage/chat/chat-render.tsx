import {
  Avatar,
  AvatarProps,
  Bubble,
  BubbleProps,
  Day,
  DayProps,
  IMessage,
  InputToolbar,
  InputToolbarProps,
  Send,
  SendProps,
  SystemMessage,
  SystemMessageProps,
  Time,
  TimeProps,
  ComposerProps,
  Composer,
} from 'react-native-gifted-chat';
import CustomMultiTextInput from './CustomMultiTextInput';
import { TextInput } from 'react-native';
import palette from '../../../assets/styles/theme';
import { css } from '@emotion/native';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';
import { ActivityIndicator, Alert, Image, TouchableOpacity, View, Text } from 'react-native';
import Icon from '../../../components/icons/icons';
import TypingIndicator from 'react-native-gifted-chat/src/TypingIndicator';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { reportChat } from '../../../apis/chatting';
import { getNewIMessages } from '../../../utils/storageUtils';
import Input from '../../../components/input/input';
import { transparent } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

const getMessageSet = (
  currentMessage: IMessage,
  allMessages: IMessage[],
):
  | {
      botChats: string;
      userChats: string;
    }
  | undefined => {
  // Find the index of the current message
  const currentMessageIndex = allMessages.findIndex((msg) => msg._id === currentMessage._id);

  if (currentMessageIndex === -1) {
    console.warn('Message not found in the list');
    return undefined;
  }

  let nowIndex = currentMessageIndex;
  const botChats: string[] = [];
  const userChats: string[] = [];

  for (let i = nowIndex; i < allMessages.length; i++) {
    const msg = allMessages[i];
    if (msg.user._id === null || isNaN(msg.user._id) || Number(msg.user._id) <= 0) {
      break;
    }
    botChats.push(msg.text);
    nowIndex++;
  }
  for (let i = nowIndex; i < allMessages.length; i++) {
    const msg = allMessages[i];
    if (msg.user._id === null || isNaN(msg.user._id) || Number(msg.user._id) > 0) {
      break;
    }
    userChats.push(msg.text);
    nowIndex++;
  }
  botChats.reverse();
  userChats.reverse();

  return {
    botChats: botChats.join('\n'),
    userChats: userChats.join('\n'),
  };
};

const reportMessages = (message: IMessage) => {
  if (message.user._id === null || isNaN(message.user._id)) return;
  //대화 내역을 가져오는 함수
  let allMessages: IMessage[] = [];
  const deviceHistory = getNewIMessages();
  if (deviceHistory) {
    const deviceArray = JSON.parse(deviceHistory);
    allMessages.push(...deviceArray);
  }
  const chats = getMessageSet(message, allMessages);
  if (chats === undefined) {
    Alert.alert('신고 접수 실패', '쿠키와 대화를 진행한 후 다시 시도해주세요.');
    return;
  }

  reportChat(
    Number(message.user._id),
    chats.userChats,
    chats.botChats,
    new Date(message.createdAt).toISOString(),
  ).finally(() => {
    Alert.alert('신고 접수', '신고가 접수되었습니다. 감사합니다!');
  });
};

const confirmReport = (message: IMessage) => {
  Alert.alert(
    '대화를 신고하시겠습니까?',
    '대화 신고 시 해당 대화를 비식별화 처리를 통해 개인정보 제거 후 신고가 접수됩니다. ',
    [
      // 버튼 배열
      {
        text: '아니오', // 버튼 제목
        style: 'cancel',
      },
      { text: '신고하기', onPress: () => reportMessages(message) },
    ],
  );
};

export const RenderBubble = (props: BubbleProps<IMessage>) => {
  const showReport = (): boolean => {
    const nowMessageUserId = props.currentMessage.user._id;
    //check is bot message
    if (nowMessageUserId === null || isNaN(nowMessageUserId) || Number(nowMessageUserId) <= 0)
      return false;

    //check is last bot chat
    const nextMessageUserId =
      props.nextMessage && props.nextMessage.user && props.nextMessage.user._id
        ? props.nextMessage.user._id
        : null;
    if (nextMessageUserId === null) return true;
    if (nextMessageUserId !== null && isNaN(nextMessageUserId) && Number(nextMessageUserId) > 0)
      return true;
    if (
      props.nextMessage &&
      new Date(props.nextMessage.createdAt).getTime() -
        new Date(props.currentMessage.createdAt).getTime() >=
        10 * 1000
    )
      return true;
    return false;
  };

  return (
    <Animated.View
      key={props.currentMessage._id}
      entering={FadeInDown}
      style={css`
        flex-direction: ${props.position === 'left' ? 'row' : 'row-reverse'};
        align-items: end;
        justify-content: start;
        gap: ${rsWidth * 6 + 'px'};
      `}>
      <TouchableOpacity activeOpacity={1} onLongPress={props.onLongPress}>
        <View>
          <Bubble
            {...props}
            renderTime={() => null}
            textStyle={{
              left: css`
                color: ${palette.neutral[500]};
                font-family: Pretendard-Regular;
                font-size: ${rsFont * 14 + 'px'};
                text-align: left;
                margin-top: 0;
                margin-bottom: 0;
                margin-left: 0;
                margin-right: 0;
              `,
              right: css`
                color: #fff;
                font-family: Pretendard-Regular;
                font-size: ${rsFont * 14 + 'px'};
                text-align: left;
                margin-top: 0;
                margin-bottom: 0;
                margin-left: 0;
                margin-right: 0;
              `,
            }}
            wrapperStyle={{
              left: css`
                max-width: ${rsWidth * 200 + 'px'};
                background-color: ${palette.neutral[100]};
                padding-horizontal: ${rsWidth * 12 + 'px'};
                padding-vertical: ${rsHeight * 8 + 'px'};
                margin: 0px;
              `,
              right: css`
                max-width: ${rsWidth * 200 + 'px'};
                background-color: ${palette.primary[500]};
                padding-horizontal: ${rsWidth * 12 + 'px'};
                padding-vertical: ${rsHeight * 8 + 'px'};
                margin: 0px;
              `,
            }}
          />
        </View>
      </TouchableOpacity>

      {showReport() && (
        <TouchableOpacity activeOpacity={1} onPress={() => confirmReport(props.currentMessage)}>
          <View
            style={css`
              flex: 1;
              justify-content: flex-end;
            `}>
            <Icon name="favorite-icon" width={rsWidth * 14 + 'px'} height={rsHeight * 14 + 'px'} />
          </View>
        </TouchableOpacity>
      )}

      {props.renderTime && props.renderTime({ ...props })}
    </Animated.View>
  );
};

export const RenderAvatar = (props: AvatarProps<IMessage>) => {
  const { position, currentMessage, previousMessage } = props;
  if (position !== 'left') return null;

  const isPreviousUserExist =
    previousMessage !== undefined &&
    previousMessage._id !== undefined &&
    previousMessage.user !== undefined &&
    previousMessage.user._id !== undefined;

  const avatarShow: boolean =
    !isPreviousUserExist ||
    previousMessage.user._id !== currentMessage.user._id ||
    new Date(currentMessage.createdAt).getTime() - new Date(previousMessage.createdAt).getTime() >
      10 * 1000;

  return (
    <View
      style={css`
        width: ${rsWidth * 35 + 'px'};
        height: ${rsHeight * 35 + 'px'};
      `}>
      {avatarShow && (
        <Avatar
          {...props}
          imageStyle={{
            left: css`
              width: ${rsWidth * 35 + 'px'};
              height: ${rsHeight * 35 + 'px'};
            `,
          }}
        />
      )}
    </View>
  );
};

export const RenderTime = (props: TimeProps<IMessage>) => {
  props.timeFormat = 'A h:mm';
  return (
    <Time
      {...props}
      containerStyle={{
        left: {
          marginLeft: 0,
          marginRight: 0,
          marginBottom: 0,
          justifyContent: 'flex-end',
        },
        right: {
          marginLeft: 0,
          marginRight: 0,
          marginBottom: 0,
          justifyContent: 'flex-end',
        },
      }}
      timeTextStyle={{
        left: {
          color: palette.neutral[400],
          fontSize: rsFont * 10,
          fontFamily: 'Pretendard-Regular',
          textAlign: 'center',
          margin: 0,
        },
        right: {
          color: palette.neutral[400],
          fontSize: rsFont * 10,
          fontFamily: 'Pretendard-Regular',
          textAlign: 'center',
          margin: 0,
        },
      }}
    />
  );
};

//보내기 버튼
/*
export const RenderSend = (props: SendProps<IMessage>, sendingStatus: boolean) => {
  return (
    <View
      style={{
        backgroundColor: 'pink',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
      }}>
      <Send
        {...props}
        disabled={sendingStatus}
        containerStyle={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: rsWidth * 15,
          //width: rsWidth * 30,
          //height: rsWidth * 30,
          //borderRadius: (rsWidth * 30) / 2,
          //backgroundColor: 'yellow',
        }}>
        <Icon name="airplane" />
      </Send>
    </View>
  );
};*/

export const RenderDay = (props: DayProps) => {
  props.dateFormat = 'YYYY년 MM월 DD일';
  return (
    <Day
      {...props}
      wrapperStyle={{
        paddingTop: rsHeight * 20,
        paddingBottom: rsHeight * 8,
        paddingHorizontal: rsWidth * 10,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      textStyle={{
        fontFamily: 'Pretendard-Regular',
        fontSize: 12 * rsFont,
        color: palette.neutral[400],
      }}
    />
  );
};

export const RenderSystemMessage = (props: SystemMessageProps<IMessage>) => {
  return (
    <SystemMessage
      {...props}
      wrapperStyle={{
        paddingTop: rsHeight * 20,
        paddingBottom: rsHeight * 8,
        paddingHorizontal: rsWidth * 10,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      textStyle={{
        fontFamily: 'Pretendard-Regular',
        fontSize: 12 * rsFont,
        color: palette.neutral[400],
      }}
    />
  );
};

//props: SendProps<IMessage>, sendingStatus: boolean
//커스텀 인풋 툴 바
export const RenderInputToolbar = (props: InputToolbarProps<IMessage>, sendingStatus: boolean) => (
  <InputToolbar
    {...props}
    containerStyle={{
      borderTopColor: 'transparent',
      //backgroundColor: palette.neutral[50],
      //backgroundColor: 'green',
      display: 'flex',
      flexDirection: 'row', // row로 두어야 Input과 Send 버튼이 나란히 배치됨
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: rsWidth * 20,
      paddingVertical: rsHeight * 8,
      gap: rsWidth * 20,
    }}
    renderComposer={(composerProps) => (
      <CustomMultiTextInput value={composerProps.text} onChangeText={composerProps.onTextChanged} />
    )}
    renderSend={(sendProps) => (
      <Send
        {...props}
        disabled={sendingStatus}
        containerStyle={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          marginLeft: 20 * rsWidth,
        }}>
        <Icon name="airplane" color={sendingStatus ? palette.neutral[300] : palette.neutral[400]} />
      </Send>
    )}
  />
);

export const RenderLoading = () => (
  <View
    style={css`
      flex: 1;
      justify-content: center;
      align-items: center;
    `}>
    <ActivityIndicator size="large" color={palette.primary[500]} />
  </View>
);

export const RenderCustomView = (props: BubbleProps<IMessage>) => <></>;

//메세지 도착하기 전에 나오는 ... 애니메이션
export const RenderFooter = (sending: boolean) => {
  if (!sending) return <></>;
  return (
    <View
      style={{
        marginLeft: 8,
        gap: 8,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        //backgroundColor: 'red',
      }}>
      <Image
        source={require('../../../assets/images/cookieprofile.png')}
        //source={require('../../../assets/images/cookieprofilechristmas.png')}
        style={{ objectFit: 'contain', width: 35 * rsWidth, height: 35 * rsHeight }}
      />
      <TypingIndicator isTyping={sending} />
    </View>
  );
};
