import { css } from '@emotion/native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { rsHeight, rsWidth } from '../../../../utils/responsive-size';
import PeriodKeyword from '../../../periodKeyword/PeriodKeyword';
import Empty from '../Empty';
import { SectionTitle } from '../StatisticMain.style';
import Icon from '../../../icons/icons';

const PeriodKeywordArea: React.FC<any> = (props: any) => {
  const { periodKeywordList, setPeriodKeywordList } = props;

  return (
    <View
      style={css`
        gap: ${12 * rsHeight + 'px'};
        padding-horizontal: ${rsWidth * 20 + 'px'};
      `}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
        <SectionTitle>그 동안 이런 이야기를 나눴어요</SectionTitle>
        <TouchableOpacity
          activeOpacity={1}
          style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 4 }}
          onPress={() => {
            /* Handle press here */
          }}>
          <Icon name="information" width={16} height={16} />
        </TouchableOpacity>
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
          periodKeywordList.map((keyword, index) => <PeriodKeyword key={index} title={keyword} />)
        ) : (
          <Empty type="채팅기록" />
        )}
      </View>
    </View>
  );
};
export default PeriodKeywordArea;
