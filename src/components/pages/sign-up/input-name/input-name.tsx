import { css } from '@emotion/native';
import React from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { updateUserProfile } from '../../../../apis/auth';
import { AuthStackName } from '../../../../constants/Constants';
import { UseSigninStatus } from '../../../../utils/signin-status';
import { setInfoWhenLogin, setUserNickname } from '../../../../utils/storageUtils';
import Button from '../../../button/button';
import Input from '../../../input/input';
import {
  Annotation,
  ContentContainer,
  CTAContainer,
  Title,
  TitleContaienr,
} from './input-name.styles';

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
    if (!isGuestMode) {
      navigation.navigate(AuthStackName.InputProfile);
      setLoading(false);
    } else {
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
    }
  };

  return (
    <TouchableWithoutFeedback onPressIn={Keyboard.dismiss}>
      <View
        style={css`
          flex: 1;
        `}>
        <TitleContaienr>
          <Annotation>만나서 반가워요!</Annotation>
          <Title>쿠키에게 당신의{'\n'}닉네임을 알려주세요.</Title>
        </TitleContaienr>
        <ContentContainer>
          <Input
            placeholder="내용을 입력해주세요."
            status={validateName(name)}
            message="2~15 글자 사이의 닉네임을 지어주세요!"
            withMessage={true}
            onChange={(text) => {
              if (text.length < 15) setName(text);
            }}
            value={name}
          />
        </ContentContainer>
        <CTAContainer>
          <Button
            title="저장"
            disabled={!(validateName(name) === 'correct') || loading}
            primary={true}
            onPress={() => saveNickName(name)}
          />
        </CTAContainer>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default InputName;
