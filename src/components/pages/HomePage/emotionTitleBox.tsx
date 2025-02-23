import {
  EmotionMainTitle,
  EmotionSubTitle,
  EmotionTitleContainer,
  EmotionTextContainer,
} from './emotionTitleBox.styles';
import { TIconName } from '../../icons/icons';
import Icon from '../../icons/icons';
type EmotionTitleBoxProps = {
  iconName?: TIconName;
  mainTitle?: string;
  subTitle?: string;
};

const EmotionTitleBox = (props: EmotionTitleBoxProps) => {
  const { iconName, mainTitle, subTitle } = props;
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
export default EmotionTitleBox;
