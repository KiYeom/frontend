import { css } from '@emotion/native';
import { View } from 'react-native';
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
        align-items: center;
        justify-content: center;
      `}>
      <DateLineText>{value}</DateLineText>
    </View>
  );
};
export default DateLine;
