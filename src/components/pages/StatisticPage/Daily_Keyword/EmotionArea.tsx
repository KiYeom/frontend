import { css } from '@emotion/native';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { rsWidth } from '../../../../utils/responsive-size';
import EmotionCard from '../../../atoms/EmotionCard/EmotionCard';
import Icon from '../../../icons/icons';
import { SectionTitle } from '../StatisticMain.style';
import { Container, KeywordContainer, KeywordText } from './Keyword.style';
const EmotionArea: React.FC<any> = (props: any) => {
  const { isRecordKeywordList, isNullRecordKeywordList } = props;
  return (
    <Container>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
        <SectionTitle>그 때의 나는 어떤 감정이었나요?</SectionTitle>
        <TouchableOpacity
          activeOpacity={1}
          style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 4 }}
          onPress={() => {
            /* Handle press here */
          }}>
          <Icon name="information" width={16} height={16} />
        </TouchableOpacity>
      </View>
      {isRecordKeywordList.length === 0 ? (
        <KeywordContainer>
          <Icon name={'empty-icon'} />
          <KeywordText>나의 감정은 기록하지 않았어요</KeywordText>
        </KeywordContainer>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={css`
            flex-grow: 1;
          `}
          contentContainerStyle={css`
            flex-grow: 1;
            flex-direction: row;
            gap: ${rsWidth * 8 + 'px'};
          `}>
          {isRecordKeywordList.map((emotion, index) => (
            <EmotionCard key={index} emotion={emotion} onPress={() => {}} status={'default-view'} />
          ))}
        </ScrollView>
      )}
    </Container>
  );
};
export default EmotionArea;
