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
import { saveFavoriteChatLog } from '../../../apis/chatting';
import { useRef } from 'react';
import UpDownBtn from '../../../components/up-down-button/UpDownBtn';
import { ExtendedIMessage } from '../../../utils/chatting';
import HighlightedMessageText from './HighlightMessageText';
import Analytics from '../../../utils/analytics';
const getMessageSet = (
  currentMessage: ExtendedIMessage,
  allMessages: ExtendedIMessage[],
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

// 클릭한 말풍선의 모든 대화를 만드는 함수 (ex. 67e8218282ca763945508719-B-5)
const generateIdList = (clickedId: string): string[] => {
  console.log('clickedId', clickedId);
  const parts = clickedId.split('-');
  const maxIndex = parseInt(parts.pop() || '0', 10); // 마지막 숫자 추출
  const baseId = parts.join('-') + '-'; // 나머지 부분을 재조합하여 기본 id를 만듭니다.

  const idList: string[] = [];
  for (let i = 0; i <= maxIndex; i++) {
    idList.push(baseId + i);
  }
  console.log('idList', idList);
  return idList;
};

export const reportMessages = async (messageId: string, isSaved: boolean): string | undefined => {
  //console.log('reportMessags 실행', messageId);
  if (messageId === null) return;
  //const isSaved: boolean = true;
  const res = await saveFavoriteChatLog(messageId, !isSaved);
  //console.log('res', res);
  return messageId;
};

export const RenderBubble = (
  props: BubbleProps<ExtendedIMessage> & { onFavoritePress: (messageId: string) => void },
) => {
  const showReport = (): boolean => {
    const nowMessageUserId = props.currentMessage.user._id;
    if (props.currentMessage._id === 'welcomeMessage') return false;
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
      //onLayout={handleMessageLayout(props.currentMessage._id)}
      key={props.currentMessage._id}
      entering={FadeInDown}
      style={{
        flexDirection: props.position === 'left' ? 'row' : 'row-reverse',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        gap: rsHeight * 8,
        // gap 대신 자식에 margin 적용
      }}>
      <TouchableOpacity activeOpacity={1} onLongPress={props.onLongPress}>
        <View>
          <Bubble
            {...props}
            renderTime={() => null}
            renderMessageText={() => (
              <HighlightedMessageText
                text={props.currentMessage.text}
                highlight={props.currentMessage.hightlightKeyword}
                checkUserOrBot={props.currentMessage.user.name} //name : 쿠키, 나
              />
            )}
            textStyle={{
              left: css`
                //color: ${palette.neutral[500]};
                color: red;
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
        <View
          style={css`
            justify-content: flex-end;
          `}>
          <Icon
            name="favorite-icon"
            width={rsWidth * 14 + 'px'}
            height={rsHeight * 14 + 'px'}
            toggleable
            isSaved={props.currentMessage.isSaved}
            messageId={'testMessageId'}
            onFavoritePress={(id) => {
              //console.log('메세지', props.currentMessage);
              //reportMessages(props.currentMessage._id, props.currentMessage.isSaved);
              //console.log('icon에서의 press 함수', props.currentMessage._id);
              props.onFavoritePress(props.currentMessage._id);
              Analytics.clickChatLikeButton(props.currentMessage._id);
            }}
          />
        </View>
      )}

      {props.renderTime && props.renderTime({ ...props })}
    </Animated.View>
  );
};

export const RenderAvatar = (props: AvatarProps<ExtendedIMessage>) => {
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

export const RenderTime = (props: TimeProps<ExtendedIMessage>) => {
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
        backgroundColor: 'transparent',
      }}
      textStyle={{
        fontFamily: 'Pretendard-Regular',
        fontSize: 12 * rsFont,
        color: palette.neutral[400],
      }}
    />
  );
};

export const RenderSystemMessage = (props: SystemMessageProps<ExtendedIMessage>) => {
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
export const RenderInputToolbar = (
  props: InputToolbarProps<ExtendedIMessage>,
  sendingStatus: boolean,
  isSearchMode: boolean,
  enableUp?: boolean,
  enableDown?: boolean,
  setEnableUp?: React.Dispatch<React.SetStateAction<boolean>>,
  setEnableDown?: React.Dispatch<React.SetStateAction<boolean>>,
  handleSearch?: (text: string, direction: null | 'up' | 'down') => Promise<string | null>,
  searchWord?: string,
) =>
  !isSearchMode ? (
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
        <CustomMultiTextInput
          value={composerProps.text}
          onChangeText={composerProps.onTextChanged}
        />
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
          <Icon
            name="airplane"
            color={sendingStatus ? palette.neutral[300] : palette.neutral[400]}
          />
        </Send>
      )}
    />
  ) : (
    <>
      <View>
        {/*<Text>히히헤헤</Text>*/}
        <UpDownBtn
          enableUp={enableUp}
          enableDown={enableDown}
          handleSearch={handleSearch}
          searchWord={searchWord}></UpDownBtn>
      </View>
    </>
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

export const RenderCustomView = (props: BubbleProps<ExtendedIMessage>) => <></>;

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
