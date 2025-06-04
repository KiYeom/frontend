import { css } from '@emotion/native';
import React, { useMemo } from 'react';
import { TouchableOpacity, View, Dimensions } from 'react-native';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';
import Empty from '../Empty';
import { SectionTitle } from '../StatisticMain.style';
import Icon from '../../../components/icons/icons';
import palette from '../../../assets/styles/theme';
import WordCloud from 'rn-wordcloud';

const { width: screenWidth } = Dimensions.get('window');

const HINT_NAME = 'period-keyword';
const HINT_MESSAGE = '그 동안 쿠키와 나눴던 이야기를 키워드로 정리해봤어요!';

const NewPeriodKeywordArea: React.FC<any> = (props: any) => {
  const { periodKeywordList, hintStatus, setHintStatus } = props;
  console.log('PeriodKeywordArea props:', periodKeywordList);

  // periodKeywordList를 WordCloud 데이터 형식으로 변환
  const wordCloudData = useMemo(() => {
    if (!periodKeywordList || periodKeywordList.length === 0) {
      return [];
    }

    // 색상 팔레트
    const colors = [
      palette.primary?.[500] || '#3B82F6',
      palette.secondary?.[500] || '#8B5CF6',
      '#EF4444',
      '#10B981',
      '#F59E0B',
      '#EC4899',
      '#6366F1',
      '#14B8A6',
      '#F97316',
      '#84CC16',
    ];

    return periodKeywordList.map((keyword, index) => {
      // 랭킹에 따른 가중치 (상위일수록 높은 값)
      const ranking = index + 1;
      const maxValue = 10;
      const minValue = 3;
      const value = Math.max(minValue, maxValue - (ranking - 1) * 0.5);

      return {
        text: keyword,
        value: Math.round(value),
        color: colors[index % colors.length],
      };
    });
  }, [periodKeywordList]);

  const handleWordPress = (word) => {
    console.log('키워드 클릭:', word);
  };

  const containerWidth = screenWidth - 40 * rsWidth; // padding 제외

  return (
    <View
      style={css`
        gap: ${12 * rsHeight + 'px'};
        padding-horizontal: ${rsWidth * 20 + 'px'};
      `}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
        <SectionTitle>그 동안 이런 이야기를 나눴어요</SectionTitle>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 4 }}>
          <TouchableOpacity
            activeOpacity={1}
            style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 4 }}
            onPress={() => setHintStatus(hintStatus ? undefined : HINT_NAME)}>
            <Icon name="information" width={16} height={16} />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          width: '100%',
          backgroundColor: '#F8FAFC',
          borderRadius: 16 * rsWidth,
          borderWidth: 1,
          borderColor: '#E2E8F0',
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {wordCloudData && wordCloudData.length > 0 ? (
          <WordCloud
            options={{
              words: wordCloudData,
              verticalEnabled: false,
              minFont: 12 * rsFont,
              maxFont: 24 * rsFont,
              fontOffset: 8,
              width: containerWidth,
              height: 300 * rsHeight,
              fontFamily: 'Kyobo-handwriting',
              backgroundColor: 'transparent',
              spiral: 'rectangular',
              padding: 20,
            }}
            onWordPress={handleWordPress}
          />
        ) : (
          <View
            style={{
              height: 250 * rsHeight,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Empty type="채팅기록" />
          </View>
        )}
      </View>
    </View>
  );
};

export default NewPeriodKeywordArea;
