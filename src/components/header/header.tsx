import { rsWidth } from '../../utils/responsive-size';
import { useNavigation } from '@react-navigation/native';
import palette from '../../assets/styles/theme';
import Icon, { TIconName } from '../icons/icons';
import { LeftContainer, HeaderCenter, HeaderContainer, HeaderTitle } from './header.styles';

type HeaderProps = {
  title?: string;
  isLeft?: boolean;
  leftIcon?: TIconName;
  leftFunction?: () => void;
};
const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const navigation = useNavigation();
  const {
    title = '',
    isLeft = true,
    leftIcon = 'arrow-left',
    leftFunction = () => {
      navigation.goBack();
    },
  } = props;
  return (
    <HeaderContainer>
      {isLeft && (
        <LeftContainer onPress={leftFunction} activeOpacity={1}>
          <Icon name={leftIcon} width={rsWidth * 9 + 'px'} color={palette.neutral[900]} />
        </LeftContainer>
      )}
      <HeaderCenter>
        <HeaderTitle ellipsizeMode="tail" numberOfLines={1}>
          {title}
        </HeaderTitle>
      </HeaderCenter>
    </HeaderContainer>
  );
};

export default Header;
