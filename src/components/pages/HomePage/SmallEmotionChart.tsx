import React, { useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import { Title, Desc } from './EmotionChart.style';
import { HomeContainer } from './Home.style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../button/button';

const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth * 0.45; // 각 항목의 너비를 화면 너비의 45%로 설정
const itemHeight = 120; // 각 항목의 높이를 설정

const SmallEmotionChart: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [count, setCount] = useState(0);
  const emotions = [
    { id: 1, emoji: '😠', label: '격분한' },
    { id: 2, emoji: '😐', label: '지루한' },
    { id: 3, emoji: '😢', label: '슬픈' },
    { id: 4, emoji: '😊', label: '기쁜' },
    { id: 5, emoji: '😇', label: '평온한' },
    { id: 6, emoji: '😱', label: '놀란' },
    { id: 7, emoji: '😡', label: '화난' },
    { id: 8, emoji: '😃', label: '행복한' },
    // 필요한 만큼 감정 데이터를 추가
  ];

  // 두 개씩 묶어서 세트로 나누기
  const groupedEmotions = [];
  for (let i = 0; i < emotions.length; i += 2) {
    groupedEmotions.push(emotions.slice(i, i + 2));
  }

  const renderItem = ({ item, index }) => {
    const firstRow = groupedEmotions[index];
    const secondRow = groupedEmotions[index + 1] || []; // 두 번째 줄이 없으면 빈 배열
    return (
      <View style={styles.page}>
        <View style={styles.row}>
          {firstRow.map((emotion) => (
            <View key={emotion.id} style={styles.emotionCard}>
              <Text style={styles.emoji}>{emotion.emoji}</Text>
              <Text>{emotion.label}</Text>
            </View>
          ))}
        </View>
        <View style={styles.row}>
          {secondRow.map((emotion) => (
            <View key={emotion.id} style={styles.emotionCard}>
              <Text style={styles.emoji}>{emotion.emoji}</Text>
              <Text>{emotion.label}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <HomeContainer insets={insets}>
      <Title>감정 기록</Title>
      <Desc>오늘의 감정을 알려주세요</Desc>
      <FlatList
        data={groupedEmotions}
        horizontal
        pagingEnabled
        renderItem={renderItem}
        keyExtractor={(item, index) => `page-${index}`}
        showsHorizontalScrollIndicator={false}
        style={styles.flatList}
      />
      <View>
        <Title>기록한 감정</Title>
      </View>
      <View>
        <Desc>감정 키워드는 3~5개 선택힐 수 있습니다.</Desc>
        <Button title={`감정 ${count}개 선택함`} primary={count > 0} />
      </View>
    </HomeContainer>
  );
};

const styles = StyleSheet.create({
  flatList: {
    flexGrow: 0,
  },
  page: {
    width: screenWidth,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  emotionCard: {
    width: itemWidth,
    height: itemHeight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  emoji: {
    fontSize: 24,
  },
});

export default SmallEmotionChart;
