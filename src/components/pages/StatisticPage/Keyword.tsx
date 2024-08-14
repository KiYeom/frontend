import React from 'react';
import { Text } from 'react-native';
import { KeywordContainer, KeywordText, KeywordIcon } from './Keyword.style';
import Icon from '../../icons/icons';
import { rsWidth, rsHeight, rsFont } from '../../../utils/responsive-size';
import palette from '../../../assets/styles/theme';

export type KeywordProps = {
  index: number;
  keywordText: string;
};

const Keyword = (props: KeywordProps) => {
  const { index, keywordText } = props;
  return (
    <KeywordContainer>
      <KeywordIcon index={index}>
        <Icon
          name={'clover-icon'}
          width={rsWidth * 18.9}
          height={rsHeight * 18.9}
          color={
            index === 0 ? palette.primary[500] : index === 1 ? palette.function.warning : '#A395F1'
          }
        />
      </KeywordIcon>
      <KeywordText>{keywordText}</KeywordText>
    </KeywordContainer>
  );
};
export default Keyword;
