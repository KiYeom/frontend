import React, { useRef, useEffect } from 'react';
import { View, Alert } from 'react-native';
import {
  getUserNickname,
  getPhotoCardLyric,
  getPhotoCardImage,
  savePhotoCardData,
} from '../../../utils/storageUtils';
import * as MediaLibrary from 'expo-media-library';
import { happyLyrics, happyLyricsObject } from '../../../constants/Constants';
import Analytics from '../../../utils/analytics';
import BeforeOpenCookieView from './beforeOpenCookieView';
import LoadingView from './loadingView';
import ShowCookieResultView from './showCookieResultView';
import { deletePhotoCardData } from '../../../utils/storageUtils';
import { getUserCanOpenQuote } from '@apis/positive-quote';
import { usePhotoCardActions } from '@hooks/usePhotoCardActions';
const backgroundImages = [
  {
    id: 'bg1',
    source: require('../../../assets/images/lucky_image_1.png'),
    textPosition: { top: 53 }, // 기본 위치
  },
  {
    id: 'bg2',
    source: require('../../../assets/images/lucky_image_2.png'),
    textPosition: { top: 297 }, // 기본 위치
  },
  {
    id: 'bg3',
    source: require('../../../assets/images/lucky_image_3.png'),
    textPosition: { top: 53 }, // 기본 위치
  },
  {
    id: 'bg4',
    source: require('../../../assets/images/lucky_image_4.png'),
    textPosition: { top: 53 }, // 기본 위치
  },
  {
    id: 'bg5',
    source: require('../../../assets/images/lucky_image_5.png'),
    textPosition: { top: 33 }, // 기본 위치
  },
];

const userName = getUserNickname() ?? 'Test_remind_empty';

export enum QuoteUiMode {
  BEFORE_OPEN_COOKIE = 'beforeOpenCookie',
  SHOW_COOKIE_RESULT = 'showCookieResult',
  LOADING = 'loading',
}

const getRandomLyricAndImage = () => {
  const lyricIndex = Math.floor(Math.random() * happyLyrics.length);
  const imageIndex = Math.floor(Math.random() * backgroundImages.length);

  return {
    lyric: happyLyrics[lyricIndex],
    image: backgroundImages[imageIndex],
  };
};

// 로컬스토리지로부터 저장된 데이터를 불러오는 함수
const loadSavedData = () => {
  const savedLyric = getPhotoCardLyric();
  const savedImage = getPhotoCardImage(backgroundImages);

  if (savedLyric && savedImage) {
    return { lyric: savedLyric, image: savedImage };
  }
  return null;
};

const createAndSaveNewData = () => {
  const { lyric, image } = getRandomLyricAndImage();
  savePhotoCardData(lyric, image);
  return { lyric, image };
};

const Quote: React.FC = () => {
  const [uiMode, setUiMode] = React.useState<QuoteUiMode>(QuoteUiMode.BEFORE_OPEN_COOKIE);
  const [status, requestPermission] = MediaLibrary.usePermissions(); //사진 권한
  const imageRef = useRef<View>(null);
  const [selectedLyricObject, setSelectedLyricObject] = React.useState<happyLyricsObject | null>(
    null,
  );
  const [selectedImageSource, setSelectedImageSource] = React.useState<any | null>(null);
  if (status === null) {
    requestPermission();
  } else {
    //console.log('사진 권한 상태', status);
  }
  // 컴포넌트 초기화 시 저장된 데이터 확인
  useEffect(() => {
    const initializeQuote = async () => {
      try {
        const response = await getUserCanOpenQuote();
        //const response = { result: false }; // 테스트용으로 항상 false로 설정
        //deletePhotoCardData();

        //1. 오늘 열어본 적 없는 경우
        if (response && response.result) {
          console.log('오늘 열어본 적 없음');
          setUiMode(QuoteUiMode.BEFORE_OPEN_COOKIE);
          Analytics.watchBeforeOpenHappyLyricsImageScreen();
          return;
        }
        //오늘 이미 열어본 경우
        if (response && !response.result) {
          const savedData = loadSavedData();
          if (savedData) {
            console.log('저장된 데이터가 있음', savedData);
            setSelectedLyricObject(savedData.lyric);
            setSelectedImageSource(savedData.image);
            setUiMode(QuoteUiMode.SHOW_COOKIE_RESULT);
          } else {
            console.log('저장된 데이터가 없음, 새로운 데이터 생성');
            const newData = createAndSaveNewData();
            setSelectedLyricObject(newData.lyric);
            setSelectedImageSource(newData.image);
            setUiMode(QuoteUiMode.BEFORE_OPEN_COOKIE);
          }
          Analytics.watchHappyLyricsImageScreen();
          return;
        }
        throw new Error('API 응답 오류');
      } catch (error) {
        console.error('Quote 컴포넌트 초기화 오류:', error);
        Alert.alert('오류 발생', '잠시 후 다시 시도해주세요.');
        setUiMode(QuoteUiMode.BEFORE_OPEN_COOKIE);
      }
    };
    initializeQuote();
  }, []);

  // 사진 저장 및 공유
  const { onSaveImageAsync, onShareImageAsync } = usePhotoCardActions(imageRef);

  //오늘 열어본 적이 있다면
  switch (uiMode) {
    case QuoteUiMode.BEFORE_OPEN_COOKIE:
      return (
        <BeforeOpenCookieView
          onOpenCookie={() => {
            setUiMode(QuoteUiMode.LOADING);
          }}
        />
      );
    case QuoteUiMode.LOADING:
      return (
        <LoadingView
          selectedImageSource={selectedImageSource}
          selectedLyricObject={selectedLyricObject}
          onLoadingComplete={() => setUiMode(QuoteUiMode.SHOW_COOKIE_RESULT)}
        />
      );
    case QuoteUiMode.SHOW_COOKIE_RESULT:
      return (
        <ShowCookieResultView
          userName={userName}
          imageRef={imageRef}
          selectedImageSource={selectedImageSource}
          selectedLyricObject={selectedLyricObject}
          onSaveImage={onSaveImageAsync}
          onShareImage={onShareImageAsync}
        />
      );
    default:
      return null;
  }
};
export default Quote;
