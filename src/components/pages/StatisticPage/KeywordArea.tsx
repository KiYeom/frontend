import React from 'react';
import { useEffect, useState } from 'react';
import { dailyAnalyze } from '../../../apis/analyze';
import { Text, View } from 'react-native';
import Keyword from './Keyword';
import { KeywordContainer } from './Keyword.style';
import { KeywordTitle, Container } from './Keyword.style';

const KeywordArea: React.FC<any> = (props: any) => {
  const { value } = props;
  const [summaryList, setSummaryList] = useState<string[]>([]);
  //일상 키워드 리스트
  useEffect(() => {
    const fetchData = async () => {
      const res = await dailyAnalyze(value);
      console.log('res', res);
      if (res.summary.isNULL === false) {
        setSummaryList(res.summary.keywords);
      } else {
        setSummaryList([]);
      }
    };
    fetchData();
  }, [value]);

  console.log('test', summaryList);
  return (
    <Container>
      <KeywordTitle>나의 일상 키워드</KeywordTitle>
      {summaryList.length === 0 ? (
        <Text>비어있습니다</Text>
      ) : (
        summaryList.map((keyword, index) => <Keyword index={index} keywordText={keyword} />)
      )}
    </Container>
  );
};
export default KeywordArea;
