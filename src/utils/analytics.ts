import * as amplitude from '@amplitude/analytics-react-native';
import analytics from '@react-native-firebase/analytics';
import { AppEventsLogger } from 'react-native-fbsdk-next';
import { jwtDecode } from 'jwt-decode';

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

  public static setUser = (accessToken: string): void => {
    const decodedToken = jwtDecode<{ userId: string }>(accessToken);
    const userId = decodedToken.userId;
    amplitude.setUserId(String(userId));
    analytics().setUserId(String(userId));
  };

  //바로 나오는 업데이트 버튼 클릭
  public static clickUpdateAlertButton = (appVersion: string, os: string): void => {
    this.sendEvent('바로 나오는 업데이트 버튼 클릭', 'updateAlertButton', { os, appVersion });
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

  //회원가입 - 존댓말 버튼 클릭
  public static clickFormalChatStyleButton = (): void => {
    this.sendEvent('회원가입 화면 - 존댓말 버튼 클릭', 'clickFormalChatStyleButton');
  };

  //회원가입 - 반말 버튼 클릭
  public static clickInformalChatStyleButton = (): void => {
    this.sendEvent('회원가입 화면 - 반말 버튼 클릭', 'clickInformalChatStyleButton');
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
  //탭 - 홈 화면 - 데모 모드 버튼 클릭
  public static clickTabHomeDemoModeButton = (): void => {
    this.sendEvent('탭-홈 화면 - 데모 모드 버튼 클릭', 'tabHomeDemoModeButton');
  };

  //탭 - 홈화면 - 감정 달력 날짜 클릭
  public static clickTabHomeEmotionCalendar = (date: string): void => {
    this.sendEvent('탭-홈 화면 - 감정 달력 날짜 클릭', 'tabHomeEmotionCalendar', { date });
  };
  //탭 - 홈화면 - 감정 달력 화살표 클릭
  public static clickTabHomeEmotionCalendarArrow = (direction: 'left' | 'right'): void => {
    this.sendEvent('탭-홈 화면 - 감정 달력 화살표 클릭', 'tabHomeEmotionCalendarArrow', {
      direction,
    });
  };
  //탭 - 홈 화면 - 행복 열기 버튼 클릭
  public static clickTabHomeHappyLyricsButton = (): void => {
    this.sendEvent('탭-홈 화면 - 행복 열기 버튼 클릭', 'clickTabHomeHappyLyricsButton');
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

  //행복 세잎클로버 화면 진입
  public static watchBeforeOpenHappyLyricsImageScreen = (): void => {
    this.sendEvent('행복 세잎클로버 화면 진입', 'happyLyricsScreen');
  };
  //행복 포토카드 화면 진입
  public static watchHappyLyricsImageScreen = (): void => {
    this.sendEvent('행복 이미지 화면 진입', 'happyLyricsImageScreen');
  };

  //행복 이미지 페이지 저장 버튼 클릭
  public static clickHappyLyricsImageSaveButton = (): void => {
    this.sendEvent('행복 이미지 페이지 저장 버튼 클릭', 'happyLyricsImageSaveButton');
  };
  //행복 이미지 페이지 공유 버튼 클릭
  public static clickHappyLyricsImageShareButton = (): void => {
    this.sendEvent('행복 이미지 페이지 공유 버튼 클릭', 'happyLyricsImageShareButton');
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

  //03.13 코드푸시 추가
  //탭 - 설정 화면 - 대화방 설정 버튼 클릭
  public static clickTabSettingChattingSetting = (): void => {
    this.sendEvent('탭 - 설정 화면 - 대화방 설정 버튼 클릭', 'tabSettingChattingSetting');
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
  //탭 - 설정 화면 - 로그아웃 버튼 클릭
  public static clickTabSettingLogoutButton = (): void => {
    this.sendEvent('탭 - 설정 화면 - 로그아웃 버튼 클릭', 'tabSettingLogoutButton');
  };
  //탭 - 설정 화면 - 기관 연결 버튼 클릭
  public static clickTabSettingConnectButton = (): void => {
    this.sendEvent('탭 - 설정 화면 - 기관 연결 버튼 클릭', 'tabSettingConnectButton');
  };
  //로그아웃 취소 버튼 클릭
  public static clickTabSettingLogoutCancelButton = (): void => {
    this.sendEvent('로그아웃 취소 버튼 클릭', 'TabSettingLogoutCancelButton');
  };
  //로그아웃 확인 버튼 클릭
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

  //일일 분석 화면 - 채팅 바로가기 버튼 클릭 (CTA)
  public static clickCTAChatButton = (): void => {
    this.sendEvent('일일 분석 화면 - CTA 채팅 버튼 클릭', 'dailyCTAChatButton');
  };
  //일일 분석 화면 - 일기 작성 바로가기 버튼 클릭 (CTA)
  public static clickCTADiaryButton = (): void => {
    this.sendEvent('일일 분석 화면 - CTA 일기 버튼 클릭', 'dailyCTADiaryButton');
  };
  //일일 분석 화면 - 일기 수정하기 버튼 클릭
  public static clickEditDiaryButton = (): void => {
    this.sendEvent('일일 분석 화면 - 일기 수정하기 버튼 클릭', 'editDiaryButton');
  };
  //일일 분석 화면 - 감정 다이어리 뒤로 가기 버튼 클릭
  public static clickDiaryBackButton = (): void => {
    this.sendEvent('일기 화면 - 뒤로가기 버튼 클릭', 'diaryBackButton');
  };

  //분석 그룹 - 기간 분석 화면
  public static watchPeriodStatisticScreen = (): void => {
    this.sendEvent('분석 그룹 - 기간 분석 화면 진입', 'periodStatisticScreen');
  };
  //기간 분석 화면 - 달력 클릭
  public static clickPeriodCalendarButton = (): void => {
    this.sendEvent('기간 분석 화면 - 달력 클릭', 'periodCalendarButton');
  };
  //기간 분석 화면 - 달력 클릭 - 모달 진입
  public static watchPeriodCalendarModal = (): void => {
    this.sendEvent('기간 분석 화면 - 달력 클릭 - 모달 진입', 'periodCalendarModal');
  };
  //기간 분석 화면 - 일일 분석 버튼 클릭
  public static clickDailyButton = (): void => {
    this.sendEvent('기간 분석 화면 - 일일 분석 버튼 클릭', 'dailyButton');
  };
  //기간 분석 화면 - 채팅 바로가기 버튼 클릭 (CTA)
  public static clickCTAChatButtonInPeriod = (): void => {
    this.sendEvent('기간 분석 화면 - CTA 채팅 버튼 클릭', 'periodCTAChatButton');
  };
  //기간 분석 화면 - 일기 작성 바로가기 버튼 클릭 (CTA)
  public static clickCTADiaryButtonInPeriod = (): void => {
    this.sendEvent('기간 분석 화면 - CTA 일기 버튼 클릭', 'periodCTADiaryButton');
  };

  //기간 분석 화면 - 일일 기간 리포트 버튼 클릭 (CTA)
  public static clickCTAGoDailyReportPageInPeriod = (date: string): void => {
    this.sendEvent(
      '기간 분석 화면 - CTA 일일 리포트 이동 버튼 클릭',
      'periodCTAGoDailyReportPageButton',
      { date },
    );
  };

  //채팅 화면
  public static watchChatScreen = (): void => {
    this.sendEvent('채팅 화면 진입', 'chatScreen');
  };

  //업데이트된 채팅 화면
  public static watchNewChatScreen = (): void => {
    this.sendEvent('업데이트된 채팅 화면 진입', 'newChatScreen');
  };

  //채팅 - 사진 전송 버튼 클릭
  public static clickAddPicButtonInChatting = (): void => {
    this.sendEvent('채팅 - <사진 첨부하기> 버튼 클릭', 'clickAddPicButtonInChatting');
  };

  //채팅 - <사진첨부> - <광고> - 네 버튼 클릭
  public static clickWatchAdsButtonInChatting = (): void => {
    this.sendEvent('채팅 - <광고 모달> - <광고보기> 버튼 클릭', 'save');
  };

  //채팅 - <사진 첨부> - <광고 모달> - 저장하기 클릭 후 광고 송출
  public static watchAdsScreenInChatting = (): void => {
    this.sendEvent(
      '채팅 - <사진첨부하기> - <광고 모달> - <광고보기> 버튼 클릭 후 광고 송출',
      'watchAdsScreenInChatting',
    );
  };

  //채팅 - <사진 첨부> - <광고 모달> - 저장하기 클릭 후 광고 송출 - 리워드 지급
  public static watchEarnRewardScreenInChatting = (): void => {
    this.sendEvent('채팅 사진 첨부 광고 송출 후, 리워드 지급', 'watchEarnRewardScreenInChatting');
  };

  //채팅 - <사진 첨부> - <광고 모달> - 저장하기 클릭 후 광고 송출 - 리워드 미지급
  public static watchNoEarnRewardScreenInChatting = (): void => {
    this.sendEvent(
      '채팅 사진 첨부 광고 송출 후, 채팅 저장에 오류 발생',
      'watchNoEarnRewardScreenInChatting',
    );
  };

  //채팅 - <사진첨부> - <광고모달> - 취소 버튼 클릭
  public static clickNoWatchAdsButtonInChatting = (): void => {
    this.sendEvent('채팅 - <사진첨부하기> - <광고 모달> - <취소> 버튼 클릭', 'cancel');
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
  //채팅 - 대화 좋아요 클릭
  public static clickChatLikeButton = (messageId: string): void => {
    this.sendEvent('채팅 - 대화 좋아요 클릭', 'chatLikeButton', { messageId });
  };
  //채팅 - 대화 신고하기 클릭
  public static clickChatReportButton = (): void => {
    this.sendEvent('채팅 - 대화 신고하기 클릭', 'chatReportButton');
  };
  //채팅 - 대화 신고하기 - 모달 - 취소 클릭
  public static clickChatReportCancelButton = (): void => {
    this.sendEvent('채팅 - 대화 신고하기 - 모달 - 취소 클릭', 'chatReportCancelButton');
  };
  //채팅 - 대화 신고하기 - 모달 - 신고하기 클릭
  public static clickChatReportConfirmButton = (): void => {
    this.sendEvent('채팅 - 대화 신고하기 - 모달 - 신고하기 클릭', 'chatReportConfirmButton');
  };
  //채팅 - 헤더 좌측 뒤로가기 버튼 클릭
  public static clickHeaderBackButton = (): void => {
    this.sendEvent('채팅 - 헤더의 좌측 뒤로가기 버튼 클릭', 'headerBackButton');
  };

  //채팅 - 찾기 돋보기 버튼 클릭
  public static clickHeaderSearchButton = (): void => {
    this.sendEvent('채팅 - 헤더의 찾기 돋보기 버튼 클릭', 'headerSearchButton');
  };

  //채팅 - 찾기 취소 버튼 클릭
  public static clickHeaderSearchCancelButton = (): void => {
    this.sendEvent('채팅 - 헤더의 찾기 취소 버튼 클릭', 'headerSearchCancelButton');
  };

  //채팅 - 키워드 찾기 버튼 클릭
  public static clickHeaderSearchKeywordButton = (keyword: string): void => {
    this.sendEvent('채팅 - 키워드 찾기 버튼 클릭', 'headerSearchKeywordButton', { keyword });
  };

  //채팅 - 헤더 우측 선물 상자 버튼 클릭
  public static clickHeaderGiftBoxButton = (eventUrl: string): void => {
    this.sendEvent('채팅 - 헤더의 우측 선물 상자 버튼 클릭', 'headerGiftBoxButton', { eventUrl });
  };

  //채팅 - 사이드바 버튼 클릭
  public static clickHeaderSideMenuButton = (): void => {
    this.sendEvent('채팅 - 헤더의 우측 사이드바 버튼 클릭', 'headerSideMenuButton');
  };

  //채팅 - 사이드바 오픈
  public static watchOpenedSideMenuScreen = (): void => {
    this.sendEvent('채팅 - 사이드바 오픈 진입', 'openedSideMenuScreen');
  };

  //채팅 - 사이드바 - 대화방 관리의 반말 토글 클릭
  public static clickChattingRoomSettingSwitch = (
    switchLabel: string,
    newStatus: boolean,
  ): void => {
    this.sendEvent(
      '채팅 - 사이드바 - 대화방 관리 반말 사용하기 스위치 클릭',
      'clickChattingRoomSettingSwitch',
      {
        switchLabel,
        newStatus,
      },
    );
  };

  //채팅 - 사이드바 - 대화방 관리의 이모지 토글 클릭
  public static clickChattingRoomSettingEmojiSwitch = (
    switchLabel: string,
    newStatus: boolean,
  ): void => {
    this.sendEvent(
      '채팅 - 사이드바 - 대화방 관리 쿠키 답변에 이모티콘 추가하기 스위치 클릭',
      'clickChattingRoomSettingEmojiSwitch',
      {
        switchLabel,
        newStatus,
      },
    );
  };

  //채팅 - 사이드바 - '닫힌 편지 클릭'
  public static clickSideMenuDangerLetterButton = (score: number | undefined = undefined): void => {
    this.sendEvent('채팅 - 사이드바 - 위험 편지 클릭', 'sideMenuClosedLetterButton', {
      score: score ? score : -1,
    });
  };
  //채팅 - 사이드바 - '열린 편지 보기' 클릭
  public static clickSideMenuOpenedDangerLetterButton = (
    score: number | undefined = undefined,
  ): void => {
    this.sendEvent(
      '채팅 - 사이드바 - 한 번 살펴봤던 위험 편지 보기 클릭',
      'sideMenuOpenedLetterButton',
      {
        score: score ? score : -1,
      },
    );
  };

  //채팅 - 사이드바 - 따스한 대화 보관함 클릭
  public static clickSideMenuWarmChatButton = (): void => {
    this.sendEvent('채팅 - 사이드바 - 따스한 대화 보관함 클릭', 'sideMenuWarmChatButton');
  };
  ß;

  //채팅 - 사이드바 - 따스한 대화 보관함 창 진입
  public static watchWarmChatScreen = (): void => {
    this.sendEvent('따스한 대화 보관함 진입', 'warmChatScreen');
  };

  //채팅 - 사이드바 - 따스한 대화 보관함 창에서 뒤로 가기 클릭
  public static clickWarmChatButtonBack = (): void => {
    this.sendEvent('따스한 대화 보관함 - 뒤로가기 클릭', 'warmChatButtonBack');
  };

  //채팅 - 사이드바 - 따스한 대화 보관함에서 좋아요 버튼 누르기
  public static clickFavoriteHeartButton = (messageId: string): void => {
    this.sendEvent('따스한 대화 보관함 - 좋아요 클릭', 'favoriteHeartButton', { messageId });
  };

  //채팅 - 사이드바 - 모든 대화 삭제하기 클릭
  public static clickSideMenuDeleteAllButton = (): void => {
    this.sendEvent('채팅 - 사이드바 - 모든 대화 삭제하기 클릭', 'sideMenuDeleteAllButton');
  };

  //채팅 - 사이드바 - 모든 대화 삭제하기 모달 확인 클릭
  public static clickSideMenuDeleteAllConfirmButton = (): void => {
    this.sendEvent(
      '채팅 - 사이드바 - 모든 대화 삭제하기 모달 확인 클릭',
      'sideMenuDeleteAllConfirm',
    );
  };

  //채팅 - 사이드바 - 모든 대화 삭제하기 모달 취소 클릭
  public static clickSideMenuDeleteAllCancelButton = (): void => {
    this.sendEvent(
      '채팅 - 사이드바 - 모든 대화 삭제하기 모달 취소 클릭',
      'sideMenuDeleteAllCancel',
    );
  };

  //채팅 - 사이드바 - '버그 제보하기' 클릭
  public static clickSideMenuBugReportButton = (): void => {
    this.sendEvent('채팅 - 사이드바 - 버그 제보하기 클릭', 'sideMenuBugReportButton');
  };
  //채팅 - 사이드바 - '제안 및 문의' 클릭
  public static clickSideMenuInquiryButton = (): void => {
    this.sendEvent('채팅 - 사이드바 - 제안 및 문의 클릭', 'sideMenuInquiryButton');
  };
  //채팅 - 사이드바 - '쿠키 팬아트 보내기' 클릭
  public static clickSideMenuCookieFanArtButton = (): void => {
    this.sendEvent('채팅 - 사이드바 - 쿠키 팬아트 보내기 클릭', 'sideMenuCookieArtButton');
  };

  //감정 기록 화면 진입
  public static watchEmotionRecordScreen = (): void => {
    this.sendEvent('감정 기록 화면 진입', 'emotionRecordScreen');
  };
  //감정 기록 화면 - <원하는 감정이 없어요> 버튼 클릭
  public static clickNoEmotionButton = (): void => {
    this.sendEvent('감정 기록 화면 - <원하는 감정이 없어요> 버튼 클릭', 'noEmotionButton');
  };

  //감정 기록 화면 - <원하는 감정이 없어요> 버튼 클릭 - 커스텀 감정 선택 시트 진입
  public static watchCustomEmotionSheet = (keyword: string): void => {
    this.sendEvent(
      '감정 기록 화면 - <원하는 감정이 없어요> 버튼 클릭 - 커스텀 감정 선택 시트 진입',
      'customEmotionSheet',
      { keyword },
    );
  };

  //감정 기록 화면 - <원하는 감정이 없어요> 버튼 클릭 - 커스텀 감정 선택 시트 진입 - <나의 감정 추가하기> 버튼 클릭
  public static clickAddCustomEmotionButton = (): void => {
    this.sendEvent(
      '감정 기록 화면 - <원하는 감정이 없어요> 버튼 클릭 - 커스텀 감정 선택 시트 진입 - <나의 감정 추가하기> 버튼 클릭',
      'addCustomEmotionButton',
    );
  };
  //감정 기록 화면 - <감정만 기록하기> 버튼 클릭 -> 1.5.7 이후로 삭제
  public static clickEmotionRecordButton = (): void => {
    this.sendEvent('감정 기록 - <감정만 기록하기> 버튼 클릭', 'emotionRecordButton');
  };

  //감정 기록 화면 - <마음일기 쓰러가기> 버튼 클릭
  public static clickGotoDiaryWriteButton = (): void => {
    this.sendEvent('감정 기록 화면 - <마음일기 쓰러가기> 버튼 클릭', 'gotoDiaryWriteButton');
  };

  //일기 기록 화면 진입
  public static watchDiaryWriteScreen = (): void => {
    this.sendEvent('일기 기록 화면 진입', 'diaryWriteScreen');
  };

  //일기 기록 화면 - <쿠키에게 알려주기> 버튼 클릭
  public static clickDiaryWriteButton = (): void => {
    this.sendEvent('일기 기록 화면 - <일기 기록하기> 버튼 클릭', 'diaryWriteButton');
  };

  //일기 기록 화면 - <사진첨부> 버튼 클릭
  public static clickAddPicButton = (): void => {
    this.sendEvent('일기 기록 화면 - <사진 첨부하기> 버튼 클릭', 'addPicButton');
  };

  //일기 기록 화면 - <사진첨부> - <광고> - 네 버튼 클릭
  public static clickWatchAdsButton = (): void => {
    this.sendEvent('일기 기록 화면 - <광고 시청> 모달 - <저장하기> 버튼 클릭', 'save');
  };

  //일기 기록 화면 - <사진 첨부> - <광고 모달> - 저장하기 클릭 후 광고 송출
  public static watchAdsScreen = (): void => {
    this.sendEvent(
      '일기 기록 화면 - <사진 첨부> - <광고 모달> - 저장하기 클릭 후 광고 송출',
      'watchAdsScreen',
    );
  };

  //일기 기록 화면 - <사진 첨부> - <광고 모달> - 저장하기 클릭 후 광고 송출 - 리워드 지급
  public static watchEarnRewardScreen = (): void => {
    this.sendEvent(
      '일기 사진 첨부 광고 송출 후, 리워드 지급 - 홈 화면으로 이동',
      'watchEarnRewardScreen',
    );
  };

  //일기 기록 화면 - <사진 첨부> - <광고 모달> - 저장하기 클릭 후 광고 송출 - 리워드 미지급
  public static watchNoEarnRewardScreen = (): void => {
    this.sendEvent('일기 사진 첨부 광고 송출 후, 일기 저장에 오류 발생', 'watchEarnRewardScreen');
  };

  //일기 기록 화면 - <사진첨부> - <광고> - 취소 버튼 클릭
  public static clickNoWatchAdsButton = (): void => {
    this.sendEvent('일기 기록 화면 - <광고 시청> 모달 - <취소> 버튼 클릭', 'cancel');
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

  //대화방 설정 화면
  public static watchChattingSettingScreen = (): void => {
    this.sendEvent('설정 - 대화방 설정 - 대화방 설정 화면 진입', 'chattingSettingScreen');
  };

  //대화방 설정 - 반말 모드 스위치 클릭
  public static clickChattingSettingSwitch = (isInformal: boolean): void => {
    this.sendEvent('대화방 설정 - 반말 모드 스위치 클릭', 'chattingSettingSwitch', {
      isInformal,
    });
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
  //위험 상황 편지 - SSR 버튼 클릭
  public static clickDangerLetterSSRButton = (text: string): void => {
    this.sendEvent('위험 상황 편지 - SSR 버튼 클릭', 'dangerLetterCallButton', {
      text,
    });
  };

  //앱 공지 클릭
  public static clickAppNoticeButton = (link: string): void => {
    this.sendEvent('앱 공지 클릭', 'clickAppNoticeButton', { link });
  };
}
