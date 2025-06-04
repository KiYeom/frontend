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

    // 순위별 색상과 폰트 크기 설정
    const rankingSettings = [
      { color: '#6F9AE9', fontSize: 30 }, // 1순위
      { color: '#58C3A5', fontSize: 26 }, // 2순위
      { color: '#9C7AB9', fontSize: 22 }, // 3순위
      { color: '#003856', fontSize: 18 }, // 4순위
      { color: '#EB6548', fontSize: 14 }, // 5순위
      { color: '#70AABD', fontSize: 12 }, // 6순위
      { color: '#4D766E', fontSize: 12 }, // 7순위
      { color: '#84869B', fontSize: 12 }, // 8순위
      { color: '#E6798F', fontSize: 12 }, // 9순위
      { color: '#FCB31E', fontSize: 12 }, // 10순위
    ];

    return periodKeywordList.map((keyword, index) => {
      // 순위 (0-based index를 1-based로 변환)
      const ranking = index;

      // 순위에 따른 설정 가져오기 (10순위를 넘어가면 마지막 설정 사용)
      const setting = rankingSettings[ranking] || rankingSettings[rankingSettings.length - 1];

      // WordCloud에서 사용할 value는 폰트 크기를 기준으로 설정
      // rsFont 적용을 위해 fontSize를 그대로 사용
      const value = setting.fontSize;

      return {
        text: keyword,
        value: value,
        color: setting.color,
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
              minFont: 12 * rsFont, // 최소 폰트는 12px로 유지
              maxFont: 30 * rsFont, // 최대 폰트는 30px로 설정
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
