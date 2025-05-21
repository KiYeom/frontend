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
import Analytics from '../../../utils/analytics';
import * as ImagePicker from 'expo-image-picker';
import { useState, RefObject } from 'react';
import ImageShow from '../../../components/image-show/ImageShow';
import { MAX_CHAT_IMAGE_WIDTH } from '../../../constants/Constants';
import * as Haptics from 'expo-haptics';

export const reportMessages = async (messageId: string, isSaved: boolean): string | undefined => {
  //console.log('reportMessags 실행', messageId);
  if (messageId === null) return;
  //const isSaved: boolea = true;
  const res = await saveFavoriteChatLog(messageId, !isSaved);
  //console.log('res', res);
  return messageId;
};

export const RenderBubble = (
  props: BubbleProps<ExtendedIMessage> & { onFavoritePress: (messageId: string) => void },
) => {
  //console.log('renderBubble', props.currentMessage);
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
  const [scaledSize, setScaledSize] = useState({ width: 148, height: 300 });

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
          //console.error('이미지 크기를 가져오는데 실패함:', error);
        },
      );
    }
  }, [props?.currentMessage?.image]);

  if (isImage) {
    //console.log('이미지 렌더링 진행');
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
  const isSameSender =
    props.previousMessage &&
    props.previousMessage.user &&
    props.previousMessage.user._id === props.currentMessage.user._id;

  // 간격 설정: 동일 그룹이면 5px, 다르면 10px (반응형 값 사용)
  const bubbleSpacing = isSameSender ? rsHeight * 5 : rsHeight * 10;
  return (
    <Animated.View
      //onLayout={handleMessageLayout(props.currentMessage._id)}
      key={props.currentMessage._id}
      entering={FadeInDown}
      style={css`
        flex-direction: ${props.position === 'left' ? 'row' : 'row-reverse'};
        align-items: flex-end;
        justify-content: flex-start;
        gap: ${rsWidth * 6 + 'px'}; //말풍선과 시간 사이의 간격
        /* 아래쪽 margin으로 메세지 간 간격 적용 */
        margin-bottom: ${rsHeight * 5 + 'px'};
      `}>
      <TouchableOpacity activeOpacity={1} onLongPress={props.onLongPress}>
        <View
          style={css`
            //margin-bottom: ${rsHeight * 5 + 'px'};
            //background-color: black;
            margin-bottom: 0;
            flex-direction: column;
            flex: 1;
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
                flex: 1;
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
                flex: 1;
              `,
            }}
          />
        </View>
      </TouchableOpacity>

      {showReport() && (
        <>
          <TouchableOpacity
            style={css`
              justify-content: flex-end;
              flex-direction: row;
              //background-color: yellow;
              //padding: 10px;
            `}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
            <Icon
              name="favorite-icon"
              width={rsWidth * 14 + 'px'}
              height={rsHeight * 14 + 'px'}
              toggleable
              isSaved={props.currentMessage.isSaved}
              messageId={props.currentMessage._id}
              onFavoritePress={(id) => {
                props.onFavoritePress(props.currentMessage._id);
                Analytics.clickChatLikeButton(props.currentMessage._id);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft); // 좋아요 터치 시 진동 피드백
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              console.log('신고하기 클릭됨');
            }}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
            <Icon name="dislike" width={rsWidth * 14 + 'px'} height={rsHeight * 14 + 'px'} />
          </TouchableOpacity>
        </>
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
      lightboxProps={{
        disabled: true,
      }}
      imageStyle={{
        width: scaledSize.width,
        height: scaledSize.height,
        resizeMode: 'contain',
      }}
      containerStyle={{
        margin: 0,
        padding: 0,
        backgroundColor: 'transparent',
      }}
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
          //backgroundColor: 'blue',
        },
        right: {
          marginLeft: 0,
          marginRight: 0,
          marginBottom: 0,
          justifyContent: 'flex-end',
          //backgroundColor: 'pink',
        },
      }}
      timeTextStyle={{
        left: {
          color: palette.neutral[500],
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

export const RenderSystemMessage = (props: Props<ExtendedIMessage>) => {
  return (
    <SystemMessage
      {...props}
      wrapperStyle={{
        //paddingTop: rsHeight * 20,
        //paddingHorizontal: rsHeight * 8,
        paddingHorizontal: rsWidth * 10,
        paddingVertical: rsHeight * 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        //backgroundColor: 'pink',
        backgroundColor: palette.neutral[900],
        width: rsWidth * 200,
        borderRadius: 10,
      }}
      textStyle={{
        fontFamily: 'Pretendard-Regular',
        fontSize: 12 * rsFont,
        color: palette.neutral[50],
        //color: 'red',
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
  textInputRef?: RefObject<TextInput>,
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
          //backgroundColor: 'green',
          display: 'flex',
          flexDirection: 'row', // row로 두어야 Input과 Send , 사진 버튼이 나란히 배치됨
          justifyContent: 'center',
          alignItems: 'center',
          //paddingHorizontal: rsWidth * 15,
          paddingVertical: rsHeight * 8,
          position: 'relative',
        }}
        renderActions={(actionProps) => (
          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => {
              console.log('액션 버튼 클릭됨');
              Analytics.clickAddPicButtonInChatting();
              pickImage();
            }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              padding: 0,
              margin: 0,
              width: 35,
              height: 35,
              borderRadius: 50,
              backgroundColor: palette.neutral[100],
              marginLeft: 10,
            }}>
            <Icon
              name="picture-icon"
              width={rsWidth * 20}
              height={rsHeight * 20}
              color={palette.neutral[400]}
            />
          </TouchableOpacity>
        )}
        renderComposer={(composerProps) => (
          <CustomMultiTextInput
            value={composerProps.text}
            onChangeText={composerProps.onTextChanged}
            setInputHeight={setInputHeight}
            textInputRef={textInputRef}
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
              marginRight: 10,
              //marginLeft: 15 * rsWidth,
              //backgroundColor: 'yellow',
            }}>
            <TouchableOpacity
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{
                width: 35,
                height: 35,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                borderRadius: 50,
                backgroundColor: palette.neutral[100],
              }}
              onPress={async () => {
                if (sendingStatus) return;
                const imageUrl = image;

                // 텍스트와 이미지 모두 있을 때: 두 개의 메시지 전송
                if (sendProps.text && image && image.length > 0) {
                  sendProps.onSend(
                    [
                      {
                        ...sendProps.currentMessage,
                        text: sendProps.text,
                        // 필요한 경우 고유 ID와 생성 시각 추가
                        // _id: uuid(),
                        // createdAt: new Date(),
                      },
                      {
                        ...sendProps.currentMessage,
                        image: imageUrl,
                        text: ' ', // 텍스트 말풍선에 영향이 없도록 공백 문자 사용
                      },
                    ],
                    true,
                  );
                  return;
                }

                // 이미지만 있는 경우: 이미지 메시지 하나 전송
                if (image && image.length > 0) {
                  sendProps.onSend(
                    [
                      {
                        ...sendProps.currentMessage,
                        image: imageUrl,
                        text: ' ', // 텍스트 말풍선이 생성되지 않도록 처리
                      },
                    ],
                    true,
                  );
                  return;
                }

                // 텍스트만 있는 경우: 텍스트 메시지 하나 전송
                if (sendProps.text && sendProps.text.length > 0) {
                  sendProps.onSend(
                    [
                      {
                        ...sendProps.currentMessage,
                        text: sendProps.text,
                      },
                    ],
                    true,
                  );
                  return;
                }
                // 텍스트도 이미지도 없는 경우는 아무 작업도 하지 않습니다.
              }}>
              <Icon
                name="airplane"
                color={sendingStatus ? palette.neutral[300] : palette.neutral[400]}
              />
            </TouchableOpacity>
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
