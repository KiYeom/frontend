import { TouchableOpacity, View } from 'react-native';
import Icon from '../../icons/icons';
import { css } from '@emotion/native';
import { rsHeight, rsWidth, rsFont, ratio } from '../../../utils/responsive-size';
import { Text } from 'react-native';
import { TouchableDateLine } from '../../atoms/DateLine/DateLine.style';
import { StatisticStackName } from '../../../constants/Constants';
import palette from '../../../assets/styles/theme';

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
        //margin-bottom: ${rsHeight * 16 + 'px'};
        padding-horizontal: ${rsWidth * 20 + 'px'};
        //background-color: pink;
      `}>
      <TouchableDateLine
        onPress={onPress}
        style={css`
          gap: ${rsWidth * 8 + 'px'};
          align-items: center;
        `}>
        <Icon name="date-icon" width={rsWidth * 20} height={rsHeight * 22.86} color="black" />
        {/*<Text
          style={css`
            font-family: Pretendard-SemiBold;
            font-size: ${rsFont * 28 + 'px'};
          `}>
          {type === '기간리포트' ? '일일리포트' : '기간리포트'}
        </Text>*/}
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
        onPress={() =>
          navigation.navigate(
            type === '일일리포트' ? StatisticStackName.Daily : StatisticStackName.Period,
          )
        }>
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
