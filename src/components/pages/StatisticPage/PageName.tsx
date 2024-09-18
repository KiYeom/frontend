import { TouchableOpacity, View } from 'react-native';
import Icon from '../../icons/icons';
import { css } from '@emotion/native';
import { rsHeight, rsWidth, rsFont, ratio } from '../../../utils/responsive-size';
import { Text } from 'react-native';
import { TouchableDateLine } from '../../atoms/DateLine/DateLine.style';
import { StatisticStackName } from '../../../constants/Constants';
import palette from '../../../assets/styles/theme';

type TitleProps = {
  type: string;
};
const PageName = (props: TitleProps) => {
  const { type } = props;
  return (
    <Text
      style={css`
        font-size: ${rsFont * 24 + 'px'};
        font-family: Pretendard-SemiBold;
        text-align: center;
      `}>
      {type}
    </Text>
  );
};
export default PageName;
