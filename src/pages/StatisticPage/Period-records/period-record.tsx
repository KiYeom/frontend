import React from 'react';
import { EmotionKeyword, TRecordEmotion } from '../../../apis/analyze.type';
import Empty from '../Empty';
import { SectionTitle } from '../StatisticMain.style';
import {
  RContainer,
  RecordContainer,
  RecordDailyText,
  RecordDateArea,
  RecordDateIcon,
  RecordDateText,
  RecordKeywordText,
} from './period-record.style';
import { TouchableOpacity, View } from 'react-native';
import Icon from '../../../components/icons/icons';
import palette from '../../../assets/styles/theme';
import { rsFont } from '../../../utils/responsive-size';
import { css } from '@emotion/native';

const HINT_NAME = 'period-record';
const HINT_MESSAGE = '자신이 기록한 날들을 한 눈에 볼 수 있어요!';

const PeriodRecord = (props: any) => {
  const { records, hintStatus, setHintStatus } = props;
  const getLocalDate = (date: string, locale: string) => {
    const formattedDate = new Date(date).toLocaleDateString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    if (locale === 'ko-KR') {
      // Remove any unwanted characters and reformat correctly
      const [year, month, day] = formattedDate.replace(/\./g, '').split(' ');
      return `${year}년 ${month}월 ${day}일`;
    }

    return formattedDate;
  };

  const getEmotionsText = (recordKeywords: EmotionKeyword[]): string => {
    return recordKeywords.map((keyword) => `#${keyword.keyword} `).join(' ');
  };

  const getEmotionIconName = (emotion: EmotionKeyword | undefined) => {
    if (!emotion) return 'default-heart';
    switch (emotion.group) {
      case 'happy':
        return 'happy-emotion';
      case 'sad':
        return 'sad-emotion';
      case 'calm':
        return 'calm-emotion';
      case 'angry':
        return 'angry-emotion';
      case 'normal':
        return 'normal-emotion';
      default:
        return 'default-heart';
    }
  };

  return (
    <RContainer>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
        <SectionTitle>내가 기록한 하루들</SectionTitle>
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
        </View>
      </View>
      {records.length === 0 ? (
        <Empty type="채팅기록"></Empty>
      ) : (
        records.map((record, index) => {
          const iconName = getEmotionIconName(record.keywords[0]);
          return (
            <RecordContainer key={index}>
              <RecordDateArea>
                <RecordDateIcon>
                  <Icon name={iconName} width={40} height={40} color={palette.neutral[300]} />
                </RecordDateIcon>
                <RecordDateText>{getLocalDate(record.date, 'ko-KR')}</RecordDateText>
              </RecordDateArea>
              {record.keywords && record.keywords.length > 0 && (
                <RecordKeywordText>{getEmotionsText(record.keywords)}</RecordKeywordText>
              )}
              {record.todayFeeling && <RecordDailyText>{record.todayFeeling}</RecordDailyText>}
            </RecordContainer>
          );
        })
      )}
    </RContainer>
  );
};
export default PeriodRecord;
