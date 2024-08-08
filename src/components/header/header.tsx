import { rsWidth } from '../../utils/responsive-size';
import { useNavigation } from '@react-navigation/native';
import palette from '../../assets/styles/theme';
import Icon, { TIconName } from '../icons/icons';
import {
  HeaderLeft,
  HeaderCenter,
  HeaderContainer,
  HeaderTitle,
  OptionText,
  HeaderRight,
} from './header.styles';

type HeaderProps = {
  title?: string;
  isLeft?: boolean;
  leftIcon?: TIconName;
  leftText?: string;
  leftFunction?: () => void;

  isRight?: boolean;
  rightIcon?: TIconName;
  rightText?: string;
  rightFunction?: () => void;
};
const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const navigation = useNavigation();
  const {
    title = undefined,
    isLeft = true,
    leftIcon = 'arrow-left',
    leftText = undefined,
    leftFunction = () => {
      navigation.goBack();
    },

    isRight = false,
    rightIcon = 'arrow-right',
    rightText = undefined,
    rightFunction = () => {},
  } = props;
  return (
    <HeaderContainer isTitle={title !== undefined}>
      <HeaderCenter>
        <HeaderTitle ellipsizeMode="tail" numberOfLines={1}>
          {title}
        </HeaderTitle>
      </HeaderCenter>

      {isLeft && (
        <HeaderLeft onPress={leftFunction} activeOpacity={1} isTitle={title !== undefined}>
          <Icon name={leftIcon} width={rsWidth * 9 + 'px'} color={palette.neutral[900]} />
          {leftText !== undefined && <OptionText>{leftText}</OptionText>}
        </HeaderLeft>
      )}

      {isRight && (
        <HeaderRight onPress={rightFunction} activeOpacity={1} isTitle={title !== undefined}>
          {rightText !== undefined && <OptionText>{leftText}</OptionText>}
          <Icon name={rightIcon} width={rsWidth * 9 + 'px'} color={palette.neutral[900]} />
        </HeaderRight>
      )}
    </HeaderContainer>
  );
};

export default Header;
