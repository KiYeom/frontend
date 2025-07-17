import React from 'react';
import palette from '../../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';
import Icon from '../../../components/icons/icons';
import { KeywordContainer, KeywordIcon, KeywordText } from './Keyword.style';
import { Text, TouchableOpacity, View } from 'react-native';
import { css } from '@emotion/native';
type KeywordProps = {
  summaryList: string[];
};

const KeywordArea = ({ summaryList }: KeywordProps) => {
  return (
    <>
      {summaryList.map((keyword, index) => (
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
      ))}
    </>
  );
};
export default KeywordArea;
