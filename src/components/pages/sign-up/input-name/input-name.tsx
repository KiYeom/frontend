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
import { Checkbox } from 'react-native-ui-lib';
import { updateUserProfile } from '../../../../apis/auth';
import palette from '../../../../assets/styles/theme';
import Analytics from '../../../../utils/analytics';
import { UseSigninStatus } from '../../../../utils/signin-status';
import { setInfoWhenLogin, setUserNickname } from '../../../../utils/storageUtils';
import Button from '../../../button/button';
import Input from '../../../input/input';
import {
  Annotation,
  ContentContainer,
  TermsContainer,
  Title,
  TitleContainer,
} from './input-name.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { rsWidth } from '../../../../utils/responsive-size';

const validateName = (name: string): 'error' | 'default' | 'correct' => {
  if (name.length !== 0 && (name.length < 2 || name.length > 15)) return 'error';
  else if (name.length >= 2 && name.length <= 15) return 'correct';
  else return 'default';
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

  const guestModeSignUp = async () => {
    if (name) {
      const res = await updateUserProfile({
        nickname: name,
        gender: null,
        birthdate: null,
      });

      if (res) {
        setInfoWhenLogin(
          '' + res.nickname,
          res.birthdate,
          res.gender,
          res.accessToken,
          res.refreshToken,
          res.notice,
        );
        setSigninStatus(true);
        return true;
      }
      return false;
    }
    return false;
  };

  const saveNickName = (nickname: string) => {
    console.log('isGuestMode', isGuestMode);
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

  const isButtonEnabled = isGuestMode
    ? validateName(name) === 'correct' && !loading && legalAllowed
    : validateName(name) === 'correct' && !loading && legalAllowed && privacyAllowed && fourth;

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
            <Annotation>만나서 반가워요💚</Annotation>
            <Title>쿠키가 불러드릴{'\n'}닉네임만 알려주세요🐶</Title>
          </TitleContainer>
          <ContentContainer>
            <Input
              placeholder="닉네임만 입력하면 바로 시작!🚀"
              status={validateName(name)}
              message="2~15 글자 사이의 닉네임을 지어주세요"
              withMessage={true}
              onChange={(text) => {
                if (text.length < 15) setName(text);
              }}
              value={name}
            />
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
                <Checkbox
                  value={allowGuestMode}
                  onValueChange={() => {
                    setAllowGuestMode(!allowGuestMode);
                  }}
                  label={'비회원 사용자는 앱 삭제 시 모든 데이터가 소멸됩니다'}
                  color={allowGuestMode ? palette.primary[400] : palette.neutral[200]}
                  labelStyle={{ fontSize: 14 }} //라벨 스타일링
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
              <Checkbox
                value={legalAllowed}
                onValueChange={() => {
                  setLegalAllowed(!legalAllowed);
                }}
                label={'서비스 이용약관에 동의합니다.'}
                color={legalAllowed ? palette.primary[400] : palette.neutral[200]}
                labelStyle={{ fontSize: 14 }} //라벨 스타일링
              />
            </TouchableOpacity>

            {!isGuestMode && (
              <>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    setPrivacyAllowed(!privacyAllowed);
                  }}>
                  <Checkbox
                    value={privacyAllowed}
                    onValueChange={() => {
                      setPrivacyAllowed(!privacyAllowed);
                    }}
                    label={'개인정보 처리방침에 동의합니다.'}
                    color={privacyAllowed ? palette.primary[400] : palette.neutral[200]}
                    labelStyle={{ fontSize: 14 }} //라벨 스타일링
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    setFourth(!fourth);
                  }}>
                  <Checkbox
                    value={fourth}
                    onValueChange={() => {
                      setFourth(!fourth);
                    }}
                    label={'만 14세 이상입니다'}
                    color={fourth ? palette.primary[400] : palette.neutral[200]}
                    labelStyle={{ fontSize: 14 }} //라벨 스타일링
                  />
                </TouchableOpacity>
              </>
            )}
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
              onPress={() => {
                Analytics.clickSignUpSaveButton();
                saveNickName(name);
              }}
            />
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default InputName;
