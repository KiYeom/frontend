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
import palette from '../../../assets/styles/theme';
import { css } from '@emotion/native';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import Icon from '../../icons/icons';
import TypingIndicator from 'react-native-gifted-chat/src/TypingIndicator';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { reportChat } from '../../../apis/chatting';

const reportMessages = (message: IMessage) => {
  if (message.user._id === null || isNaN(message.user._id)) return;
  reportChat(
    Number(message.user._id),
    message.text,
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

      {typeof props.currentMessage.user._id === 'number' && props.currentMessage.user._id > 0 && (
        <TouchableOpacity activeOpacity={1} onPress={() => confirmReport(props.currentMessage)}>
          <View
            style={css`
              flex: 1;
              justify-content: flex-end;
              padding-bottom: ${rsHeight * 4 + 'px'};
            `}>
            <Icon
              name="warning"
              width={rsWidth * 14 + 'px'}
              height={rsHeight * 14 + 'px'}
              color={palette.neutral[400]}
            />
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

export const RenderSend = (props: SendProps<IMessage>, sendingStatus: boolean) => {
  return (
    <View>
      <Send
        {...props}
        disabled={sendingStatus}
        containerStyle={{ justifyContent: 'center', paddingHorizontal: rsWidth * 15 }}>
        <Icon name="airplane" />
      </Send>
    </View>
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

export const RenderInputToolbar = (props: InputToolbarProps<IMessage>) => (
  <InputToolbar
    {...props}
    containerStyle={{
      borderTopColor: 'transparent',
      backgroundColor: palette.neutral[50],
      marginHorizontal: rsWidth * 20,
      marginVertical: rsHeight * 8,
      borderRadius: 10,
    }}
  />
);

export const RenderComposer = (props: ComposerProps, disable: boolean = false) => (
  <Composer {...props} multiline={false} disableComposer={disable} />
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

export const RenderFooter = (sending: boolean) => {
  if (!sending) return <></>;
  return (
    <View
      style={{
        marginLeft: 8,
        gap: 8,
        flexDirection: 'row',
        justifyContent: 'flex-start',
      }}>
      <Image
        source={require('../../../assets/images/cookieprofile.png')}
        style={{ objectFit: 'contain', width: 35 * rsWidth, height: 35 * rsHeight }}
      />
      <TypingIndicator isTyping={sending} />
    </View>
  );
};
