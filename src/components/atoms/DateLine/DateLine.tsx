import { css } from '@emotion/native';
import { View } from 'react-native';
import { rsWidth } from '../../../utils/responsive-size';
import { DateLineText } from './DateLine.style';

type DateProps = {
  value: string; //오늘의 날짜
};
const DateLine = (props: DateProps) => {
  const { value } = props;
  return (
    <View
      style={css`
        display: flex;
        flex: 1;
        //align-items: flex-start;
        align-items: center;
        justify-content: center;
        padding-horizontal: ${rsWidth * 20 + 'px'};
      `}>
      <DateLineText>{value}</DateLineText>
    </View>
  );
};
export default DateLine;
