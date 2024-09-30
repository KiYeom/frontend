import * as amplitude from '@amplitude/analytics-react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import palette from '../../assets/styles/theme';
import { rsWidth } from '../../utils/responsive-size';
import Icon, { TIconName } from '../icons/icons';
import {
  HeaderCenter,
  HeaderContainer,
  HeaderLeft,
  HeaderRight,
  HeaderTitle,
  OptionText,
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
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const {
    title = undefined,
    isLeft = true,
    leftIcon = 'arrow-left',
    leftText = undefined,
    leftFunction = () => {
      navigation.goBack();
      amplitude.track('뒤로가기 버튼 클릭');
    },

    isRight = false,
    rightIcon,
    rightText = undefined,
    rightFunction = () => {},
  } = props;
  return (
    <HeaderContainer isTitle={title !== undefined} insets={insets}>
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
          {rightText !== undefined && <OptionText>{rightText}</OptionText>}
          {rightIcon !== undefined && (
            <Icon name={rightIcon} width={rsWidth * 9 + 'px'} color={palette.neutral[900]} />
          )}
        </HeaderRight>
      )}
    </HeaderContainer>
  );
};

export default Header;
