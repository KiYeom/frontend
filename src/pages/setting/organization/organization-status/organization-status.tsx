import React, { useEffect } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { disconnectOrganizationApi, getUserInfo } from '../../../../apis/setting';
import palette from '../../../../assets/styles/theme';
import { SettingStackName } from '../../../../constants/Constants';
import Analytics from '../../../../utils/analytics';
import Button from '../../../../components/button/Button';
import {
  AlertText,
  Annotation,
  CTAContainer,
  Title,
  TitleContainer,
} from './organization-status.style';

const OrganizationStatus: React.FC = ({ navigation }) => {
  const [loading, setLoading] = React.useState(false);
  const [organization, setOrganization] = React.useState('');

  const disconnectOrganization = () => {
    setLoading(true);
    // disconnect organization
    disconnectOrganizationApi()
      .then((res) => {
        if (res && res.result) {
          navigation.goBack();
          return;
        }
        alert('기관 연결 해제에 실패했습니다. 잠시 후 다시 시도해주세요.');
        setLoading(false);
      })
      .catch((err) => {
        alert('기관 연결 해제에 실패했습니다. 잠시 후 다시 시도해주세요.');
        setLoading(false);
      });

    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getUserInfo()
      .then((res) => {
        if (res && res.organization) {
          Analytics.watchOrganizationInfoScreen();
          setOrganization(res.organization);
          setLoading(false);
          return;
        } else {
          navigation.replace(SettingStackName.OrganizationConnect);
        }
      })
      .catch((error) => {
        alert('기관 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
        //console.log('error', error);
        navigation.goBack();
      });
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={palette.primary[500]} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TitleContainer>
        <Annotation>reMIND 기관 연결 페이지</Annotation>
        <Title status="default">
          해당 계정이 현재 {'\n'}
          <Title status="color">{organization}</Title>과 연결되어 있습니다.
        </Title>
      </TitleContainer>
      <View style={{ flex: 1 }} />
      <TitleContainer>
        <AlertText>
          연결 해제 시, 기관에서 요약을 포함한 모든 정보을 접근할 수 없게 됩니다.
        </AlertText>
      </TitleContainer>
      <CTAContainer>
        <Button
          title={loading ? '해제 중...' : '해제하기'}
          disabled={loading}
          primary={false}
          onPress={() => {
            Analytics.clickDisconnectButton();
            Alert.alert(
              '기관 연결 해제', // 첫번째 text: 타이틀 큰 제목
              '연결 해제 시, 기관에서 요약을 포함한 모든 정보을 접근할 수 없게 됩니다.\n\n기관 연결을 해제하시겠습니까?', // 두번째 text: 작은 제목
              [
                // 버튼 배열
                {
                  text: '연결유지', // 버튼 제목
                  style: 'cancel',
                  onPress: () => {
                    Analytics.clickDisconnectModalCancelButton();
                  },
                },
                {
                  text: '연결해제',
                  onPress: () => {
                    Analytics.clickDisconnectModalConfirmButton();
                    disconnectOrganization();
                  },
                },
              ],
            );
          }}
        />
      </CTAContainer>
    </View>
  );
};
export default OrganizationStatus;
