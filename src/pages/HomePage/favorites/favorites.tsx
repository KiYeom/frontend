import React, { useEffect } from 'react';
import { Alert, View, Linking, Platform, Text, SectionList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../../components/header/header';
import { getFavoriteChat } from '../../../apis/chatting';

const dummyFavoriteData = {
  favorites: [
    {
      id: '67e16a0af672d87a956ef1ee',
      date: '2025-03-24T14:19:54.107Z',
      answer: '답1',
    },
    {
      id: '67e50fd01911b4e2904b6775',
      date: '2025-03-27T08:44:00.436Z',
      answer: '답2',
    },
  ],
};
// 위에서 사용한 groupFavoritesByDate 함수
const groupFavoritesByDate = (data) => {
  const groups = data.reduce((acc, item) => {
    const dateKey = item.date.split('T')[0];
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(item);
    return acc;
  }, {});

  const sections = Object.keys(groups).map((date) => ({
    title: date,
    data: groups[date],
  }));

  sections.sort((a, b) => new Date(a.title) - new Date(b.title));
  return sections;
};

const Favorites: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const sections = groupFavoritesByDate(dummyFavoriteData.favorites);

  useEffect(() => {
    //내가 좋아했던 말들
    getFavoriteChat()
      .then((res) => {
        console.log('[Favorites] 내가 좋아했던 말들: ', res);
      })
      .catch((err) => {
        console.log('[Favorites] 내가 좋아했던 말들 에러: ', err);
      });
  }, []);

  return (
    <View
      style={{
        flex: 1,
      }}>
      <Header title={'따스한 대화 모아보기'} />
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10 }}>
            <Text>{item.answer}</Text>
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={{ padding: 10, backgroundColor: 'red' }}>
            <Text style={{ fontWeight: 'bold' }}>{title}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Favorites;
