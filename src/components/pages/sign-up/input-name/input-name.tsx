import { css } from '@emotion/native';
import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { AuthStackName } from '../../../../constants/Constants';
import { setUserNickname } from '../../../../utils/storageUtils';
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

const InputName = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [name, setName] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const saveNickName = async (nickname: string) => {
    setLoading(true);
    setUserNickname(nickname);
    setLoading(false);
    navigation.navigate(AuthStackName.InputProfile);
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
