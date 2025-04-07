import React, { useEffect } from 'react';
import { Alert, View, Linking, Platform, Text, SectionList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../../components/header/header';
import { getFavoriteChat } from '../../../apis/chatting';
import { TFavoriteChatLog } from '../../../apis/chatting.types';
import { rsWidth, rsHeight } from '../../../utils/responsive-size';
import Icon from '../../../components/icons/icons';
import { saveFavoriteChatLog } from '../../../apis/chatting';
import { getV3OldChatting } from '../../../apis/chatting';
import { setNewIMessagesV3 } from '../../../utils/storageUtils';
import { addRefreshChat } from '../../../utils/storageUtils';
import { convertUtcToKst } from '../../../utils/times';
// 데이터를 날짜별로 그룹화하는 groupFavoritesByDate 함수
//불러온 API 결과를 받아, 화면에 그리도록 정제함
const groupFavoritesByDate = (data: TFavoriteChatLog) => {
  console.log('groupFavoritesByDate', data);
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
  const [sections, setSections] = React.useState([]);
  const [isSelected, setIsSelected] = React.useState(true);

  useEffect(() => {
    //내가 좋아했던 말들
    getFavoriteChat()
      .then((res) => {
        console.log('[Favorites] 내가 좋아했던 말들: ', res);
        console.log('테스트', res?.favorites);
        if (res && res.favorites) {
          // favorites 배열을 그룹화하여 섹션 데이터로 변환
          //console.log('리버스', res.favorites.reverse());
          const groupedSections = groupFavoritesByDate(res.favorites);
          console.log('groupedSections', groupedSections);
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
        //backgroundColor: 'orange',
        width: '100%',
      }}>
      <Header
        title={'따스한 대화 모아보기'}
        leftFunction={async () => {
          await addRefreshChat(1);
          navigation.goBack();
        }}
      />
      <SectionList
        stickySectionHeadersEnabled={false}
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingVertical: 10,
              //backgroundColor: 'blue',
              justifyContent: 'space-between', // 좌우로 공간을 벌려줍니다
            }}>
            {/* Text 영역 */}
            <Text style={{ flex: 1 }}>{item.answer}</Text>

            {/* 아이콘 영역 */}
            {/*<View style={{ marginLeft: 20 }}>
              <Icon
                name="favorite-icon"
                width={rsWidth * 14 + 'px'}
                height={rsHeight * 14 + 'px'}
                toggleable
                isSaved={isSelected}
                messageId={'testMessageId'}
                onFavoritePress={async (id) => {
                  console.log('히히', item.id, !isSelected);
                  setIsSelected(!isSelected);
                  const res = await saveFavoriteChatLog(`${item.id}-B-0`, !isSelected);
                  console.log('res', res);
                }}
              />
            </View>*/}
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={{ padding: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>{convertUtcToKst(title)}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Favorites;
