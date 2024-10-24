import { css } from '@emotion/native';
import { Text, TouchableOpacity, View } from 'react-native';
import palette from '../../../assets/styles/theme';
import { StatisticStackName } from '../../../constants/Constants';
import Analytics from '../../../utils/analytics';
import { ratio, rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';
import { TouchableDateLine } from '../../atoms/DateLine/DateLine.style';
import Icon from '../../icons/icons';

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
        padding-horizontal: ${rsWidth * 20 + 'px'};
      `}>
      <TouchableDateLine
        onPress={onPress}
        style={css`
          gap: ${rsWidth * 8 + 'px'};
          align-items: center;
        `}>
        <Icon name="date-icon" width={rsWidth * 20} height={rsHeight * 22.86} color="black" />
      </TouchableDateLine>
      <TouchableOpacity
        style={css`
          width: auto;
          height: auto;
          background-color: ${palette.primary[50]};
          border-radius: ${ratio * 100 + 'px'};
          align-items: center;
          justify-content: center;
          flex-direction: row;
          gap: ${rsWidth * 8 + 'px'};
          padding-horizontal: ${rsWidth * 16 + 'px'};
          padding-vertical: ${rsHeight * 10 + 'px'};
        `}
        onPress={() => {
          if (type === '기간리포트') {
            Analytics.clickPeriodButton();
            navigation.replace(StatisticStackName.Period);
          } else {
            Analytics.clickDailyButton();
            navigation.replace(StatisticStackName.Daily);
          }
        }}>
        <Text
          style={css`
            font-size: ${rsFont * 16 + 'px'};
            font-family: Pretendard-SemiBold;
            color: ${palette.primary[500]};
            text-align: center;
          `}>
          {type === '기간리포트' ? '기간리포트' : '일일리포트'}
        </Text>
        <Icon
          name="arrow-right"
          width={rsWidth * 6 + 'px'}
          height={rsHeight * 10 + 'px'}
          color={palette.primary[500]}
        />
      </TouchableOpacity>
    </View>
  );
};
export default ReportType;
