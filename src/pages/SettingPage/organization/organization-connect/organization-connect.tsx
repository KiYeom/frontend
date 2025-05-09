import styled, { css } from '@emotion/native';
import React, { useEffect, useRef } from 'react';
import {
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Platform,
  Alert,
} from 'react-native';
import { connectOrganizationApi } from '../../../../apis/setting';
import { SettingStackName } from '../../../../constants/Constants';
import Analytics from '../../../../utils/analytics';
import Button from '../../../../components/button/button';
import Input from '../../../../components/input/input';
import {
  Annotation,
  ContentContainer,
  CTAContainer,
  Desc,
  Title,
  TitleContainer,
} from './organization-connect.style';
import NewCheckBox from '../../../../components/v3-checkbox/NewCheckBox';
import palette from '../../../../assets/styles/theme';
import { rsHeight, rsWidth } from '../../../../utils/responsive-size';
import * as WebBrowser from 'expo-web-browser';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
  InterstitialAd,
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';
import Constants from 'expo-constants';
import { getUserNickname } from '../../../../utils/storageUtils';
import adUnitId from '../../../../utils/advertise';

const validateCode = (code: string): 'error' | 'default' | 'correct' => {
  if (code.length !== 0 && (code.length < 2 || code.length > 15)) return 'error';
  else if (code.length >= 2 && code.length <= 15) return 'correct';
  else return 'default';
};

const appVariant = Constants.expoConfig?.extra?.appVariant;

//const appVariant = Constants.expoConfig?.extra?.appVariant;
/*const adUnitId =
  (appVariant === 'production' || appVariant === 'staging') && userName !== 'Test_remind'
    ? Platform.OS === 'android'
      ? process.env.EXPO_PUBLIC_REWARED_AD_UNIT_ID_ANDROID
      : process.env.EXPO_PUBLIC_REWARED_AD_UNIT_ID_IOS
    : TestIds.REWARDED;*/
//const { APP_ENV } = Constants.expoConfig?.extra || {};
/*const adUnitId2 =
  (APP_ENV === 'production' || APP_ENV === 'staging') && userName !== 'Test_remind'
    ? Platform.OS === 'android'
      ? process.env.EXPO_PUBLIC_REWARED_AD_UNIT_ID_ANDROID
      : process.env.EXPO_PUBLIC_REWARED_AD_UNIT_ID_IOS
    : TestIds.REWARDED;*/

const OrganizationConnect: React.FC = ({ navigation }) => {
  const [code, setCode] = React.useState('');
  const [privacyAllowed, setPrivacyAllowed] = React.useState<boolean>(false);
  const [fourth, setFourth] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(false);
  const insets = useSafeAreaInsets();
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showDebugInfoInAlert = () => {
    // 알림창에 표시될 메시지를 구성합니다.
    const messageParts = [
      `[앱 환경 및 광고 ID 정보]`,
      ``, // 줄바꿈을 위한 빈 문자열
      `■ 사용자 이름 (getUserNickname):`,
      `  ${getUserNickname}`,
      ``,
      `■ 직접 설정된 광고 ID (adUnitId by advertise.ts):`,
      `  ${adUnitId || 'N/A'}`,
      ``,
      `■ Google 테스트 ID (TestIds.REWARDED):`,
      `  ${TestIds.REWARDED || 'N/A'}`,
      ``,
      `■ 현재 빌드 상태 (appVariant):`,
      `  ${appVariant || 'N/A'}`,
      ``,
      `■ 테스트 광고 ID 사용 여부(adUnitId):`,
      `  ${TestIds.REWARDED === adUnitId ? 'True (테스트 ID 사용 중)' : 'False (실제 또는 스테이징 ID 사용 중)'}`,
      ``,
    ];

    Alert.alert(
      '앱 디버그 정보', // 알림창 제목
      messageParts.join('\n'), // 배열의 각 요소를 줄바꿈 문자로 연결
      [
        {
          text: '확인',
          onPress: () => console.log('디버그 정보 알림창 닫힘'),
          style: 'default', // 또는 'cancel'
        },
      ],
      { cancelable: true }, // 안드로이드에서 알림창 바깥을 탭하여 닫을 수 있게 함
    );
  };

  const handleDebugButtonClick = () => {
    // 클릭 카운트 증가
    clickCountRef.current += 1;

    // 이전 타이머가 있으면 제거
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    // 20번 클릭했을 경우 디버그 정보 표시
    if (clickCountRef.current >= 20) {
      clickCountRef.current = 0;
      showDebugInfoInAlert();
    } else {
      // 3초 내에 다음 클릭이 없으면 카운트 리셋
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 3000);
    }
  };

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
    return () => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPressIn={Keyboard.dismiss}>
      <View
        style={css`
          flex: 1;
          margin-bottom: ${insets.bottom + 'px'};
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
            <NewCheckBox
              checked={privacyAllowed}
              onToggle={() => setPrivacyAllowed(!privacyAllowed)}
              message="개인정보 제 3자 제공에 대해 동의합니다"
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
            <NewCheckBox
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
          <TouchableOpacity
            onLongPress={() => {
              console.log('long press');
              showDebugInfoInAlert();
            }}
            activeOpacity={1}>
            <Button
              title={loading ? '연결 중...' : '연결하기'}
              disabled={
                !(validateCode(code) === 'correct') || loading || !privacyAllowed || !fourth
              }
              primary={true}
              onPress={() => {
                if (code === '엄준식') {
                  handleDebugButtonClick();
                } else {
                  Analytics.clickConnectButton(code);
                  connectOrganization(code);
                }
              }}
            />
          </TouchableOpacity>
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
