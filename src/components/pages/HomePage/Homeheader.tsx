import { css } from '@emotion/native';
import { Text, TouchableOpacity } from 'react-native';
import palette from '../../../assets/styles/theme';
import { DangerStackName, RootStackName } from '../../../constants/Constants';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';
import Icon from '../../icons/icons';
import { Homeheader } from './Homeheader.style';
const Header = ({ navigation, riskScore, icon, onIconPress }) => {
  const handlePress = () => {
    if (riskScore >= 85) {
      navigation.navigate(RootStackName.DangerStackNavigator, {
        screen: DangerStackName.DangerAlert,
      });
    } else {
      navigation.navigate(RootStackName.DangerStackNavigator, {
        screen: DangerStackName.Clinic,
      });
    }
  };
  return (
    <Homeheader>
      <Icon name="remind-logo" />
      <TouchableOpacity
        style={css`
          height: ${rsHeight * 30 + 'px'};
          gap: ${rsWidth * 8 + 'px'};
          flex-direction: row;
          justify-content: center;
          align-items: center;
        `}
        onPress={onIconPress}>
        <Text
          style={css`
            color: ${palette.primary[500]};
            font-size: ${rsFont * 20 + 'px'};
            font-family: Pretendard-Bold;
          `}>
          {riskScore >= 85 ? '' : '상담기관 찾기'}
        </Text>
        {riskScore < 85 ? (
          <Icon
            name="arrow-right"
            width={rsWidth * 6 + 'px'}
            height={rsHeight * 12 + 'px'}
            color={palette.primary[500]}
          />
        ) : (
          <Icon name={icon} />
        )}
      </TouchableOpacity>
    </Homeheader>
  );
};
export default Header;
