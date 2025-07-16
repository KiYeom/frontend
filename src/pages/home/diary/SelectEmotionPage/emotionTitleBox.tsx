import {
  EmotionMainTitle,
  EmotionSubTitle,
  EmotionTitleContainer,
  EmotionTextContainer,
} from './emotionTitleBox.styles';
import { TIconName } from '../../../../components/icons/icons';
import Icon from '../../../../components/icons/icons';
import React from 'react';
type EmotionTitleBoxProps = {
  iconName?: TIconName;
  mainTitle?: string;
  subTitle?: string;
};

const EmotionTitleBox = (props: EmotionTitleBoxProps) => {
  const { iconName, mainTitle, subTitle } = props;
  //console.log('emotionTitlteBox', iconName, mainTitle, subTitle);
  return (
    <EmotionTitleContainer>
      {!!iconName && <Icon name={iconName} width={90} />}
      <EmotionTextContainer>
        <EmotionMainTitle>{mainTitle}</EmotionMainTitle>
        <EmotionSubTitle>{subTitle}</EmotionSubTitle>
      </EmotionTextContainer>
    </EmotionTitleContainer>
  );
};
export default React.memo(EmotionTitleBox);
