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
  Message,
} from 'react-native-gifted-chat';
import palette from '../../../assets/styles/theme';
import { css } from '@emotion/native';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';
import { ActivityIndicator, View } from 'react-native';
import Icon from '../../icons/icons';

export const RenderBubble = (props: BubbleProps<IMessage>) => {
  return (
    <View
      style={css`
        flex-direction: ${props.position === 'left' ? 'row' : 'row-reverse'};
        align-items: end;
        justify-content: start;
        gap: ${rsWidth * 8 + 'px'};
        //background-color: pink;
      `}>
      <View>
        <Bubble
          {...props}
          renderTime={() => null}
          textStyle={{
            left: {
              color: palette.neutral[500],
              fontFamily: 'Pretendard-Regular',
              fontSize: 14,
              textAlign: 'left',
              marginTop: 0,
              marginBottom: 0,
              marginLeft: 0,
              marginRight: 0,
            },
            right: {
              color: '#fff',
              fontFamily: 'Pretendard-Regular',
              fontSize: 14,
              textAlign: 'left',
              marginTop: 0,
              marginBottom: 0,
              marginLeft: 0,
              marginRight: 0,
            },
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
      {props.renderTime && props.renderTime({ ...props })}
    </View>
  );
};

export const RenderAvatar = (props: AvatarProps<IMessage>) => {
  const { position } = props;
  if (position !== 'left') return null;
  return (
    <Avatar
      {...props}
      imageStyle={{
        left: {
          width: 35 * rsWidth,
          height: 35 * rsHeight,
        },
      }}
      containerStyle={{
        left: {
          borderWidth: 2,
          //backgroundColor: 'red',
          marginRight: 8 * rsWidth,
        },
      }}
    />
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
