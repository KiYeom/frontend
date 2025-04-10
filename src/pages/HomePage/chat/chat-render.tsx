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
  Actions,
  MessageImage,
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
import { getNewIMessages } from '../../../utils/storageUtils';
import Input from '../../../components/input/input';
import { transparent } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import { saveFavoriteChatLog } from '../../../apis/chatting';
import { useRef, useEffect } from 'react';
import UpDownBtn from '../../../components/up-down-button/UpDownBtn';
import { ExtendedIMessage } from '../../../utils/chatting';
import HighlightedMessageText from './HighlightMessageText';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import ImageShow from '../../../components/image-show/ImageShow';
import Analytics from '../../../utils/analytics';
import { MAX_CHAT_IMAGE_WIDTH } from '../../../constants/Constants';

export const reportMessages = async (messageId: string, isSaved: boolean): string | undefined => {
  console.log('reportMessags 실행', messageId);
  if (messageId === null) return;
  //const isSaved: boolean = true;
  const res = await saveFavoriteChatLog(messageId, !isSaved);
  console.log('res', res);
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
  const isImage = !!props?.currentMessage?.image;
  const [scaledSize, setScaledSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (isImage && props?.currentMessage?.image) {
      Image.getSize(
        props?.currentMessage?.image,
        (width, height) => {
          const maxWidth = rsWidth * MAX_CHAT_IMAGE_WIDTH; // 원하는 최대 너비
          const scaleFactor = maxWidth / width;

          setScaledSize({
            width: maxWidth,
            height: height * scaleFactor,
          });
        },
        (error) => {
          console.error('이미지 크기를 가져오는데 실패함:', error);
        },
      );
    }
  }, [props?.currentMessage?.image]);

  if (isImage) {
    return (
      <View
        style={css`
          flex-direction: ${props.position === 'left' ? 'row' : 'row-reverse'};
          align-items: flex-end;
          gap: ${rsWidth * 6 + 'px'};
          margin-bottom: ${rsHeight * 5 + 'px'};
          //background-color: blue;
        `}>
        <RenderMessageImage {...props} scaledSize={scaledSize} />

        {/* 시간 표시 */}
        {props.renderTime && props.renderTime({ ...props })}
      </View>
    );
  }
  return (
    <Animated.View
      //onLayout={handleMessageLayout(props.currentMessage._id)}
      key={props.currentMessage._id}
      entering={FadeInDown}
      style={css`
        flex-direction: ${props.position === 'left' ? 'row' : 'row-reverse'};
        align-items: end;
        justify-content: start;
        gap: ${rsWidth * 6 + 'px'}; //말풍선과 시간 사이의 간격
      `}>
      <TouchableOpacity activeOpacity={1} onLongPress={props.onLongPress}>
        <View
          style={css`
            margin-bottom: ${rsHeight * 5 + 'px'};
          `}>
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
                color: ${palette.neutral[500]};
                //color: red;
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
                //background-color: ${props.currentMessage.image ? 'red' : palette.primary[500]};
                padding-horizontal: ${rsWidth * 12 + 'px'};
                /*padding-horizontal: ${props.currentMessage.image
                  ? 0 + 'px'
                  : rsWidth * 12 + 'px'};*/
                padding-vertical: ${rsHeight * 8 + 'px'};
                //padding-vertical: ${props.currentMessage.image ? 0 + 'px' : rsHeight * 8 + 'px'};
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
              console.log('클릭');
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

//1.5.8 이미지 추가
export const RenderMessageImage = (
  props: BubbleProps<ExtendedIMessage> & { scaledSize?: { width: number; height: number } },
) => {
  const { scaledSize = { width: 148, height: 300 } } = props;
  return (
    <MessageImage
      {...props}
      imageStyle={{
        width: scaledSize.width,
        height: scaledSize.height,
        resizeMode: 'contain',
      }}
      containerStyle={{
        margin: 0,
        padding: 0,
        backgroundColor: 'transparent',
      }} // ✅ 올바른 ViewStyle 형태
    />
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
  pickImage?: () => void,
  setInputHeight: (value: number) => void,
  image?: string | null,
  setImage?: (value: string | null) => void,
) =>
  !isSearchMode ? (
    <View>
      {image && (
        <View>
          <ImageShow image={image} setImage={setImage} />
        </View>
      )}
      <InputToolbar
        {...props}
        containerStyle={{
          borderTopColor: 'transparent',
          //backgroundColor: palette.neutral[50],
          backgroundColor: 'green',
          display: 'flex',
          flexDirection: 'row', // row로 두어야 Input과 Send , 사진 버튼이 나란히 배치됨
          justifyContent: 'center',
          alignItems: 'center',
          //paddingHorizontal: rsWidth * 15,
          paddingVertical: rsHeight * 8,
          gap: rsWidth * 20,
          position: 'relative',
        }}
        renderActions={(actionProps) => (
          <Actions
            {...actionProps}
            containerStyle={{
              //backgroundColor: 'red',
              //width: 35 * rsWidth,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              alignSelf: 'center',
              marginRight: 15 * rsWidth,
            }}
            icon={() => (
              <Icon
                name="picture-icon"
                width={rsWidth * 20}
                height={rsHeight * 20}
                color={palette.neutral[400]}
              />
            )}
            onPressActionButton={() => {
              console.log('액션 버튼 클릭됨');
              pickImage();
            }}
          />
        )}
        renderComposer={(composerProps) => (
          <CustomMultiTextInput
            value={composerProps.text}
            onChangeText={composerProps.onTextChanged}
            setInputHeight={setInputHeight}
          />
        )}
        renderSend={(sendProps) => (
          <Send
            {...props}
            disabled={sendingStatus}
            containerStyle={{
              //backgroundColor: 'yellow',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              marginRight: 10 * rsWidth,
              marginLeft: 15 * rsWidth,
              //backgroundColor: 'yellow',
            }}>
            {sendProps.text && image && image.length > 0 ? (
              <TouchableOpacity
                onPress={async () => {
                  if (sendingStatus) return;
                  // 빈 텍스트 대신 ' ' (공백) 문자열을 넣어 onSend를 강제로 호출 (텍스트 없이 사진만 보낸 경우)
                  sendProps.onSend(
                    [
                      {
                        ...sendProps.currentMessage,
                        text: sendProps.text,
                      },
                      {
                        ...sendProps.currentMessage,
                        image: image,
                        text: '', // 텍스트 말풍선에 영향을 주지 않도록 공백 or 없음
                      },
                    ],
                    true,
                  );
                }}>
                <Icon
                  name="airplane"
                  color={sendingStatus ? palette.neutral[300] : palette.neutral[400]}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  if (sendingStatus) return;
                  if (!sendProps.text && !(image && image.length > 0)) {
                    return;
                  }
                  // currentMessage에 text가 없다면 기본값을 넣어줍니다.
                  sendProps.onSend?.(
                    [
                      {
                        ...sendProps.currentMessage,
                        text: sendProps.text ?? '', // 혹은 ' ' 로 공백을 넣어도 좋습니다.
                      },
                    ],
                    true,
                  );
                }}>
                <Icon
                  name="airplane"
                  color={sendingStatus ? palette.neutral[300] : palette.neutral[400]}
                />
              </TouchableOpacity>
            )}
          </Send>
        )}
      />
    </View>
  ) : (
    <>
      {/*<Text>히히헤헤</Text>*/}
      <UpDownBtn
        enableUp={enableUp}
        enableDown={enableDown}
        handleSearch={handleSearch}
        searchWord={searchWord}></UpDownBtn>
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
