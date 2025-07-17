import { css } from '@emotion/native';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import {
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { AuthProvider } from '../../constants/Constants';
import { updateUserProfile } from '../../apis/auth';
import palette from '../../assets/styles/theme';
import Analytics from '../../utils/analytics';
import { UseSigninStatus } from '../../utils/signin-status';
import { setInfoWhenLogin, setUserNickname } from '../../utils/storageUtils';
import Button from '../../components/button/Button';
import Input from '../../components/input/Input';
import Icon from '../../components/icons/icons';
import { Checkbox } from 'react-native-paper';
import {
  Annotation,
  ContentContainer,
  TermsContainer,
  Title,
  TitleContainer,
  TitleTextContainter,
  SubTitle,
  ButtonGroupContainer,
  SubContentContainer,
} from './SignUpPage.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { rsWidth, rsHeight } from '../../utils/responsive-size';
import CheckBox from '../../components/checkbox/CheckBox';
import { switchChatTone } from '../../apis/setting';
import {
  checkPurchaseHistory,
  NewLoginInApp,
  tryRestoreEntitlementsForNewUser,
} from '../../services/inappService';

const validateName = (name: string): 'error' | 'default' | 'correct' => {
  if (name.length !== 0 && (name.length < 2 || name.length > 15)) return 'error';
  else if (name.length >= 2 && name.length <= 15) return 'correct';
  else return 'default';
};

const messages = {
  casual: {
    annotation: '만나서 반가워!',
    onboardTitle: `나는 너의 고민을 들어주는\nAI 강아지 쿠키야`,
    setNameTitle: '불러줬으면 하는 이름이 있을까?',
    formatModeTitle: '어떤 말투가 더 편해?',
    placeholder: '쿠키에게 불리고 싶은 이름을 입력해줘',
    nameGuide: '2~15 글자 사이의 닉네임을 지어줘',
  },
  formal: {
    annotation: '만나서 반가워요!',
    onboardTitle: `저는 당신의 고민을 들어주는\nAI 강아지 쿠키라고 해요`,
    setNameTitle: '불러줬으면 하는 이름이 있을까요?',
    formatModeTitle: '어떤 말투가 더 편하신가요?',
    placeholder: '쿠키에게 불리고 싶은 이름을 입력해주세요',
    nameGuide: '2~15 글자 사이의 닉네임을 지어주세요',
  },
};

const InputName = ({ route, navigation }) => {
  const [name, setName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { setSigninStatus } = UseSigninStatus();
  const { isGuestMode } = route.params;
  const insets = useSafeAreaInsets();

  const [legalAllowed, setLegalAllowed] = React.useState<boolean>(false);
  const [privacyAllowed, setPrivacyAllowed] = React.useState<boolean>(false);
  const [fourth, setFourth] = React.useState<boolean>(false);
  const [allowGuestMode, setAllowGuestMode] = React.useState<boolean>(true);
  const [isCasualMode, setIsCasualMode] = React.useState<boolean>(true);

  //전체 회원가입 화면
  const guestModeSignUp = async () => {
    if (name) {
      const res = await updateUserProfile({
        nickname: name,
        gender: null,
        birthdate: null,
      }); //회원가입 진행

      if (res) {
        Analytics.setUser(res.accessToken);
        setInfoWhenLogin(
          '' + res.nickname,
          res.birthdate,
          res.gender,
          res.accessToken,
          res.refreshToken,
          res.notice,
          AuthProvider.Guest,
        );
        setSigninStatus(true);
        await NewLoginInApp(res.accessToken);
        await checkPurchaseHistory();
        return true;
      }
      return false;
    }
    return false;
  };

  const saveNickName = (nickname: string) => {
    setLoading(true);
    setUserNickname(nickname);
    guestModeSignUp()
      .then((res) => {
        if (!res) {
          alert('닉네임을 저장하는데 실패했습니다. 잠시 후 다시 시도해주세요.');
        }
      })
      .catch((error) => {
        alert('닉네임을 저장하는데 실패했습니다. 잠시 후 다시 시도해주세요.');
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const isButtonEnabled =
    validateName(name) === 'correct' && !loading && legalAllowed && privacyAllowed && fourth;

  const messageStyle = isCasualMode ? 'casual' : 'formal';

  useEffect(() => {
    Analytics.watchSignUpScreen();
  }, []);

  return (
    <TouchableWithoutFeedback onPressIn={Keyboard.dismiss}>
      <View
        style={css`
          flex: 1;
          margin-bottom: ${insets.bottom + 'px'};
        `}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <TitleContainer>
            <TitleTextContainter>
              <Annotation>{messages[messageStyle].annotation}</Annotation>
              <Title>{messages[messageStyle].onboardTitle}</Title>
            </TitleTextContainter>
            <View>
              <Icon name="hello-cookie" width={rsWidth * 70} height={rsHeight * 103} />
            </View>
          </TitleContainer>

          <ContentContainer>
            <SubContentContainer>
              <SubTitle>{messages[messageStyle].setNameTitle}</SubTitle>
              <Input
                placeholder={messages[messageStyle].placeholder}
                status={validateName(name)}
                message={messages[messageStyle].nameGuide}
                withMessage={true}
                onChange={(text) => {
                  if (text.length < 15) setName(text);
                }}
                value={name}
              />
            </SubContentContainer>
            <SubContentContainer>
              <SubTitle>{messages[messageStyle].formatModeTitle}</SubTitle>
              <ButtonGroupContainer>
                <TouchableOpacity
                  style={{ width: '45%' }}
                  onPress={() => {
                    //console.log('존댓말 클릭');
                    Analytics.clickFormalChatStyleButton();
                    setIsCasualMode(false);
                  }}>
                  <Button title="존댓말" disabled={isCasualMode} primary={false} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ width: '45%' }}
                  onPress={() => {
                    //console.log('반말 클릭');
                    Analytics.clickInformalChatStyleButton();
                    setIsCasualMode(true);
                  }}>
                  <Button title="반말" disabled={!isCasualMode} primary={false} />
                </TouchableOpacity>
              </ButtonGroupContainer>
            </SubContentContainer>
          </ContentContainer>

          <TermsContainer>
            {isGuestMode && (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
                activeOpacity={1}
                onPress={() => {
                  setLegalAllowed(!legalAllowed);
                }}>
                {/*<Checkbox
                  value={allowGuestMode}
                  onValueChange={() => {
                    setAllowGuestMode(!allowGuestMode);
                  }}
                  label={'비회원 사용자는 앱 삭제 시 모든 데이터가 소멸됩니다'}
                  color={allowGuestMode ? palette.primary[400] : palette.neutral[200]}
                  labelStyle={{ fontSize: 14 }} //라벨 스타일링
                />*/}
                <CheckBox
                  checked={allowGuestMode}
                  onToggle={() => setAllowGuestMode(!allowGuestMode)}
                  message="비회원 사용자는 앱 삭제 시 모든 데이터가 소멸됩니다"
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
              activeOpacity={1}
              onPress={() => {
                setLegalAllowed(!legalAllowed);
              }}>
              <CheckBox
                checked={legalAllowed}
                onToggle={() => setLegalAllowed(!legalAllowed)}
                message="서비스 이용약관에 동의합니다"
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setPrivacyAllowed(!privacyAllowed);
              }}>
              {/*<Checkbox
                value={privacyAllowed}
                onValueChange={() => {
                  setPrivacyAllowed(!privacyAllowed);
                }}
                label={'개인정보 처리방침에 동의합니다.'}
                color={privacyAllowed ? palette.primary[400] : palette.neutral[200]}
                labelStyle={{ fontSize: 14 }} //라벨 스타일링
              />*/}
              <CheckBox
                checked={privacyAllowed}
                onToggle={() => setPrivacyAllowed(!privacyAllowed)}
                message="개인정보 처리방침에 동의합니다"
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setFourth(!fourth);
              }}>
              {/*<Checkbox
                value={fourth}
                onValueChange={() => {
                  setFourth(!fourth);
                }}
                label={'만 14세 이상입니다'}
                color={fourth ? palette.primary[400] : palette.neutral[200]}
                labelStyle={{ fontSize: 14 }} //라벨 스타일링
              />*/}
              <CheckBox
                checked={fourth}
                onToggle={() => setFourth(!fourth)}
                message="만 14세 이상입니다"
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              style={{ alignSelf: 'flex-start' }}
              onPress={() =>
                WebBrowser.openBrowserAsync(
                  'https://autumn-flier-d18.notion.site/reMIND-167ef1180e2d42b09d019e6d187fccfd',
                )
              }>
              <Text
                style={css`
                  justify-content: flex-start;
                  align-items: flex-end;
                  text-family: Pretendard-Regular;
                  color: ${palette.neutral[900]};
                  font-size: 12px;
                `}>
                서비스 전체 약관 보기
              </Text>
            </TouchableOpacity>
          </TermsContainer>

          <View
            style={css`
              display: flex;
              justify-content: center;
              padding: ${rsWidth * 24 + 'px'};
            `}>
            <Button
              title="비밀 채팅하러 가기"
              disabled={!isButtonEnabled}
              primary={true}
              onPress={async () => {
                Analytics.clickSignUpSaveButton();
                saveNickName(name);
                switchChatTone(isCasualMode); //변경 사항을 서버에 patch로 업데이트
              }}
            />
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default InputName;
