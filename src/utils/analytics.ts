import * as amplitude from '@amplitude/analytics-react-native';
import analytics from '@react-native-firebase/analytics';
import { AppEventsLogger } from 'react-native-fbsdk-next';

export default class Analytics {
  private static sendEvent = (
    eventName: string,
    eventKeyword: string,
    eventData: object = {},
  ): void => {
    amplitude.track(eventName, eventData);
    analytics().logEvent(eventKeyword, {
      eventName,
      ...eventData,
    });
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.CompletedRegistration, {
      [AppEventsLogger.AppEventParams.RegistrationMethod]: eventName,
    });
  };

  //로그인 화면
  public static watchLoginScreen = (): void => {
    this.sendEvent('로그인 화면 진입', 'loginScreen');
  };

  //회원가입 - 게스트모드 버튼 클릭
  public static clickGuestModeButton = (): void => {
    this.sendEvent('로그인 화면 - <비회원으로 바로 시작하기> 버튼 클릭', 'guestModeButton');
  };

  //회원가입 - 구글 로그인 버튼 클릭
  public static clickGoogleLoginButton = (): void => {
    this.sendEvent('로그인 화면 - <구글로 로그인> 버튼 클릭', 'googleLoginButton');
  };

  //회원가입 - 애플 로그인 버튼 클릭
  public static clickAppleLoginButton = (): void => {
    this.sendEvent('로그인 화면 - <애플로 로그인> 버튼 클릭', 'appleLoginButton');
  };

  //회원가입 - 닉네임+약관 화면
  public static watchSignUpScreen = (): void => {
    this.sendEvent('회원가입 화면(닉네임+약관) 진입', 'signUpScreen');
  };

  //회원가입 - 저장 버튼 클릭
  public static clickSignUpSaveButton = (): void => {
    this.sendEvent(
      '회원가입 화면(닉네임+약관) - 회원가입 완료(저장) 버튼 클릭',
      'signUpSaveButton',
    );
  };

  //탭바 클릭
  public static clickTabButton = (tabLabel: string = '없음'): void => {
    this.sendEvent(`탭바 - ${tabLabel} 클릭`, `tabButton`, { tabLabel });
  };

  //탭 - 홈 화면: TabHome
  public static watchTabHomeScreen = (): void => {
    this.sendEvent('탭-홈 화면 진입', 'tabHomeScreen');
  };
  //탭 - 홈 화면 캐러셀 클릭
  public static clickTabHomeCarousel = (carouselImageUrl: string | undefined = undefined): void => {
    this.sendEvent('탭-홈 화면 캐러셀 클릭', 'tabHomeCarouselButton', {
      carouselImageUrl: carouselImageUrl ?? 'undefined',
    });
  };
  //상담 기관 정보 버튼 클릭
  public static clickClinicInfoButton = (score: number | undefined = undefined): void => {
    this.sendEvent('탭-홈->상담 기관 정보 버튼 클릭', 'tabHomeClinicInfoButton', {
      score: score ? score : 'none',
    });
  };
  //위험 상태 편지 버튼 클릭
  public static clickDangerLetterButton = (score: number | undefined = undefined): void => {
    this.sendEvent('탭-홈->위험 상태 편지 버튼 클릭', 'tabHomeDangerLetterButton', {
      score: score ? score : -1,
    });
  };
  //위험 상태 열린 편지 버튼 클릭
  public static clickOpenedDangerLetterButton = (score: number | undefined = undefined): void => {
    this.sendEvent('탭-홈->위험 상태 열린 편지 버튼 클릭', 'tabHomeOpenedDangerLetterButton', {
      score: score ? score : -1,
    });
  };
  //탭 - 홈 화면 - 채팅 버튼 클릭
  public static clickTabHomeChatButton = (score: number | undefined = undefined): void => {
    this.sendEvent('탭-홈->화면 채팅 버튼 클릭', 'TabHomeChatButton', {
      score: score ? score : -1,
    });
  };
  //탭 - 홈 화면 - 감정 기록 버튼 클릭
  public static clickTabHomeEmotionRecordButton = (
    isRecord: boolean | undefined = undefined,
  ): void => {
    this.sendEvent('탭-홈->감정 기록 전 버튼 클릭', 'tabHomeEmotionRecordButton', {
      isRecord,
    });
  };

  //탭 - 설정 화면
  public static watchTabSettingScreen = (): void => {
    this.sendEvent('탭 - 설정 화면 진입', 'tabSettingScreen');
  };
  //탭 - 설정 화면 - 유저 정보 수정 버튼 클릭
  public static clickTabSettingEditInfoButton = (): void => {
    this.sendEvent('탭 - 설정 화면 - 유저 정보 수정 버튼 클릭', 'tabSettingEditInfoButton');
  };
  //탭 - 설정 화면 - 알림 설정 버튼 클릭
  public static clickTabSettingNotificationButton = (): void => {
    this.sendEvent('탭 - 설정 화면 - 알림 설정 버튼 클릭', 'tabSettingNotificationButton');
  };
  //탭 - 설정 화면 - 문의하기 버튼 클릭
  public static clickTabSettingInquiryButton = (): void => {
    this.sendEvent('탭 - 설정 화면 - 문의하기 버튼 클릭', 'tabSettingInquiryButton');
  };
  //탭 - 설정 화면 - 서비스 이용약관 버튼 클릭
  public static clickTabSettingServiceTermsButton = (): void => {
    this.sendEvent('탭 - 설정 화면 - 서비스 이용약관 버튼 클릭', 'tabSettingServiceTermsButton');
  };
  //탭 - 설정 화면 - 개인정보 처리방침 버튼 클릭
  public static clickTabSettingPrivacyPolicyButton = (): void => {
    this.sendEvent('탭 - 설정 화면 - 개인정보 처리방침 버튼 클릭', 'tabSettingPrivacyPolicyButton');
  };
  //탭 - 설정 화면 - 오픈소스 버튼 클릭
  public static clickTabSettingOpenSourceButton = (): void => {
    this.sendEvent('탭 - 설정 화면 - 오픈소스 버튼 클릭', 'tabSettingOpenSourceButton');
  };
  //탭 - 설정 화면 - 업데이트 버튼 클릭
  public static clickTabSettingUpdateButton = (): void => {
    this.sendEvent('탭 - 설정 화면 - 업데이트 버튼 클릭', 'tabSettingUpdateButton');
  };
  //탭 - 설정 화면 - 회원탈퇴 버튼 클릭
  public static clickTabSettingWithdrawalButton = (): void => {
    this.sendEvent('탭 - 설정 화면 - 회원탈퇴 버튼 클릭', 'tabSettingWithdrawalButton');
  };
  //탭 - 설정 화면 - 로그아옷 버튼 클릭
  public static clickTabSettingLogoutButton = (): void => {
    this.sendEvent('탭 - 설정 화면 - 로그아웃 버튼 클릭', 'tabSettingLogoutButton');
  };
  //탭 - 설정 화면 - 기관 연결 버튼 클릭
  public static clickTabSettingConnectButton = (): void => {
    this.sendEvent('탭 - 설정 화면 - 기관 연결 버튼 클릭', 'tabSettingConnectButton');
  };
  //로그아옷 취소 버튼 클릭
  public static clickTabSettingLogoutCancelButton = (): void => {
    this.sendEvent('로그아웃 취소 버튼 클릭', 'TabSettingLogoutCancelButton');
  };
  //로그아옷 확인 버튼 클릭
  public static clickTabSettingLogoutConfirmButton = (): void => {
    this.sendEvent('로그아웃 확인 버튼 클릭', 'TabSettingLogoutConfirmButton');
  };

  //분석 그룹 - 일일 분석 화면
  public static watchDailyStatisticScreen = (): void => {
    this.sendEvent('분석 그룹 - 일일 분석 화면 진입', 'dailyStatisticScreen');
  };
  //일일 분석 화면 - 달력 클릭
  public static clickDailyCalendarButton = (): void => {
    this.sendEvent('일일 분석 화면 - 달력 클릭', 'dailyStatisticCalendarButton');
  };
  //일일 분석 화면 - 기간 분석 버튼 클릭
  public static clickPeriodButton = (): void => {
    this.sendEvent('일일 분석 화면 - 기간 분석 버튼 클릭', 'PeriodButton');
  };

  //분석 그룹 - 기간 분석 화면
  public static watchPeriodStatisticScreen = (): void => {
    this.sendEvent('분석 그룹 - 기간 분석 화면 진입', 'periodStatisticScreen');
  };
  //기간 분석 화면 - 달력 클릭
  public static clickPeriodCalendarButton = (): void => {
    this.sendEvent('기간 분석 화면 - 달력 클릭', 'periodCalendarButton');
  };
  //기간 분석 화면 - 일일 분석 버튼 클릭
  public static clickDailyButton = (): void => {
    this.sendEvent('기간 분석 화면 - 일일 분석 버튼 클릭', 'dailyButton');
  };

  //채팅 화면
  public static watchChatScreen = (): void => {
    this.sendEvent('채팅 화면 진입', 'chatScreen');
  };
  //채팅 - 채팅 전송 버튼 클릭
  public static clickChatSendButton = (): void => {
    this.sendEvent('채팅 - 채팅 전송 버튼 클릭', 'chatSendButton');
  };
  //채팅 - AI답변 전송 시작 상태
  public static aiRequestSentStatus = (): void => {
    this.sendEvent('채팅 - AI답변 전송 시작 상태', 'aiRequestSentStatus');
  };
  //채팅 - 캐릭터 아바타 아이콘 클릭
  public static clickChatCharacterAvatar = (character: string = 'cookie'): void => {
    this.sendEvent('채팅 - 아바타 아이콘 클릭', 'chatAvatarButton', { character });
  };

  //감정 기록 화면
  public static watchEmotionRecordScreen = (): void => {
    this.sendEvent('감정 기록 화면 진입', 'emotionRecordScreen');
  };
  //감정 기록 - 기록하기 버튼 클릭
  public static clickRecordButton = (): void => {
    this.sendEvent('감정 기록 - 기록하기 버튼 클릭', 'emotionRecordButton');
  };

  //유저 정보 수정 화면
  public static watchUserInfoEditScreen = (): void => {
    this.sendEvent('유저 정보 수정 화면 진입', 'userInfoEditScreen');
  };
  //유저 정보 수정 - 정보 수정 버튼 클릭
  public static clickUserInfoEditInfoButton = (): void => {
    this.sendEvent('유저 정보 수정 - 정보 수정 버튼 클릭', 'userInfoEditInfoButton');
  };

  //알림 설정 화면
  public static watchNotificationSettingScreen = (): void => {
    this.sendEvent('알림 설정 화면 진입', 'notificationSettingScreen');
  };
  //알림 설정 - 스위치 클릭
  public static clickNotificationSettingSwitch = (
    switchLabel: string,
    newStatus: boolean,
  ): void => {
    this.sendEvent('알림 설정 - 스위치 클릭', 'notificationSwitch', { switchLabel, newStatus });
  };

  //오픈 소스 화면
  public static watchOpenSourceScreen = (): void => {
    this.sendEvent('오픈 소스 화면 진입', 'SourceScreen');
  };

  //회원탈퇴 방어 화면
  public static watchWithdrawalDefenseScreen = (): void => {
    this.sendEvent('회원탈퇴 방어 화면 진입', 'withdrawalDefenseScreen');
  };
  //회원탈퇴 방어 - 탈퇴 버튼 클릭
  public static clickWithdrawalButton = (): void => {
    this.sendEvent('회원탈퇴 방어 - 탈퇴 버튼 클릭', 'withdrawalButton');
  };

  //회원탈퇴 이유 화면
  public static watchWithdrawalReasonScreen = (): void => {
    this.sendEvent('회원탈퇴 이유 화면 진입', 'withdrawalReasonScreen');
  };
  //회원탈퇴 이유 - 최종 탈퇴 버튼 클릭
  public static clickWithdrawalFinalButton = (): void => {
    this.sendEvent('회원탈퇴 이유 - 최종 탈퇴 버튼 클릭', 'withdrawalFinalButton');
  };
  //회원탈퇴 경고창 - 탈퇴 취소 버튼 클릭
  public static clickWithdrawalModalCancelButton = (): void => {
    this.sendEvent('회원탈퇴 경고창 - 탈퇴 취소 버튼 클릭', 'withdrawalModalCancelButton');
  };
  //회원탈퇴 경고창 - 실제 탈퇴 버튼 클릭
  public static clickWithdrawalModalConfirmButton = (): void => {
    this.sendEvent('회원탈퇴 경고창 - 실제 탈퇴 버튼 클릭', 'withdrawalModalConfirmButton');
  };
  //기관 연결 화면
  public static watchConnectScreen = (): void => {
    this.sendEvent('기관 연결 화면 진입', 'connectScreen');
  };
  //기관 연결 - 연결 버튼 클릭
  public static clickConnectButton = (code: string): void => {
    this.sendEvent('기관 연결 - 연결 버튼 클릭', 'connectButton', { code });
  };
  //기관 현황 화면
  public static watchOrganizationInfoScreen = (): void => {
    this.sendEvent('기관 현황 화면 진입', 'OrganizationInfoScreen');
  };
  //기관 현황 - 연결 해제 버튼 클릭
  public static clickDisconnectButton = (): void => {
    this.sendEvent('기관 현황 - 연결 해제 버튼 클릭', 'disconnectButton');
  };
  //기관 현황 - 연결 해제 경고창 - 취소 버튼 클릭
  public static clickDisconnectModalCancelButton = (): void => {
    this.sendEvent('기관 현황 - 연결 해제 경고창 - 취소 버튼 클릭', 'disconnectModalCancelButton');
  };
  //기관 현황 - 연결 해제 경고창 - 해제 버튼 클릭
  public static clickDisconnectModalConfirmButton = (): void => {
    this.sendEvent('기관 현황 - 연결 해제 경고창 - 해제 버튼 클릭', 'disconnectModalConfirmButton');
  };

  //위험 상황 편지 화면
  public static watchDangerLetterScreen = (): void => {
    this.sendEvent('위험 상황 편지 화면 진입', 'dangerLetterScreen');
  };
  //위험 상황 편지 - 전화 연결 버튼 클릭
  public static clickDangerLetterCallButton = (): void => {
    this.sendEvent('위험 상황 편지 - 전화 연결 버튼 클릭', 'dangerLetterCallButton');
  };
  //위험 상황 편지 - 채팅 연결 버튼 클릭
  public static clickDangerLetterChatButton = (): void => {
    this.sendEvent('위험 상황 편지 - 채팅 연결 버튼 클릭', 'dangerLetterChatButton');
  };
  //위험 상황 편지 - 다른 상담 기관 알아보기 버튼 클릭
  public static clickDangerLetterOtherClinicButton = (): void => {
    this.sendEvent(
      '위험 상황 편지 - 다른 상담 기관 알아보기 버튼 클릭',
      'dangerLetterOtherClinicButton',
    );
  };

  //일반 상황 안내 화면 (링크로 대체)
}
