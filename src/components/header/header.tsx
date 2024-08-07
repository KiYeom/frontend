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
        padding-left: ${title === undefined ? rsWidth * 24 + 'px' : rsWidth * 20 + 'px'};
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      `}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        activeOpacity={1}
        style={css`
          flex-direction: row;
        `}>
        <Icon name="arrow-left" width={rsWidth * 9 + 'px'} color={palette.neutral[900]} />
      </TouchableOpacity>
      <Text
        style={css`
          text-align: center;
          font-size: ${rsFont * 18 + 'px'};
          font-family: Pretendard-SemiBold;
          width: ${rsWidth * 250 + 'px'};
          margin-right: ${rsWidth * 70 + 'px'};
        `}
        ellipsizeMode="tail"
        numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
};

export default Header;
