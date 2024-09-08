import React, { useEffect } from 'react';
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

const EmotionBtn = ({ navigation }) => {
  const [name, setName] = React.useState<string>('');
  const { selectedEmotions, addEmotion, removeEmotion } = useEmotionStore();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setName(getUserNickname() + '');
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);
  return (
    <>
      <HomeBtn
        onPress={() => {
          if (selectedEmotions.length > 0) {
            //수정하는 경우
            navigation.navigate(RootStackName.HomeStackNavigator, {
              screen: HomeStackName.SmallEmotionChart,
            });
          } else {
            //감정을 입력한 경우
            navigation.navigate(RootStackName.HomeStackNavigator, {
              screen: HomeStackName.LargeEmotionChart,
            });
          }
        }}
        status={'emotion'}>
        <HomeBtnTitle>
          {selectedEmotions.length > 0
            ? `${name}님,${'\n'}오늘의 마음을 확인해보세요!`
            : `${name}님,${'\n'}오늘의 마음은 어떤가요?`}
        </HomeBtnTitle>
        <HomeBtnDescription>
          <HomeBtnText status={'mood'}>
            {' '}
            {selectedEmotions.length > 0 ? `감정 수정하기` : `감정 기록하기`}
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
          {selectedEmotions.length > 0 ? (
            selectedEmotions.map((emotion, index) => (
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
                //backgroundColor: 'black',
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
