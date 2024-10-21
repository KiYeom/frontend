import { css } from '@emotion/native';
import { Text, TouchableOpacity } from 'react-native';
import palette from '../../../assets/styles/theme';
import { DangerStackName, RootStackName } from '../../../constants/Constants';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';
import Icon from '../../icons/icons';
import { Homeheader } from './Homeheader.style';
const Header = ({ navigation }) => {
  return (
    <Homeheader>
      <Icon name="remind-logo" />
      {/*<TouchableOpacity
        style={{ backgroundColor: `${palette.primary[500]}` }}
        onPress={() => console.log('에휴')}>
        <Image
          source={require('../../../assets/images/homecookieprofile.png')}
          style={{ objectFit: 'contain', width: 50 * rsWidth, height: 50 * rsHeight }}
        />
        <ProfileButton/>
        <Text>쿠키를 소개할게!</Text>
      </TouchableOpacity>*/}
      <TouchableOpacity
        style={css`
          height: ${rsHeight * 30 + 'px'};
          gap: ${rsWidth * 8 + 'px'};
          flex-direction: row;
          justify-content: center;
          align-items: center;
        `}
        //onPress={() => console.log('터치')}
        onPress={() =>
          navigation.navigate(RootStackName.DangerStackNavigator, {
            screen: DangerStackName.DangerAlert,
          })
        }>
        <Text
          style={css`
            color: ${palette.primary[500]};
            font-size: ${rsFont * 20 + 'px'};
            font-family: Pretendard-Bold;
          `}>
          도움이 필요할 때는
        </Text>
        <Icon
          name="arrow-right"
          width={rsWidth * 6 + 'px'}
          height={rsHeight * 12 + 'px'}
          color={palette.primary[500]}
        />
      </TouchableOpacity>
    </Homeheader>
  );
};
export default Header;
