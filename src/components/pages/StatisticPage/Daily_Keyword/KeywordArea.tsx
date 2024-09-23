import React from 'react';
import palette from '../../../../assets/styles/theme';
import { rsHeight, rsWidth } from '../../../../utils/responsive-size';
import Icon from '../../../icons/icons';
import Empty from '../Empty';
import { Title } from '../StatisticMain.style';
import { Container, KeywordContainer, KeywordIcon, KeywordText } from './Keyword.style';

const KeywordArea: React.FC<any> = (props: any) => {
  const { value, isSummaryList, summaryList } = props;

  return (
    <Container>
      <Title>나의 일상 키워드</Title>
      {summaryList.length === 0 ? (
        <Empty type="채팅기록"></Empty>
      ) : (
        summaryList.map((keyword, index) => (
          <KeywordContainer key={index}>
            <KeywordIcon index={index}>
              <Icon
                name={'clover-icon'}
                width={rsWidth * 18}
                height={rsHeight * 18}
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
