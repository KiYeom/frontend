import { css } from '@emotion/native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';
import PeriodKeyword from '../../../components/periodKeyword/PeriodKeyword';
import Empty from '../Empty';
import { SectionTitle } from '../StatisticMain.style';
import Icon from '../../../components/icons/icons';
import { Hint } from 'react-native-ui-lib';
import palette from '../../../assets/styles/theme';
import HintComponent from '../HintComponent';

const HINT_NAME = 'period-keyword';
const HINT_MESSAGE = '그 동안 쿠키와 나눴던 이야기를 키워드로 정리해봤어요!';

const PeriodKeywordArea: React.FC<any> = (props: any) => {
  const { periodKeywordList, hintStatus, setHintStatus } = props;

  return (
    <View
      style={css`
        gap: ${12 * rsHeight + 'px'};
        padding-horizontal: ${rsWidth * 20 + 'px'};
      `}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
        <SectionTitle>그 동안 이런 이야기를 나눴어요</SectionTitle>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 4 }}>
          {/*<Hint
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
          </Hint>*/}
          <HintComponent
            visible={hintStatus && hintStatus === HINT_NAME}
            onClose={() => setHintStatus(undefined)}
            onToggle={() => setHintStatus(hintStatus ? undefined : HINT_NAME)}
            message={HINT_MESSAGE}
          />
        </View>
        {/*<HintComponent
          visible={hintStatus && hintStatus === HINT_NAME}
          onClose={() => setHintStatus(undefined)}
          onToggle={() => setHintStatus(hintStatus ? undefined : HINT_NAME)}
          message={HINT_MESSAGE}
        />*/}
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
        {periodKeywordList && periodKeywordList.length > 0 ? (
          periodKeywordList.map((keyword, index) => (
            <PeriodKeyword key={index} title={keyword} ranking={index + 1} />
          ))
        ) : (
          <Empty type="채팅기록" />
        )}
      </View>
    </View>
  );
};
export default PeriodKeywordArea;
