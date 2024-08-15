import { View } from 'react-native';
import Icon from '../../icons/icons';
import { css } from '@emotion/native';
import { rsHeight, rsWidth, rsFont } from '../../../utils/responsive-size';
import { Text } from 'react-native';
import { TouchableDateLine } from '../../atoms/DateLine/DateLine.style';
import { Button } from 'react-native-ui-lib';
type DateProps = {
  value: string; //오늘의 날짜
  onPress: () => void; //date를 클릭했을 때의 함수
};
const ReportType = (props: DateProps) => {
  const { value, onPress } = props;
  return (
    <View
      style={css`
        display: flex;
        flex-direction: row;
        flex: 1;
        justify-content: space-between;
        height: auto;
        max-height: 36px;
        background-color: green;
        margin-bottom: ${rsHeight * 16 + 'px'};
      `}>
      <TouchableDateLine
        onPress={onPress}
        style={css`
          gap: ${rsWidth * 8 + 'px'};
        `}>
        <Icon name="date-icon" width={rsWidth * 20} height={rsHeight * 22.86} color="black" />
        <Text
          style={css`
            font-family: Pretendard-SemiBold;
            font-size: ${rsFont * 28 + 'px'};
          `}>
          일일 리포트
        </Text>
      </TouchableDateLine>
      <Button>기간리포트</Button>
    </View>
  );
};
export default ReportType;
