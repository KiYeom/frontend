import { View } from 'react-native';
import Icon from '../../icons/icons';
import { css } from '@emotion/native';
import { rsHeight, rsWidth, rsFont } from '../../../utils/responsive-size';
import { Text } from 'react-native';
import { TouchableDateLine } from '../../atoms/DateLine/DateLine.style';
import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackName, StatisticStackName } from '../../../constants/Constants';
type DateProps = {
  navigation: any;
  type: string;
  onPress: () => void; //date를 클릭했을 때의 함수
};
const ReportType = (props: DateProps) => {
  const { onPress, navigation, type } = props;
  return (
    <View
      style={css`
        display: flex;
        flex-direction: row;
        flex: 1;
        justify-content: space-between;
        height: auto;
        max-height: 36px;
        margin-bottom: ${rsHeight * 16 + 'px'};
        padding-horizontal: ${rsWidth * 20 + 'px'};
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
          {type === '기간리포트' ? '일일리포트' : '기간리포트'}
        </Text>
      </TouchableDateLine>
      <Button
        onPress={() =>
          navigation.navigate(
            type === '일일리포트' ? StatisticStackName.Daily : StatisticStackName.Period,
          )
        }
        title={type}
      />
    </View>
  );
};
export default ReportType;
