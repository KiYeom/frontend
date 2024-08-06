import { css } from '@emotion/native';
import { TouchableOpacity, View, Text } from 'react-native';
import { rsHeight, rsWidth, rsFont } from '../../utils/responsive-size';
import { useNavigation } from '@react-navigation/native';
import palette from '../../assets/styles/theme';
import Icon from '../icons/icons';
interface HeaderProps {
  title?: string;
}
const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigation = useNavigation();
  return (
    <View
      style={css`
        margin-top: ${rsHeight * 40 + 'px'};
        height: ${rsHeight * 56 + 'px'};
        padding-left: ${rsWidth * 24 + 'px'};
        padding-right: ${rsWidth * 24 + 'px'};
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      `}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        activeOpacity={1}
        style={css`
          flex-direction: row;
        `}>
        <Icon name="arrow-left" width={rsWidth * 9 + 'px'} color={palette.neutral[900]} />
      </TouchableOpacity>
      <View
        style={css`
          flex: 1;
          justify-content: center;
          align-items: center;
        `}>
        <Text
          style={css`
            text-align: center;
            font-size: ${rsFont * 18 + 'px'};
            font-family: Pretendard-SemiBold;
            width: ${rsWidth * 250 + 'px'};
          `}
          ellipsizeMode="tail"
          numberOfLines={1}>
          {title}
        </Text>
      </View>
    </View>
  );
};

export default Header;
