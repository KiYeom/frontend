import { css } from '@emotion/native';
import { Text, TouchableOpacity } from 'react-native';
import palette from '../../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';
import Icon from '../../icons/icons';
import { Homeheader } from './Homeheader.style';

const Header = ({ navigation, riskStatus, onIconPress }) => {
  console.log('헤더', riskStatus);
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
        {riskStatus === 'danger' ? (
          <Icon name="danger-sign" />
        ) : riskStatus === 'danger-opened' ? (
          <Icon name="danger-sign-opened" />
        ) : (
          <>
            <Text
              style={css`
                color: ${palette.primary[500]};
                font-size: ${rsFont * 20 + 'px'};
                font-family: Pretendard-Bold;
              `}>
              상담 기관 찾기
            </Text>
            <Icon
              name="arrow-right"
              width={rsWidth * 6 + 'px'}
              height={rsHeight * 12 + 'px'}
              color={palette.primary[500]}
            />
          </>
        )}
      </TouchableOpacity>
    </Homeheader>
  );
};
export default Header;
