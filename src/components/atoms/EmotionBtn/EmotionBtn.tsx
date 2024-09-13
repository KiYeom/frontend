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

const EmotionBtn = ({ navigation }) => {
  const [name, setName] = useState<string>('');
  //const [selectedEmotions, setSelectedEmotions] = useState([]);
  const { recordedEmotions, setRecordedEmotions } = useRecordedEmotionStore();
  const { selectedEmotions, setSelectedEmotions, addEmotion, removeEmotion } = useEmotionStore();
  const [isNULL, setIsNULL] = useState(false);

  useEffect(() => {
    console.log('emotionBtn');
    const unsubscribe = navigation.addListener('focus', () => {
      setName(getUserNickname() + '');
    });
    const fetchData = async () => {
      const dailyEmotionData = await todayEmotionCheck(); //isNULL, Keywords
      if (!dailyEmotionData.isNULL) {
        setRecordedEmotions(dailyEmotionData.Keywords);
        setSelectedEmotions(dailyEmotionData.Keywords);
        console.log('dailyEmotionData.Keywords', dailyEmotionData.Keywords);
        console.log('dailyEmotionData.Keywords', dailyEmotionData.Keywords);
      }
      setIsNULL(dailyEmotionData.isNULL);
    };
    fetchData();
    return unsubscribe;
  }, [navigation]);

  return (
    <>
      <HomeBtn
        onPress={() => {
          if (!isNULL) {
            //입력한 감정을 수정하는 경우
            console.log('selectedEmotions', selectedEmotions);
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
        <HomeBtnTitle>
          {!isNULL
            ? `${name}님,${'\n'}오늘의 마음을 확인해보세요!`
            : `${name}님,${'\n'}오늘의 마음은 어떤가요?`}
        </HomeBtnTitle>
        <HomeBtnDescription>
          <HomeBtnText status={'mood'}> {!isNULL ? `감정 수정하기` : `감정 기록하기`}</HomeBtnText>
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
      </HomeBtn>
    </>
  );
};
export default EmotionBtn;
