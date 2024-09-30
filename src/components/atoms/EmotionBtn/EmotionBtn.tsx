import * as amplitude from '@amplitude/analytics-react-native';
import { css } from '@emotion/native';
import React, { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { todayEmotionCheck } from '../../../apis/analyze';
import palette from '../../../assets/styles/theme';
import { HomeStackName, RootStackName } from '../../../constants/Constants';
import useRecordedEmotionStore from '../../../utils/emotion-recorded';
import { rsHeight, rsWidth } from '../../../utils/responsive-size';
import { getUserNickname } from '../../../utils/storageUtils';
import Icon from '../../icons/icons';
import EmotionCard from '../EmotionCard/EmotionCard';
import '../HomeBtn/HomeChatBtn';
import {
  EmotionImage,
  HomeBtn,
  HomeBtnDescription,
  HomeBtnText,
  HomeBtnTitle,
} from '../HomeBtn/HomeChatBtn.style';

const EmotionBtn = ({ navigation }) => {
  const [name, setName] = useState<string>('');
  const { recordedEmotions, setRecordedEmotions } = useRecordedEmotionStore();
  const [isNULL, setIsNULL] = useState(true);
  const [loading, setLoading] = useState(true); //로딩 시작을 true로 설정

  useEffect(() => {
    //데이터 가져오기
    const fetchData = async () => {
      setLoading(true); // 로딩 시작
      try {
        const data = await todayEmotionCheck(); // 데이터를 비동기로 가져옴
        if (!data.isNULL) {
          //console.log('데이터가 있음');
          // Keyword가 있으면 state 업데이트 {keyword : "키워드", group : "group"} 형태
          setRecordedEmotions(data.Keywords);
          setIsNULL(false); // 데이터가 있으면 false로 설정
        } else {
          setRecordedEmotions([]);
          setIsNULL(true); // 데이터가 없으면 true로 설정
        }
      } catch (error) {
        //console.error('Failed to fetch data:', error); // 에러 처리
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    // 화면이 focus될 때마다 실행
    const handleFocus = () => {
      setName(getUserNickname() + ''); // 사용자 이름 설정
      fetchData(); // 데이터 fetch
    };

    const unsubscribe = navigation.addListener('focus', handleFocus);
    // 컴포넌트 unmount 시 리스너를 해제
    return () => {
      unsubscribe();
    };
  }, [navigation]);

  // 로딩 상태일 때 로딩 스피너 표시
  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color={palette.primary[500]} />
      </View>
    );
  }

  return (
    <HomeBtn
      os={Platform.OS}
      onPress={() => {
        navigation.navigate(RootStackName.HomeStackNavigator, {
          screen: HomeStackName.SmallEmotionChart,
        });
        amplitude.track('감정 입력 버튼 클릭');
      }}
      status={'emotion'}>
      <>
        <HomeBtnTitle>
          {!isNULL
            ? `${name}님,${'\n'}오늘의 마음을 확인해보세요!`
            : `${name}님,${'\n'}오늘의 마음은 어떤가요?`}
        </HomeBtnTitle>
        <HomeBtnDescription color={palette.neutral[500]}>
          <HomeBtnText status={'mood'}>{!isNULL ? `감정 수정하기` : `감정 기록하기`}</HomeBtnText>
          <Icon
            name="arrow-right"
            width={rsWidth * 6 + 'px'}
            height={rsHeight * 12 + 'px'}
            color={palette.neutral[50]}
          />
        </HomeBtnDescription>
        <View
          style={css`
            position: absolute;
            right: 0;
            bottom: 0;
            width: 100%;
            height: ${rsHeight * 130 + 'px'};
            justify-content: center;
            align-items: center;
            flex-direction: row;
            padding-left: ${rsWidth * 8 + 'px'};
          `}>
          {!isNULL ? (
            recordedEmotions.map((emotion, index) => (
              <EmotionCard
                key={index}
                emotion={emotion}
                onPress={() => console.log('눌림')}
                status={'simple'}
              />
            ))
          ) : (
            <EmotionImage
              style={{
                resizeMode: 'contain',
              }}
              source={require('../../../assets/images/test.png')}
            />
          )}
        </View>
      </>
    </HomeBtn>
  );
};
export default EmotionBtn;
