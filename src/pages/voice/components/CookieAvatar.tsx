import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
  Linking,
  Alert,
  Clipboard,
  SafeAreaView,
} from 'react-native';
import { Image } from 'expo-image';
import { getUserNickname } from '../../../utils/storageUtils';
import * as WebBrowser from 'expo-web-browser';
import * as Device from 'expo-device';
import palette from '@assets/styles/theme';
import Analytics from '../../../utils/analytics';

const userNickname = getUserNickname() || '';

type CookieAvatarProps = {
  responseText: string;
  isReceivingAudio?: boolean;
  waveform?: number[];
  isActive?: boolean;
  isChargeDisabled?: boolean;
};

const CookieAvatar = (props: CookieAvatarProps) => {
  const { responseText, isReceivingAudio, waveform, isActive, isChargeDisabled } = props;
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [issueDescription, setIssueDescription] = useState('');
  console.log('CookieAvatar props:', props);

  // 기기 정보 가져오기
  const deviceInfo = `${Device.brand} ${Device.modelName || Device.deviceName || ''}`;
  const osInfo = `${Platform.OS === 'ios' ? 'iOS' : '안드로이드'} ${Device.osVersion || ''}`;

  // 문의 템플릿 생성
  const getIssueTemplate = () => {
    return `쿠키의 음성 서비스 관련 문의입니다.

기기: ${deviceInfo} (${osInfo})
증상: ${issueDescription || '(예시) 처음에 쿠키에게 이야기했는데 쿠키의 목소리가 잘 안들립니다'}`;
  };

  // 클립보드에 복사
  const copyToClipboard = () => {
    Clipboard.setString(getIssueTemplate());
    Analytics.clickTabVoiceNoticeCopyButton();
    Alert.alert('복사 완료', '문의 내용이 클립보드에 복사되었습니다.');
  };

  // 문의 페이지로 이동
  const openSupportPage = async () => {
    Analytics.clickTabVoiceNoticeInquiryButton();
    try {
      if (Platform.OS === 'android') {
        await Linking.openURL('https://j2wk7.channel.io/home');
      } else {
        await WebBrowser.openBrowserAsync('https://j2wk7.channel.io/home');
      }
    } catch (error) {
      Alert.alert('오류', '문의 페이지를 열 수 없습니다.');
    }
  };

  // 정보 아이콘 핸들러
  const handleInfoPress = () => {
    console.log('정보 아이콘 클릭됨', isChargeDisabled);
    Analytics.clickTabVoiceNoticeButton();
    if (!isChargeDisabled) {
      setShowInfoModal(true);
    }
  };

  return (
    <View
      style={{
        borderColor: 'green',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
      }}>
      <View style={{ flexDirection: 'column', alignItems: 'center' }}>
        <View
          style={{
            width: 250,
            height: 250,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: 'purple',
          }}>
          {/* 제목과 정보 아이콘을 포함하는 컨테이너 */}
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              paddingBottom: 10,
              gap: 8,
            }}>
            <TouchableOpacity
              onPress={handleInfoPress}
              disabled={isChargeDisabled}
              style={{
                backgroundColor: !isChargeDisabled
                  ? 'rgba(255, 255, 255, 0.9)'
                  : 'rgba(255, 255, 255, 0.3)',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                opacity: !isChargeDisabled ? 1 : 0.5,
              }}>
              <Text style={{ fontSize: 12 }}>⚠️</Text>
              <Text
                style={{
                  color: !isChargeDisabled ? '#333' : '#ffffff',
                  fontSize: 12,
                  fontFamily: 'Pretendard-SemiBold',
                }}>
                전화 가이드 (필독)
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              backgroundColor: 'white',
              width: 123,
              height: 123,
              borderRadius: 100,
              overflow: 'hidden',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1,
              marginBottom: 10,
            }}>
            <Image
              source={require('@assets/images/callcookie.png')}
              style={{ width: 140, height: 120 }}
            />
          </View>
          <Text
            style={{
              color: 'white',
              fontSize: 17,
              fontFamily: 'Pretendard-SemiBold',
            }}>
            리마인드 쿠키
          </Text>
        </View>
      </View>

      <View style={{ borderColor: 'pink', width: 310, height: 17 * 8 }}>
        <ScrollView
          style={{ height: 17 * 5 + 10 }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
          }}>
          <Text
            style={{
              color: 'white',
              fontFamily: 'Kyobo-handwriting',
              fontSize: 17,
              textAlign: 'center',
              lineHeight: 24,
            }}>
            {responseText ||
              `찾아와줘서 고마워요, ${userNickname ? `${userNickname}님` : ''}\n마음 속의 생각을 편하게 이야기 해 주세요`}
          </Text>
        </ScrollView>
      </View>

      {/* 전체 화면 안내 페이지 */}
      <Modal
        visible={showInfoModal}
        animationType="slide"
        onRequestClose={() => setShowInfoModal(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
          {/* 헤더 */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#f0f0f0',
            }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Pretendard-Bold',
                color: '#333',
              }}>
              쿠키의 전화 통화 안내
            </Text>

            <TouchableOpacity
              onPress={() => {
                Analytics.clickTabVoiceNoticeCloseButton();
                setShowInfoModal(false);
              }}
              style={{
                width: 32,
                height: 32,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 24,
                  color: '#666',
                  fontFamily: 'Pretendard-Regular',
                }}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          {/* 스크롤 가능한 컨텐츠 */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 20,
              paddingBottom: 40,
            }}>
            {/* 문제 해결 */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Pretendard-SemiBold',
                  color: '#333',
                  marginBottom: 16,
                }}>
                ☘️ 이용 안내
              </Text>

              <View style={{ gap: 12 }}>
                <View
                  style={{
                    backgroundColor: '#f1f3f5',
                    padding: 12,
                    borderRadius: 8,
                    gap: 6,
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: 'Pretendard-Bold',
                      color: '#333',
                    }}>
                    • iOS 설정 방법
                  </Text>
                  <Text style={styles.guideText}>
                    설정 &gt; 앱 &gt; reMIND &gt; 마이크 허용을 확인해보세요
                  </Text>

                  <View style={{ height: 8 }} />

                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: 'Pretendard-Bold',
                      color: '#333',
                    }}>
                    • Android 설정 방법
                  </Text>
                  <Text style={styles.guideText}>
                    설정 &gt; 애플리케이션 &gt; reMIND &gt; 권한 &gt; 마이크 허용을 확인해보세요
                  </Text>
                </View>
                <Text style={styles.guideText}>
                  • 쿠키의 목소리가 들리지 않으면, 일시 정지 후 다시 시도해보세요
                </Text>

                <Text style={styles.guideText}>
                  • 음량을 확인하고 무음 모드가 아닌지 확인해주세요
                </Text>

                <Text style={styles.guideText}>
                  • 블루투스 이어폰 연결 시 오디오 출력을 확인해주세요
                </Text>

                <Text style={styles.guideText}>• 앱을 완전히 종료 후 다시 실행해보세요</Text>
              </View>
            </View>

            {/* 기본 안내사항 */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Pretendard-SemiBold',
                  color: '#333',
                  marginBottom: 16,
                }}>
                💡 쿠키와의 전화 연결 환경
              </Text>

              <View style={{ gap: 12 }}>
                <Text style={styles.guideText}>• 조용한 환경에서 진행하시기를 권장드립니다</Text>

                <Text style={styles.guideText}>• 마이크에 가까이 대고 또렷하게 말씀해주세요</Text>

                <Text style={styles.guideText}>• 쿠키가 대답을 마칠 때까지 기다려주세요</Text>

                <Text style={styles.guideText}>• 네트워크 연결 상태를 확인해주세요</Text>
              </View>
            </View>

            {/* 문의하기 섹션 */}
            <View
              style={{
                backgroundColor: '#f8f9fa',
                padding: 20,
                borderRadius: 12,
                marginBottom: 24,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Pretendard-SemiBold',
                  color: '#333',
                  marginBottom: 16,
                }}>
                📞 그럼에도 문제가 지속되면
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Pretendard-Regular',
                  color: '#666',
                  marginBottom: 16,
                }}>
                아래 내용을 입력 후 복사하여 문의 해 주시면 빠르게 확인해 드리겠습니다.
              </Text>

              <View
                style={{
                  backgroundColor: 'white',
                  padding: 16,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#e0e0e0',
                  marginBottom: 12,
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Pretendard-Regular',
                    color: '#666',
                    marginBottom: 12,
                  }}>
                  {getIssueTemplate()}
                </Text>

                <TextInput
                  placeholder="증상을 자세히 입력해주세요"
                  placeholderTextColor="#666"
                  value={issueDescription}
                  onChangeText={setIssueDescription}
                  multiline
                  numberOfLines={3}
                  style={{
                    borderTopWidth: 1,
                    borderTopColor: '#e0e0e0',

                    paddingTop: 12,
                    fontSize: 13,
                    fontFamily: 'Pretendard-Regular',
                    color: '#333',
                    minHeight: 60,
                  }}
                />
              </View>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  onPress={copyToClipboard}
                  style={{
                    flex: 1,
                    backgroundColor: '#e9ecef',
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#495057',
                      fontSize: 15,
                      fontFamily: 'Pretendard-SemiBold',
                    }}>
                    복사하기
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={openSupportPage}
                  style={{
                    flex: 1,
                    backgroundColor: `${palette.primary[400]}`,
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 15,
                      fontFamily: 'Pretendard-SemiBold',
                    }}>
                    문의하기
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 추가 안내 */}
            <View
              style={{
                backgroundColor: '#fff9e6',
                padding: 16,
                borderRadius: 8,
                marginBottom: 24,
              }}>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'Pretendard-Regular',
                  color: '#666',
                  lineHeight: 20,
                }}>
                ⚡ 쿠키는 AI 기반 서비스로 가끔 예상치 못한 답변을 할 수 있습니다. 전문적인 상담이
                필요한 경우 전문가의 도움을 받으시기 바랍니다.
              </Text>
            </View>

            {/* 서비스 이용 안내 */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Pretendard-SemiBold',
                  color: '#333',
                  marginBottom: 16,
                }}>
                ℹ️ 서비스 안내
              </Text>

              <View style={{ gap: 12 }}>
                <Text style={styles.guideText}>• 개인정보는 안전하게 보호됩니다</Text>

                <Text style={styles.guideText}>
                  • 긴급한 도움이 필요한 경우 전문 기관에 연락하세요
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = {
  guideText: {
    fontSize: 15,
    fontFamily: 'Pretendard-Regular',
    color: '#495057',
    lineHeight: 24,
  },
};

export default CookieAvatar;
