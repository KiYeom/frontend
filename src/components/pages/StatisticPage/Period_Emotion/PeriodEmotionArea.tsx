import { css } from '@emotion/native';
import { TouchableOpacity, View } from 'react-native';
import { rsFont, rsHeight, rsWidth } from '../../../../utils/responsive-size';
import { SectionTitle } from '../StatisticMain.style';
import PeriodKeyword from '../../../periodKeyword/PeriodKeyword';
import Empty from '../Empty';
import { Hint } from 'react-native-ui-lib';
import palette from '../../../../assets/styles/theme';
import Icon from '../../../icons/icons';

const HINT_NAME = 'period-emotion';
const HINT_MESSAGE = '그 동안 자신이 가장 많이 느꼈던 감정들이에요!';

const PeriodEmotionArea: React.FC<any> = (props: any) => {
  const { periodEmotionList, hintStatus, setHintStatus } = props;

  return (
    <View
      style={css`
        gap: ${12 * rsHeight + 'px'};
        padding-horizontal: ${rsWidth * 20 + 'px'};
      `}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
        <SectionTitle>그 동안 이러한 감정들을 느꼈어요</SectionTitle>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 4 }}>
          <Hint
            visible={hintStatus && hintStatus === HINT_NAME}
            position={Hint.positions.TOP}
            message={HINT_MESSAGE}
            color={'white'}
            enableShadow
            messageStyle={css`
              font-family: Kyobo-handwriting;
              font-size: ${16 * rsFont + 'px'};
              color: ${palette.neutral[900]};
            `}
            onPress={() => setHintStatus(undefined)}
            onBackgroundPress={() => setHintStatus(undefined)}>
            <View>
              <TouchableOpacity
                activeOpacity={1}
                style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 4 }}
                onPress={() => setHintStatus(hintStatus ? undefined : HINT_NAME)}>
                <Icon name="information" width={16} height={16} />
              </TouchableOpacity>
            </View>
          </Hint>
        </View>
      </View>
      <View
        style={css`
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: space-between;
          width: 100%;
          height: auto;
          gap: ${rsHeight * 8 + 'px'};
        `}>
        {periodEmotionList && periodEmotionList.length > 0 ? (
          periodEmotionList.map((emotion: string, index: number) => (
            <PeriodKeyword key={index} title={emotion} ranking={index + 1} />
          ))
        ) : (
          <Empty type="채팅기록" />
        )}
      </View>
    </View>
  );
};
export default PeriodEmotionArea;
