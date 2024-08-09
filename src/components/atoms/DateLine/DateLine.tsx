import { TouchableDateLine, DateLineText } from './DateLine.style';
import { View } from 'react-native';
import Icon from '../../icons/icons';
import { css } from '@emotion/native';
import { rsHeight, rsWidth } from '../../../utils/responsive-size';
import { getTime, formatDate } from '../../../utils/Chatting';
type DateProps = {
  today: string;
  onPress: () => void;
};
const DateLine = (props: DateProps) => {
  const { today, onPress } = props;
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
        <Icon name="dateIcon" width={rsWidth * 14} height={rsHeight * 16} color="black" />
        <DateLineText>{today}</DateLineText>
      </TouchableDateLine>
    </View>
  );
};
export default DateLine;
