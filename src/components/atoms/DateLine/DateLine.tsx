import { TouchableDateLine, DateLineText } from './DateLine.style';
import { View } from 'react-native';
import Icon from '../../icons/icons';
import { css } from '@emotion/native';
import { rsHeight, rsWidth } from '../../../utils/responsive-size';
import { getTime, formatDate } from '../../../utils/Chatting';
type DateProps = {
  value: string; //오늘의 날짜
};
const DateLine = (props: DateProps) => {
  const { value } = props;
  return (
    <View
      style={css`
        background-color: pink;
        display: flex;
        flex: 1;
        align-items: flex-start;
        justify-content: center;
        margin-bottom: ${rsHeight * 16 + 'px'};
        padding-horizontal: ${rsWidth * 20 + 'px'};
      `}>
      <DateLineText>{value}</DateLineText>
    </View>
  );
};
export default DateLine;
