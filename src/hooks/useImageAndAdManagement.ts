// hooks/useImageAndAdManagement.ts
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-root-toast';
import {
  RewardedAd,
  AdEventType,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import Constants from 'expo-constants';
import { Platform, Alert } from 'react-native'; // Alert 임포트 추가
import Analytics from '../utils/analytics';
import { updateSendPhotoPermission } from '../apis/chatting';
import { getUserNickname } from '../utils/storageUtils'; // getUserNickname 임포트 추가

interface UseImageAndAdManagementProps {
  // useChatMessages 훅의 setImage와 setBuffer를 받아서 이미지 전송을 트리거합니다.
  setChatImage: React.Dispatch<React.SetStateAction<string | null>>;
  setChatBuffer: React.Dispatch<React.SetStateAction<string | null>>;
  currentChatImage: string | null; // 현재 ChatMessages 훅에 설정된 이미지 상태
  currentChatBuffer: string | null; // 현재 ChatMessages 훅에 설정된 버퍼 상태
}

interface UseImageAndAdManagementResult {
  imageForPreview: string | null; // 이 훅 내부에서 관리하는 이미지 미리보기 상태
  modalVisible: boolean; // 광고 모달 가시성
  loadedAd: boolean; // 광고 로드 여부
  loadingAd: boolean; // 광고 로드 중 여부
  showImageSourceSelection: () => void; // 이미지 원본 선택 (카메라/앨범)을 묻는 함수
  handleModalClose: (type: 'cancel' | 'submit') => void; // 광고 모달 닫기 핸들러
  watchAds: () => Promise<boolean>; // 광고 시청 함수
  clearImageForPreview: () => void; // 이미지 미리보기 상태를 지우는 함수
  showAdsModal: () => void; // 광고 모달 표시 함수
}

// 광고 ID 관련 설정 (NewChat.tsx에서 가져옴)
const appVariant = Constants.expoConfig?.extra?.appVariant;
const isProductionOrStaging = appVariant === 'production' || appVariant === 'staging';
// getUserNickname()을 사용하여 isTestUser 정의
const isTestUser = getUserNickname() === 'Test_remind';

const adUnitId =
  isProductionOrStaging && !isTestUser
    ? Platform.OS === 'android'
      ? process.env.EXPO_PUBLIC_CHATTING_REWARD_AD_UNIT_ID_ANDROID
      : process.env.EXPO_PUBLIC_CHATTING_REWARD_AD_UNIT_ID_IOS
    : TestIds.REWARDED;

console.log('광고 단위 ID:', adUnitId); // 광고 단위 ID 확인용 로그
console.log('테스트 광고 단위', TestIds.REWARDED); // 테스트 광고 단위 ID 확인용 로그
export const useImageAndAdManagement = ({
  setChatImage,
  setChatBuffer,
  currentChatImage,
  currentChatBuffer,
}: UseImageAndAdManagementProps): UseImageAndAdManagementResult => {
  // 이 훅 내부에서 관리하는 이미지 상태 (UI 미리보기 및 선택된 이미지 URI 저장용)
  const [imageForPreview, setImageForPreview] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // 광고 로드 상태
  const [loadedAd, setLoadedAd] = useState(false);
  const [loadingAd, setLoadingAd] = useState(false);
  const [adError, setAdError] = useState<any>(null); // 광고 로드 실패 에러

  const showAdsModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  // 리워드 광고 인스턴스 생성 (한 번만 생성되도록 useMemo 사용)
  const rewarded = useMemo(
    () =>
      RewardedAd.createForAdRequest(adUnitId, {
        keywords: ['fashion', 'clothing'],
      }),
    [],
  );

  // 광고 로드 함수
  const loadAd = useCallback(() => {
    if (loadingAd || loadedAd) {
      return;
    }
    setLoadingAd(true);
    setAdError(null);
    try {
      rewarded.load();
    } catch (err: any) {
      console.error('광고 로드 호출 실패:', err);
      setLoadingAd(false);
      setAdError(err);
    }
  }, [loadingAd, loadedAd, rewarded]);

  // 광고 이벤트 리스너 등록
  useEffect(() => {
    let mounted = true;

    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      if (mounted) {
        console.log('✅ 광고 로드 성공!');
        setLoadedAd(true);
        setLoadingAd(false);
        setAdError(null);
      }
    });

    const unsubscribeFailedToLoad = rewarded.addAdEventListener(AdEventType.ERROR, (error) => {
      if (mounted) {
        console.error('❌ 광고 로드 실패:', error);
        setLoadedAd(false);
        setLoadingAd(false);
        setAdError(error);
        Analytics.watchNoEarnRewardScreenInChatting({
          errorCode: error.code,
          errorMessage: error.message,
          errorDomain: error.domain,
          adUnitId: adUnitId,
          isTestMode: adUnitId === TestIds.REWARDED,
        });
        setTimeout(() => {
          if (mounted) {
            loadAd();
          }
        }, 5000);
      }
    });

    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      async (reward) => {
        if (mounted) {
          console.log('🎉 보상 획득:', reward);
          Analytics.watchEarnRewardScreenInChatting();
          try {
            const res = await updateSendPhotoPermission(true);
            if (res?.canSendPhoto) {
              setModalVisible(false); // 모달 닫기
              // 광고 시청 성공 후, useChatMessages 훅의 이미지와 버퍼 상태를 설정하여 전송을 트리거합니다.
              // 이 훅 내부의 imageForPreview에 저장된 이미지를 useChatMessages 훅으로 전달
              setChatImage(imageForPreview);
              setChatBuffer(currentChatBuffer); // 기존 버퍼 텍스트 유지
              setImageForPreview(null); // 미리보기 이미지 초기화 (전송 완료 후)
            }
          } catch (error: any) {
            console.error('권한 업데이트 실패:', error);
            Analytics.photoPermissionError(error);
            Toast.show('오류가 발생했습니다. 다시 시도해주세요', {
              duration: Toast.durations.SHORT,
              position: Toast.positions.CENTER,
            });
          }
          loadAd(); // 다음 광고 미리 로드
        }
      },
    );

    const unsubscribeClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      if (mounted) {
        loadAd(); // 광고 닫힌 후 새 광고 로드
      }
    });

    loadAd(); // 컴포넌트 마운트 시 초기 광고 로드
    return () => {
      mounted = false;
      unsubscribeLoaded();
      unsubscribeFailedToLoad();
      unsubscribeEarned();
      unsubscribeClosed();
    };
  }, [rewarded, loadAd, setChatBuffer, setChatImage, imageForPreview, currentChatBuffer]); // 의존성 추가

  // 이미지 미리보기 상태를 지우는 함수
  const clearImageForPreview = useCallback(() => {
    setImageForPreview(null);
  }, []);

  // 카메라로 이미지 선택 함수
  const pickImageFromCamera = useCallback(async () => {
    try {
      const { status: cameraStatus } = await ImagePicker.getCameraPermissionsAsync();
      if (cameraStatus !== 'granted') {
        const { status: newCameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        if (newCameraStatus !== 'granted') {
          Toast.show('카메라 접근 권한이 필요합니다', { duration: Toast.durations.LONG });
          return;
        }
      }
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });
      if (!result.canceled) {
        setImageForPreview(result.assets[0].uri); // 훅 내부 이미지 상태 업데이트
        Analytics.clickImagePickerConfirmButton(); // 적절한 Analytics 이벤트
      } else {
        Analytics.clickImagePickerCancelButton(); // 적절한 Analytics 이벤트
      }
    } catch (error: any) {
      console.error('카메라 사용 중 오류 발생:', error);
      Toast.show('카메라 사용 중 오류가 발생했습니다', { duration: Toast.durations.SHORT });
      Analytics.clickImagePickerErrorButton(error.message, error.code);
    }
  }, []);

  // 사진 라이브러리에서 이미지 선택 함수
  const pickImageFromLibrary = useCallback(async () => {
    try {
      const { status: libraryStatus } = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (libraryStatus !== 'granted') {
        const { status: newLibraryStatus } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (newLibraryStatus !== 'granted') {
          Toast.show('사진 라이브러리 접근 권한이 필요합니다', { duration: Toast.durations.LONG });
          return;
        }
      }
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });
      if (!result.canceled) {
        setImageForPreview(result.assets[0].uri); // 훅 내부 이미지 상태 업데이트
        Analytics.clickImagePickerConfirmButton();
      } else {
        Analytics.clickImagePickerCancelButton();
      }
    } catch (error: any) {
      console.error('사진 라이브러리 선택 중 오류 발생:', error);
      Toast.show('사진 라이브러리 선택 중 오류가 발생했습니다', {
        duration: Toast.durations.SHORT,
      });
      Analytics.clickImagePickerErrorButton(error.message, error.code);
    }
  }, []);

  // 이미지 원본 선택 (카메라/앨범)을 묻는 함수
  const showImageSourceSelection = useCallback(() => {
    console.log('이미지 원본 선택 요청');
    if (imageForPreview) {
      // 이미 이미지가 선택된 경우 (미리보기 중)
      Toast.show('이미지는 한 장만 보낼 수 있어요', { duration: Toast.durations.SHORT });
      Analytics.clickIamgePreviewAddButton(); // 기존 로직 유지 (미리보기 중 추가 버튼 누름)
      return;
    }
    pickImageFromLibrary();
    /*Alert.alert(
      '사진 선택',
      '어떤 방법으로 사진을 가져오시겠어요?',
      [
        {
          text: '카메라로 촬영',
          onPress: pickImageFromCamera,
        },
        {
          text: '사진 라이브러리',
          onPress: pickImageFromLibrary,
        },
        {
          text: '취소',
          style: 'cancel',
          onPress: () => Analytics.clickImagePickerCancelButton(), // 취소 시 분석 이벤트
        },
      ],
      { cancelable: true },
    );*/
  }, [imageForPreview, pickImageFromCamera, pickImageFromLibrary]); // 의존성 배열에 함수 추가

  // 광고 시청 함수 (NewChat.tsx에서 가져옴)
  const watchAds = useCallback(async () => {
    console.log('watchAds 함수 호출');
    try {
      if (!loadedAd) {
        if (!loadingAd) {
          Toast.show('광고를 불러오는 중입니다...', { duration: Toast.durations.SHORT });
          loadAd(); // 광고 로드 재시도
        }
        // 광고 로딩 대기 (최대 10초)
        const loadSuccess = await new Promise<boolean>((resolve) => {
          let attempts = 0;
          const maxAttempts = 20; // 10초 (500ms * 20)
          const checkInterval = setInterval(() => {
            attempts++;
            if (loadedAd) {
              // loadedAd 상태가 true가 되면 성공
              clearInterval(checkInterval);
              resolve(true);
            } else if (attempts >= maxAttempts || adError) {
              // 최대 시도 횟수 초과 또는 에러 발생 시 실패
              clearInterval(checkInterval);
              resolve(false);
            }
          }, 500);
        });

        if (!loadSuccess) {
          Toast.show('광고를 불러올 수 없습니다. 잠시 후에 다시 시도해주세요😢', {
            duration: Toast.durations.LONG,
          });
          Analytics.adLoadTimeoutInChatting();
          return false;
        }
      }

      // 광고 표시
      return new Promise<boolean>((resolve) => {
        let rewardEarned = false; // 보상 획득 여부 플래그

        // 임시 이벤트 리스너: 보상 획득 시
        const tempEarnedListener = rewarded.addAdEventListener(
          RewardedAdEventType.EARNED_REWARD,
          (reward) => {
            rewardEarned = true;
            resolve(true); // 보상 획득 시 성공으로 resolve
            // 리스너 정리
            tempClosedListener();
            tempEarnedListener();
          },
        );

        // 임시 이벤트 리스너: 광고 닫힘 시
        const tempClosedListener = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
          // 광고가 닫혔지만 보상을 받지 못한 경우 (광고를 끝까지 시청하지 않음)
          if (!rewardEarned) {
            Toast.show('광고를 끝까지 시청해야 보상을 받을 수 있습니다', {
              duration: Toast.durations.LONG,
              position: Toast.positions.CENTER,
            });
            setLoadedAd(false); // 광고 상태 리셋
            loadAd(); // 새로운 광고 로드 시도
            resolve(false); // 실패로 resolve
          }
          // 리스너 정리
          tempClosedListener();
          tempEarnedListener();
        });

        // 광고 표시 실행
        rewarded.show().catch((showError: any) => {
          console.error('❌ 광고 표시 실패:', showError);
          Analytics.clickWatchAdsErrorInChatting({
            errorCode: showError.code || 'unknown',
            errorMessage: showError.message || '광고 표시 실패',
            stage: 'show',
          });
          setLoadedAd(false); // 광고 상태 리셋
          loadAd(); // 새로운 광고 로드 시도
          resolve(false); // 실패로 resolve
          // 리스너 정리
          tempClosedListener();
          tempEarnedListener();
        });
      });
    } catch (error: any) {
      console.error('❌ 광고 시청 오류:', error);
      Toast.show('광고 표시 중 오류가 발생했습니다', { duration: Toast.durations.SHORT });
      Analytics.clickWatchAdsErrorInChatting({
        errorCode: error.code || 'unknown',
        errorMessage: error.message || '알 수 없는 오류',
        stage: 'show',
      });
      setLoadedAd(false); // 광고 상태 리셋
      loadAd(); // 새로운 광고 로드 시도
      return false;
    }
  }, [loadedAd, loadingAd, adError, rewarded, loadAd]);

  // 모달 닫기 처리 (취소 또는 전송 버튼 클릭 시)
  const handleModalClose = useCallback(
    (type: 'cancel' | 'submit') => {
      if (type === 'cancel') {
        console.log('광고 시청 취소');
        Analytics.clickNoWatchAdsButtonInChatting();
        // 이미지 전송 취소 시, 선택된 이미지 미리보기와 useChatMessages 훅의 이미지/버퍼 상태 초기화
        setImageForPreview(null);
        setChatImage(null);
        setChatBuffer(null);
      } else if (type === 'submit') {
        console.log('광고 시청 시작');
        Analytics.clickWatchAdsButtonInChatting();
        // '확인' 버튼을 누른 경우, 실제 광고 시청 로직은 watchAds()에서 처리
      }
      setModalVisible(false);
    },
    [setImageForPreview, setChatImage, setChatBuffer],
  );

  return {
    imageForPreview,
    modalVisible,
    loadedAd,
    loadingAd,
    showImageSourceSelection, // 새로운 함수 노출
    handleModalClose,
    watchAds,
    clearImageForPreview, // 이미지 미리보기 상태를 지우는 함수 노출
    showAdsModal,
    adUnitId,
  };
};
