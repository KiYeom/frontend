// NewPeriodKeywordArea.tsx
import React, { useMemo } from 'react';
import { Dimensions } from 'react-native';
import WordCloud from 'rn-wordcloud';
import Empty from '../Empty';
import { SectionTitle } from '../StatisticMain.style';
import {
  Container,
  HeaderContainer,
  CardContainer,
  EmptyContainer,
  constants,
} from './NewPeriodKeywordArea.style';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';

const { width: screenWidth } = Dimensions.get('window');

// 타입 정의
interface KeywordData {
  text: string;
  value: number;
  color: string;
}

interface RankingSetting {
  color: string;
  fontSize: number;
}

interface PeriodKeywordAreaProps {
  periodKeywordList: string[];
}

const RANKING_SETTINGS: RankingSetting[] = [
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

const NewPeriodKeywordArea: React.FC<PeriodKeywordAreaProps> = ({ periodKeywordList }) => {
  // WordCloud 데이터 변환
  const wordCloudData = useMemo((): KeywordData[] => {
    if (!periodKeywordList?.length) {
      return [];
    }

    return periodKeywordList.map((keyword, index) => {
      const setting = RANKING_SETTINGS[index] || RANKING_SETTINGS[RANKING_SETTINGS.length - 1];
      return {
        text: keyword,
        value: setting.fontSize,
        color: setting.color,
      };
    });
  }, [periodKeywordList]);

  // 워드 클릭 핸들러
  const handleWordPress = (word: string): void => {
    console.log('키워드 클릭:', word);
    // 추가 로직 구현 가능
  };

  // 컨테이너 너비 계산
  const containerWidth = screenWidth - constants.CONTAINER_PADDING * 2 * rsWidth;

  // WordCloud 옵션
  const wordCloudOptions = {
    words: wordCloudData,
    verticalEnabled: false,
    minFont: constants.WORD_CLOUD_MIN_FONT * rsFont,
    maxFont: constants.WORD_CLOUD_MAX_FONT * rsFont,
    fontOffset: constants.FONT_OFFSET,
    width: containerWidth,
    height: constants.WORD_CLOUD_HEIGHT * rsHeight,
    fontFamily: 'Kyobo-handwriting',
    backgroundColor: 'transparent',
    spiral: 'rectangular',
    padding: constants.WORD_CLOUD_PADDING,
  };

  return (
    <Container>
      <HeaderContainer>
        <SectionTitle>그 동안 이런 이야기를 나눴어요</SectionTitle>
      </HeaderContainer>

      <CardContainer>
        {wordCloudData.length > 0 && (
          <WordCloud options={wordCloudOptions} onWordPress={() => {}} />
        )}
      </CardContainer>
    </Container>
  );
};

export default NewPeriodKeywordArea;
