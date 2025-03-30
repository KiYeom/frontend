import React, { useEffect } from 'react';
import { Alert, View, Linking, Platform, Text, SectionList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../../components/header/header';
import { getFavoriteChat } from '../../../apis/chatting';

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

  sections.sort((a, b) => new Date(b.title) - new Date(a.title));
  return sections;
};

const Favorites: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [sections, setSections] = React.useState([]);

  useEffect(() => {
    //내가 좋아했던 말들
    getFavoriteChat()
      .then((res) => {
        console.log('[Favorites] 내가 좋아했던 말들: ', res);
        if (res && res.favorite) {
          // favorites 배열을 그룹화하여 섹션 데이터로 변환
          console.log('리버스', res.favorite.reverse());
          const groupedSections = groupFavoritesByDate(res.favorite);
          setSections(groupedSections);
        }
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
        stickySectionHeadersEnabled={false}
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
