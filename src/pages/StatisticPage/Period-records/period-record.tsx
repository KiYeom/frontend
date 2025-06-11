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
  RImageContainer,
} from './period-record.style';
import { RootStackName, HomeStackName, StatisticStackName } from '../../../constants/Constants';
import { TouchableOpacity, View, Text, Image } from 'react-native';
import Icon from '../../../components/icons/icons';
import palette from '../../../assets/styles/theme';
import { rsFont } from '../../../utils/responsive-size';
import { css } from '@emotion/native';
import Analytics from '../../../utils/analytics';

const HINT_NAME = 'period-record';
const HINT_MESSAGE = '자신이 기록한 날들을 한 눈에 볼 수 있어요!';

const PeriodRecord = (props: any) => {
  const { records, hintStatus, setHintStatus, navigation } = props;
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
      </View>
      {records.map((record, index) => {
        //console.log('record', record);
        const iconName = getEmotionIconName(record.keywords[0]);
        return (
          <RecordContainer
            key={index}
            onPress={() => {
              //console.log('클릭함', record.date);
              //console.log('클릭함');
              Analytics.clickCTAGoDailyReportPageInPeriod(record.date ?? '2050-01-01');
              navigation.navigate(RootStackName.HomeStackNavigator, {
                screen: HomeStackName.Report,
                params: { dateID: record.date },
              });
            }}>
            <RecordDateArea>
              <RecordDateIcon>
                <Icon name={iconName} width={40} height={40} color={palette.neutral[300]} />
              </RecordDateIcon>
              <RecordDateText>{getLocalDate(record.date, 'ko-KR')}</RecordDateText>
            </RecordDateArea>
            {record.keywords && record.keywords.length > 0 && (
              <RecordKeywordText>{getEmotionsText(record.keywords)}</RecordKeywordText>
            )}
            {record.images && (
              <View
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View style={{ width: 170, height: 128, position: 'relative' }}>
                  <Image
                    source={{ uri: record.images[0] }}
                    style={{ width: '100%', height: '100%', borderRadius: 10 }}
                  />
                  {record.images.length > 1 && (
                    <View
                      style={{
                        position: 'absolute',
                        top: 7,
                        right: 7,
                        borderRadius: 10,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        width: 20,
                        height: 20,
                        padding: 3,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Icon name="multi-pic" width={14} height={11} color={'white'} />
                    </View>
                  )}
                </View>
              </View>
            )}
            {record.todayFeeling && <RecordDailyText>{record.todayFeeling}</RecordDailyText>}
          </RecordContainer>
        );
      })}
    </RContainer>
  );
};
export default PeriodRecord;
