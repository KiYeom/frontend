import {
  View,
  Text,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import {
  Annotation,
  ContentContainer,
  CTAContainer,
  Title,
  TitleContaienr,
} from './input-name.styles';
import React, { useCallback, useEffect } from 'react';
import Button from '../../../button/button';
import Input from '../../../input/input';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { css } from '@emotion/native';

const validateName = (name: string): 'error' | 'default' | 'correct' => {
  if (name.length !== 0 && (name.length < 2 || name.length > 15)) return 'error';
  else if (name.length >= 2 && name.length <= 15) return 'correct';
  else return 'default';
};

const InputName = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [name, setName] = React.useState('');

  const saveName = async (name: string) => {
    await AsyncStorage.setItem('name', name);
    navigation.navigate('input-profile');
  };

  return (
    <TouchableWithoutFeedback onPressIn={Keyboard.dismiss}>
      <View
        style={css`
          flex: 1;
        `}>
        <TitleContaienr>
          <Annotation>만나서 반가워요!</Annotation>
          <Title>쿠키에게 당신의{'\n'}이름을 알려주세요.</Title>
        </TitleContaienr>
        <ContentContainer>
          <Input
            placeholder="내용을 입력해주세요."
            status={validateName(name)}
            message="2~15 글자 사이의 이름을 지어주세요!"
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
            disabled={!(validateName(name) === 'correct')}
            primary={true}
            onPress={() => saveName(name)}
          />
        </CTAContainer>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default InputName;
