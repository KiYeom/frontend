import React from 'react';
import { useEffect, useState } from 'react';
import { dailyAnalyze } from '../../../../apis/analyze';
import { Text, View } from 'react-native';
import Keyword from './Keyword';
import {
  KeywordTitle,
  Container,
  KeywordText,
  KeywordContainer,
  KeywordIcon,
} from './Keyword.style';
import palette from '../../../../assets/styles/theme';
import Icon from '../../../icons/icons';
import { Image } from 'expo-image';
import { rsWidth, rsHeight, rsFont } from '../../../../utils/responsive-size';
import { Title, DescText } from '../StatisticMain.style';
import Empty from '../Empty';

const KeywordArea: React.FC<any> = (props: any) => {
  const { value, isSummaryList, summaryList } = props;

  return (
    <Container>
      <Title>나의 일상 키워드</Title>
      {summaryList.length === 0 ? (
        <Empty type="채팅기록"></Empty>
      ) : (
        summaryList.map((keyword, index) => (
          <KeywordContainer>
            <KeywordIcon index={index}>
              <Icon
                name={'clover-icon'}
                width={rsWidth * 18.9}
                height={rsHeight * 18.9}
                color={
                  index === 0
                    ? palette.primary[500]
                    : index === 1
                      ? palette.function.warning
                      : '#A395F1'
                }
              />
            </KeywordIcon>
            <KeywordText>{keyword}</KeywordText>
          </KeywordContainer>
        ))
      )}
    </Container>
  );
};
export default KeywordArea;
