import { useState, useEffect, useRef, useCallback } from 'react';
import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import Toast from 'react-native-root-toast';

interface RewardedAdConfig {
  adUnitId: string;
  onRewardEarned?: () => void;
  onAdClosed?: () => void;
  onError?: (error: any) => void;
}

interface RewardedAdState {
  isLoaded: boolean;
  isLoading: boolean;
  error: any;
  isShowing: boolean;
}

export const useRewardedAd = (config: RewardedAdConfig) => {
  const { adUnitId, onRewardEarned, onAdClosed, onError } = config;

  const [state, setState] = useState<RewardedAdState>({
    isLoaded: false,
    isLoading: false,
    error: null,
    isShowing: false,
  });

  const rewardedAdRef = useRef<RewardedAd | null>(null);
  const mountedRef = useRef(true);
  const loadRetryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 상태 업데이트 헬퍼
  const updateState = useCallback((updates: Partial<RewardedAdState>) => {
    if (!mountedRef.current) return;
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  // 광고 인스턴스 생성
  useEffect(() => {
    if (!adUnitId) return;

    try {
      rewardedAdRef.current = RewardedAd.createForAdRequest(adUnitId, {
        keywords: ['fashion', 'clothing'],
      });
    } catch (error) {
      console.error('광고 인스턴스 생성 실패:', error);
      onError?.(error);
    }
  }, [adUnitId, onError]);

  // 이벤트 리스너 등록
  useEffect(() => {
    const rewarded = rewardedAdRef.current;
    if (!rewarded) return;

    // 광고 로드 완료
    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      console.log('✅ 광고 로드 완료');
      updateState({
        isLoaded: true,
        isLoading: false,
        error: null,
      });
    });

    // 광고 로드 실패
    const unsubscribeFailedToLoad = rewarded.addAdEventListener(AdEventType.ERROR, (error) => {
      console.error('❌ 광고 로드 실패:', error);
      updateState({
        isLoaded: false,
        isLoading: false,
        error,
      });
      onError?.(error);

      // 5초 후 재시도
      if (loadRetryTimeoutRef.current) {
        clearTimeout(loadRetryTimeoutRef.current);
      }
      loadRetryTimeoutRef.current = setTimeout(() => {
        if (mountedRef.current) {
          loadAd();
        }
      }, 5000);
    });

    // 보상 획득
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log('🎉 보상 획득:', reward);
        updateState({ isShowing: false });
        onRewardEarned?.(reward);

        // 다음 광고 미리 로드
        setTimeout(() => loadAd(), 1000);
      },
    );

    // 광고 닫힘
    const unsubscribeClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('📱 광고 닫힘');
      updateState({ isShowing: false });
      onAdClosed?.();

      // 새로운 광고 로드
      setTimeout(() => loadAd(), 1000);
    });

    // 광고 표시 시작
    const unsubscribeOpened = rewarded.addAdEventListener(AdEventType.OPENED, () => {
      console.log('📺 광고 표시 시작');
      updateState({ isShowing: true });
    });

    return () => {
      unsubscribeLoaded();
      unsubscribeFailedToLoad();
      unsubscribeEarned();
      unsubscribeClosed();
      unsubscribeOpened();
    };
  }, [updateState, onRewardEarned, onAdClosed, onError]);

  // 광고 로드 함수
  const loadAd = useCallback(async () => {
    const rewarded = rewardedAdRef.current;
    if (!rewarded || !mountedRef.current) return;

    if (state.isLoading || state.isLoaded) {
      console.log('⏳ 이미 로딩 중이거나 로드된 상태');
      return;
    }

    updateState({
      isLoading: true,
      error: null,
    });

    try {
      console.log('🔄 광고 로드 시작');
      rewarded.load();
    } catch (error) {
      console.error('광고 로드 호출 실패:', error);
      updateState({
        isLoading: false,
        error,
      });
      onError?.(error);
    }
  }, [state.isLoading, state.isLoaded, updateState, onError]);

  // 광고 표시 함수
  const showAd = useCallback(async (): Promise<boolean> => {
    const rewarded = rewardedAdRef.current;
    if (!rewarded || !mountedRef.current) {
      console.error('광고 인스턴스가 없습니다');
      return false;
    }

    if (state.isShowing) {
      console.log('이미 광고가 표시 중입니다');
      return false;
    }

    try {
      // 광고가 로드되지 않은 경우 로드 시도
      if (!state.isLoaded) {
        if (!state.isLoading) {
          Toast.show('광고를 불러오는 중입니다...', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.CENTER,
          });
          await loadAd();
        }

        // 광고 로딩 대기 (최대 10초)
        const loadSuccess = await waitForAdLoad(10000);
        if (!loadSuccess) {
          Toast.show('광고를 불러올 수 없습니다. 잠시 후에 다시 시도해주세요😢', {
            duration: Toast.durations.LONG,
            position: Toast.positions.CENTER,
          });
          return false;
        }
      }

      console.log('🎬 광고 표시 시작');
      await rewarded.show();

      return true;
    } catch (error) {
      console.error('❌ 광고 표시 실패:', error);
      Toast.show('광고 표시 중 오류가 발생했습니다', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.CENTER,
      });
      onError?.(error);
      return false;
    }
  }, [state.isLoaded, state.isLoading, state.isShowing, loadAd, onError]);

  // 광고 로드 대기 함수
  const waitForAdLoad = useCallback(
    (timeout: number = 10000): Promise<boolean> => {
      return new Promise((resolve) => {
        const startTime = Date.now();
        const checkInterval = setInterval(() => {
          if (state.isLoaded) {
            clearInterval(checkInterval);
            resolve(true);
          } else if (state.error || Date.now() - startTime > timeout) {
            clearInterval(checkInterval);
            resolve(false);
          }
        }, 500);
      });
    },
    [state.isLoaded, state.error],
  );

  // 초기 광고 로드
  useEffect(() => {
    if (rewardedAdRef.current && !state.isLoaded && !state.isLoading) {
      loadAd();
    }
  }, [loadAd, state.isLoaded, state.isLoading]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (loadRetryTimeoutRef.current) {
        clearTimeout(loadRetryTimeoutRef.current);
      }
    };
  }, []);

  return {
    ...state,
    loadAd,
    showAd,
    isReady: state.isLoaded && !state.isShowing,
  };
};
