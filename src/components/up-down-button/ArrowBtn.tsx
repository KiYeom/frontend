import React from 'react';
import { ScrollBtnContainer } from './UpDownBtn.style';
import Icon from '../icons/icons';
import palette from '../../assets/styles/theme';
const ArrowBtn = (props) => {
  const { enable, iconName, handleSearch, searchWord } = props;
  console.log('searchWord', searchWord);
  return (
    <ScrollBtnContainer
      enable={enable}
      onPress={() => {
        console.log(iconName, '버튼 누름');
        handleSearch(searchWord, 'up');
      }}>
      <Icon
        name={iconName}
        width={24}
        color={enable ? palette.neutral[50] : palette.neutral[300]}
      />
    </ScrollBtnContainer>
  );
};
export default ArrowBtn;
