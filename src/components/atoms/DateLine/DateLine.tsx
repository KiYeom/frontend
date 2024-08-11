import { TouchableDateLine, DateLineText } from './DateLine.style';
import { View } from 'react-native';
import Icon from '../../icons/icons';
import { css } from '@emotion/native';
import { rsHeight, rsWidth } from '../../../utils/responsive-size';
import { getTime, formatDate } from '../../../utils/Chatting';
type DateProps = {
  value: string; //오늘의 날짜
  onPress: () => void; //date를 클릭했을 때의 함수
};
const DateLine = (props: DateProps) => {
  const { value, onPress } = props;
  return (
    <View
      style={css`
        background-color: 'white';
        display: 'flex';
        flex: 1;
        align-items: 'center';
        justify-content: 'center';
        margin-bottom: ${rsHeight * 16 + 'px'};
      `}>
      <TouchableDateLine onPress={onPress}>
        <Icon name="date-icon" width={rsWidth * 14} height={rsHeight * 16} color="black" />
        <DateLineText>{value}</DateLineText>
      </TouchableDateLine>
    </View>
  );
};
export default DateLine;
