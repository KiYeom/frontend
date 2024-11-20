import styled, { css } from '@emotion/native';
import React, { useEffect } from 'react';
import { Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { connectOrganizationApi } from '../../../../../apis/setting';
import { SettingStackName } from '../../../../../constants/Constants';
import Analytics from '../../../../../utils/analytics';
import Button from '../../../../button/button';
import Input from '../../../../input/input';
import {
  Annotation,
  ContentContainer,
  CTAContainer,
  Desc,
  Title,
  TitleContainer,
} from './organization-connect.style';
import { Checkbox } from 'react-native-ui-lib';
import palette from '../../../../../assets/styles/theme';
import { rsHeight, rsWidth } from '../../../../../utils/responsive-size';
import * as WebBrowser from 'expo-web-browser';

const validateCode = (code: string): 'error' | 'default' | 'correct' => {
  if (code.length !== 0 && (code.length < 2 || code.length > 15)) return 'error';
  else if (code.length >= 2 && code.length <= 15) return 'correct';
  else return 'default';
};

const OrganizationConnect: React.FC = ({ navigation }) => {
  const [code, setCode] = React.useState('');
  const [privacyAllowed, setPrivacyAllowed] = React.useState<boolean>(false);
  const [fourth, setFourth] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(false);

  const connectOrganization = (code: string) => {
    setLoading(true);
    connectOrganizationApi(code)
      .then((res) => {
        // connect organization
        if (res && res.result) {
          // connect organization
          navigation.replace(SettingStackName.OrganizationStatus);
          setLoading(false);
        } else {
          // connect organization
          alert('기관 연결에 실패했습니다. \n코드를 다시 확인해주세요.');
          setLoading(false);
        }
      })
      .catch((err) => {
        // connect organization
        alert('기관 연결에 실패했습니다. \n코드를 다시 확인해주세요.');
        setLoading(false);
      })
      .finally(() => {
        // connect organization
        setLoading(false);
      });
  };

  useEffect(() => {
    Analytics.watchConnectScreen();
  }, []);

  return (
    <TouchableWithoutFeedback onPressIn={Keyboard.dismiss}>
      <View
        style={css`
          flex: 1;
        `}>
        <TitleContainer>
          <Annotation>reMIND 기관 연결 페이지</Annotation>
          <Title>기관 코드를 입력하여 {'\n'}기관과 연결하세요.</Title>
          <Desc>걱정하지 마세요. {'\n'}기관 연결은 언제든지 해제할 수 있습니다.</Desc>
        </TitleContainer>
        <ContentContainer>
          <Input
            placeholder="기관 코드를 입력해주세요."
            status={validateCode(code)}
            message="2~15 글자 사이의 코드를 입력하세요!"
            withMessage={true}
            onChange={(text) => {
              if (text.length < 15) setCode(text);
            }}
            value={code}
          />
        </ContentContainer>
        <TermsContainer>
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
              label={'개인정보 제 3자 제공에 대해 동의합니다.'}
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
          <TouchableOpacity
            activeOpacity={1}
            style={{ alignSelf: 'flex-start' }}
            onPress={() =>
              WebBrowser.openBrowserAsync(
                'https://autumn-flier-d18.notion.site/reMIND-3-743f8444696748fe8e3990477a89938a?pvs=4',
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
              약관 보기
            </Text>
          </TouchableOpacity>
        </TermsContainer>
        <CTAContainer>
          <Button
            title={loading ? '연결 중...' : '연결하기'}
            disabled={!(validateCode(code) === 'correct') || loading || !privacyAllowed || !fourth}
            primary={true}
            onPress={() => {
              Analytics.clickConnectButton(code);
              connectOrganization(code);
            }}
          />
        </CTAContainer>
      </View>
    </TouchableWithoutFeedback>
  );
};

export const TermsContainer = styled.View`
  gap: ${rsHeight * 20 + 'px'};
  padding: ${rsHeight * 0 + 'px'} ${rsWidth * 24 + 'px'};
`;

export default OrganizationConnect;
