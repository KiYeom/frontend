import * as amplitude from '@amplitude/analytics-react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import palette from '../../assets/styles/theme';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
import Icon, { TIconName } from '../icons/icons';
import {
  HeaderCenter,
  HeaderContainer,
  HeaderEvent,
  HeaderLeft,
  HeaderRight,
  HeaderTitle,
  OptionText,
} from './header.styles';

export type HeaderProps = {
  title?: string;

  isLeft?: boolean;
  leftIcon?: TIconName;
  leftText?: string;
  leftFunction?: () => void;

  isRight?: boolean;
  rightIcon?: TIconName;
  rightText?: string;
  rightFunction?: () => void;

  isEvent?: boolean;
  eventIcon?: TIconName;
  eventText?: string;
  eventFunction?: () => void;

  bgcolor?: string;
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

    isEvent = false,
    eventIcon = 'event-icon',
    eventText = undefined,
    eventFunction = () => {},
    bgcolor = 'white',
  } = props;
  return (
    <HeaderContainer isTitle={title !== undefined} insets={insets} bgcolor={bgcolor}>
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
            <Icon name={rightIcon} height={rsHeight * 30 + 'px'} color={palette.neutral[900]} />
          )}
        </HeaderRight>
      )}
      {isEvent && (
        <HeaderEvent onPress={eventFunction} activeOpacity={1} isTitle={title !== undefined}>
          <Icon name={eventIcon} width={rsWidth * 30 + 'px'} />
          {eventText !== undefined && <OptionText>{eventText}</OptionText>}
        </HeaderEvent>
      )}
    </HeaderContainer>
  );
};

export default Header;
