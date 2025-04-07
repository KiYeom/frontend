import React from 'react';
import { View, Text } from 'react-native';
import Icon from '../icons/icons';
import { UpDownContainer, ScrollBtnContainer } from './UpDownBtn.style';
import palette from '../../assets/styles/theme';
import ArrowBtn from './ArrowBtn';
const UpDownBtn = (props) => {
  const { enableUp, enableDown, setEnableUp, setEnableDown, handleSearch, searchWord } = props;
  //console.log('enableUp, enableDown, searchWord', enableUp, enableDown, searchWord);
  return (
    <UpDownContainer>
      <ArrowBtn
        enable={enableUp}
        iconName={'arrow-up'}
        handleSearch={handleSearch}
        searchWord={searchWord}
      />
      <ArrowBtn
        enable={enableDown}
        iconName={'arrow-down'}
        handleSearch={handleSearch}
        searchWord={searchWord}
      />
    </UpDownContainer>
  );
};
export default UpDownBtn;
