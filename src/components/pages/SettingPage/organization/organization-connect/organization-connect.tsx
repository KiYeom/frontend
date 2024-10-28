import { css } from '@emotion/native';
import React, { useEffect } from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
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

const validateCode = (code: string): 'error' | 'default' | 'correct' => {
  if (code.length !== 0 && (code.length < 2 || code.length > 15)) return 'error';
  else if (code.length >= 2 && code.length <= 15) return 'correct';
  else return 'default';
};

const OrganizationConnect: React.FC = ({ navigation }) => {
  const [code, setCode] = React.useState('');
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
        <CTAContainer>
          <Button
            title={loading ? '연결 중...' : '연결하기'}
            disabled={!(validateCode(code) === 'correct') || loading}
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
export default OrganizationConnect;
