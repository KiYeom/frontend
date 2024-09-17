import React, { useEffect, useState } from 'react';
import {
  HomeBtn,
  HomeBtnTitle,
  HomeBtnDescription,
  HomeBtnText,
} from '../HomeBtn/HomeChatBtn.style';
import '../HomeBtn/HomeChatBtn';
import { css } from '@emotion/native';
import { View } from 'react-native';
import { getUserNickname } from '../../../utils/storageUtils';
import { rsHeight, rsWidth } from '../../../utils/responsive-size';
import { HomeStackName, RootStackName } from '../../../constants/Constants';
import Icon from '../../icons/icons';
import palette from '../../../assets/styles/theme';
import { EmotionImage } from '../HomeBtn/HomeChatBtn.style';
import useEmotionStore from '../../../utils/emotion-status';
import { Text } from 'react-native';
import EmotionCard from '../EmotionCard/EmotionCard';
import { todayEmotionCheck } from '../../../apis/analyze';
import useRecordedEmotionStore from '../../../utils/emotion-recorded';
import { TEmotionCheck } from '../../../apis/analyze.type';
import { ActivityIndicator } from 'react-native-paper';

const EmotionBtn = ({ navigation }) => {
  const [name, setName] = useState<string>('');
  const { recordedEmotions, setRecordedEmotions } = useRecordedEmotionStore();
  const [isNULL, setIsNULL] = useState(false);
  const [loading, setLoading] = useState(false); //로딩중이면 true, 로딩이 끝났으면 false

  useEffect(() => {
    //데이터 가져오기
    const fetchData = async () => {
      try {
        const data = await todayEmotionCheck(); // 데이터를 비동기로 가져옴
        console.log('useEffect data', data);
        if (!data.isNULL) {
          //Keyword가 있으면 state 업데이트 {keyword : "키워드", gruop : "group"} 형태
          setRecordedEmotions(data.Keywords);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error); // 에러 처리
      }
    };
    // 화면이 focus될 때마다 실행
    const handleFocus = () => {
      setName(getUserNickname() + ''); // 사용자 이름 설정
      fetchData(); // 데이터 fetch
      setLoading(false);
    };

    const unsubscribe = navigation.addListener('focus', handleFocus);
    // 컴포넌트 unmount 시 리스너를 해제
    return () => {
      unsubscribe();
    };
  }, [navigation]);

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color={palette.primary[500]} />
      </View>
    );
  }

  return (
    <HomeBtn
      onPress={() => {
        if (!isNULL) {
          //입력한 감정을 수정하는 경우
          //console.log('selectedEmotions', selectedEmotions);
          navigation.navigate(RootStackName.HomeStackNavigator, {
            screen: HomeStackName.SmallEmotionChart,
          });
        } else {
          //아직 입력하지 않아, 감정을 입력해야 하는 경우
          navigation.navigate(RootStackName.HomeStackNavigator, {
            screen: HomeStackName.LargeEmotionChart,
          });
        }
      }}
      status={'emotion'}>
      {loading ? (
        <View>
          <ActivityIndicator size="large" color={palette.primary[500]} />
        </View>
      ) : (
        <>
          <HomeBtnTitle>
            {!isNULL
              ? `${name}님,${'\n'}오늘의 마음을 확인해보세요!`
              : `${name}님,${'\n'}오늘의 마음은 어떤가요?`}
          </HomeBtnTitle>
          <HomeBtnDescription>
            <HomeBtnText status={'mood'}>
              {' '}
              {!isNULL ? `감정 수정하기` : `감정 기록하기`}
            </HomeBtnText>
            <Icon
              name="arrow-right"
              width={rsWidth * 6 + 'px'}
              height={rsHeight * 12 + 'px'}
              color={palette.neutral[500]}
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
            {recordedEmotions.length ? (
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
      )}
    </HomeBtn>
  );
};
export default EmotionBtn;
