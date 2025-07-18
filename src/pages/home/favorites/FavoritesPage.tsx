import React, { useEffect, useState } from 'react';
import { Alert, View, Linking, Platform, Text, SectionList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../../components/header/Header';
import { getFavoriteChat } from '../../../apis/chatting';
import { TFavoriteChatLog } from '../../../apis/chatting.types';
import { rsWidth, rsHeight } from '../../../utils/responsive-size';
import Icon from '../../../components/icons/icons';
import { saveFavoriteChatLog } from '../../../apis/chatting';
import { deleteNewIMessagesV3 } from '../../../utils/storageUtils';
import { addRefreshChat } from '../../../utils/storageUtils';
import { convertUtcToKst } from '../../../utils/times';
import Analytics from '../../../utils/analytics';
import { css } from '@emotion/native';
import { ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { TabScreenName, RootStackName, HomeStackName } from '../../../constants/Constants';
import {
  Container,
  TitleContainer,
  Title,
  TitleImage,
  SectionComponent,
  SectionComponentText,
  SectionComponentImage,
  SectionDateContainer,
  SectionDateText,
} from './FavoritesPage.style';
import palette from '../../../assets/styles/theme';
// 데이터를 날짜별로 그룹화하는 groupFavoritesByDate 함수
//불러온 API 결과를 받아, 화면에 그리도록 정제함

type FavoriteStates = {
  [key: string]: boolean;
};
const groupFavoritesByDate = (data: TFavoriteChatLog) => {
  //console.log('groupFavoritesByDate', data);
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
// 각 항목에 전체 목록에서의 인덱스를 지정하는 함수
const assignGlobalIndices = (sections) => {
  let globalIndex = 0;
  const result = sections.map((section) => {
    const newData = section.data.map((item) => {
      return { ...item, globalIndex: globalIndex++ };
    });
    return { ...section, data: newData };
  });
  return result;
};

const Favorites: React.FC<any> = ({ navigation }) => {
  const [sections, setSections] = React.useState([]);
  const [favoriteStates, setFavoriteStates] = useState<boolean>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Handle cleanup when leaving the screen (including swipe back)
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', async (e) => {
      // Perform cleanup operations
      await handleScreenExit();
    });

    return unsubscribe; // Cleanup the listener when component unmounts
  }, [navigation]);

  // Function to handle all tasks when exiting the screen
  const handleScreenExit = async () => {
    //console.log('Screen exit cleanup');
    try {
      await addRefreshChat(100);
      Analytics.clickWarmChatButtonBack();
      deleteNewIMessagesV3();
    } catch (error) {
      //console.error('Error during screen exit:', error);
    }
  };

  const fetchFavorites = async () => {
    setIsLoading(true);
    try {
      const res = await getFavoriteChat();
      if (res && res.favorites) {
        const groupedSections = groupFavoritesByDate(res.favorites);
        const sectionWidthIndexes = assignGlobalIndices(groupedSections);
        setSections(sectionWidthIndexes);
        const initialFavoriteStates: FavoriteStates = {};
        res.favorites.forEach((item) => {
          initialFavoriteStates[item.id] = true;
        });
        setFavoriteStates(initialFavoriteStates);
      } else {
        setSections([]);
      }
    } catch (error) {
      alert('대화 내역을 불러오는 중 오류가 발생했어요. 다시 시도해주세요.');
      navigation.navigate(RootStackName.BottomTabNavigator, {
        screen: TabScreenName.Home,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    Analytics.watchWarmChatScreen();
    //내가 좋아했던 말들
    fetchFavorites();
  }, []);
  const imageSources = [
    require('../../../assets/images/red_bubble.webp'),
    require('../../../assets/images/orange_bubble.webp'),
    require('../../../assets/images/yellow_bubble.webp'),
    require('../../../assets/images/green_bubble.webp'),
    require('../../../assets/images/pastel_green_bubble.webp'),
    require('../../../assets/images/sky_blue_bubble.webp'),
    require('../../../assets/images/blue_bubble.webp'),
    require('../../../assets/images/navy_bubble.webp'),
    require('../../../assets/images/purple_bubble.webp'),
    require('../../../assets/images/pink_bubble.webp'),
    // 추가 이미지...
  ];
  // 컴포넌트 마운트 시 이미지 프리로드
  useEffect(() => {
    preloadImages();
  }, []);

  const preloadImages = () => {
    imageSources.forEach((source) => {
      Image.prefetch(source);
    });
    Image.prefetch(require('../../../assets/images/bubble_cookie.webp'));
  };
  const toggleFavorite = async (id: string): Promise<void> => {
    Analytics.clickFavoriteHeartButton(id);
    const newState = !favoriteStates[id];

    // 상태 업데이트
    setFavoriteStates((prev) => ({
      ...prev,
      [id]: newState,
    }));

    // API 호출
    try {
      const res = await saveFavoriteChatLog(`${id}-B-0`, newState);
      //console.log('Favorite toggle result:', res);

      // API 호출이 실패하면 상태를 원래대로 되돌릴 수 있음
      if (!res || res.error) {
        setFavoriteStates((prev) => ({
          ...prev,
          [id]: !newState,
        }));
      }
    } catch (error) {
      //console.log('Error toggling favorite:', error);
      // 에러 발생시 상태 복원
      setFavoriteStates((prev) => ({
        ...prev,
        [id]: !newState,
      }));
    }
  };

  if (isLoading) {
    return (
      <View
        style={css`
          flex: 1;
          justify-content: center;
          align-items: center;
        `}>
        <ActivityIndicator size="large" color={palette.primary[500]} />
      </View>
    );
  }

  const TitleHeader = React.memo(() => (
    <TitleContainer>
      {/*<TitleImage source={require('../../../assets/images/bubble_cookie.png')} />*/}
      <Image
        source={require('../../../assets/images/bubble_cookie.webp')}
        style={{ width: 100, height: 100 }}
      />
      <Title>하루 끝에 꺼내보는{'\n'}따뜻한 대화</Title>
    </TitleContainer>
  ));

  return (
    <Container>
      <Header
        title={'따스한 대화 모아보기'}
        leftFunction={async () => {
          await handleScreenExit();
          navigation.goBack();
        }}
        bgcolor={`${palette.neutral[50]}`}
      />
      <SectionList
        style={{ paddingHorizontal: 20 }}
        stickySectionHeadersEnabled={false}
        sections={sections}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={TitleHeader}
        renderItem={({ item, index }) => {
          //console.log(index % imageSources.length);
          const imageSource = imageSources[item.globalIndex % imageSources.length];
          //console.log('index', index);
          //console.log('item', item);
          //console.log('imageSource', imageSource);
          return (
            <SectionComponent>
              {/* 버블 사진 영역 */}
              {/*<SectionComponentImage source={imageSource} />*/}
              {/* Text 영역 */}
              <Image source={imageSource} style={{ width: 28, height: 28 }} />
              <SectionComponentText>{item.answer}</SectionComponentText>

              {/* 아이콘 영역 */}
              <View style={{ position: 'absolute', right: 20, top: 0 }}>
                <Icon
                  name="favorite-icon"
                  width={rsWidth * 14 + 'px'}
                  height={rsHeight * 14 + 'px'}
                  toggleable
                  isSaved={favoriteStates[item.id] !== undefined ? favoriteStates[item.id] : true}
                  messageId={item.id}
                  onFavoritePress={() => toggleFavorite(item.id)}
                  iconType="favorite-bookmark-icon"
                />
              </View>
            </SectionComponent>
          );
        }}
        renderSectionHeader={({ section: { title } }) => (
          <SectionDateContainer>
            <SectionDateText>{convertUtcToKst(title)}</SectionDateText>
          </SectionDateContainer>
        )}
      />
    </Container>
  );
};

export default Favorites;
