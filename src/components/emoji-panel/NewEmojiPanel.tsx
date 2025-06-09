import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageSourcePropType,
  Image,
  Platform,
} from 'react-native';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
import { useState, useEffect } from 'react';
import palette from '../../assets/styles/theme';
import { useSelectedEmoji } from '../../hooks/useSelectedEmoji';
import Icon from '../icons/icons';

import {
  initializeInApp,
  getCurrentOffering,
  updatePurchaseStatus,
  purchasePackage,
} from '../../services/inappService';
import Purchases, { PurchasesOffering } from 'react-native-purchases';

type NewEmojiPanelProps = {
  height: number;
  // 부모 컴포넌트가 관리하는 '현재 선택된 이모지' 객체
  //selectedEmoji?: EmojiData | null;
  // 이모지 클릭 시 호출될 콜백 (부모에서 상태를 갱신하도록)
  //onEmojiSelect?: (emoji: EmojiData) => void;
  selectedEmoji?: EmojiData | null;
  onSelectEmoji?: (emoji: EmojiData) => void;
};

// 이모지 데이터 타입 정의
export type EmojiData = {
  source: ImageSourcePropType;
  name: string;
  path?: string;
};

// 실제 이미지 소스 배열과 이름 매핑 (24개)
const emojiData: EmojiData[] = [
  {
    source: require('../../assets/images/emoji/ver1_item1_goodmorning.png'),
    name: 'goodmorning',
    path: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item1_goodmorning.png',
  },
  {
    source: require('../../assets/images/emoji/ver1_item2_goodnight.png'),
    name: 'goodnight',
    path: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item2_goodnight.png',
  },
  {
    source: require('../../assets/images/emoji/ver1_item3_gratitude.png'),
    name: 'gratitude',
    path: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item3_gratitude.png',
  },
  {
    source: require('../../assets/images/emoji/ver1_item4_love.png'),
    name: 'love',
    path: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item4_love.png',
  },
  {
    source: require('../../assets/images/emoji/ver1_item5_hungry.png'),
    name: 'hungry',
    path: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item5_hungry.png',
  },
  {
    source: require('../../assets/images/emoji/ver1_item6_sleepy.png'),
    name: 'sleepy',
    path: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item6_sleepy.png',
  },
  {
    source: require('../../assets/images/emoji/ver1_item7_congratulation.png'),
    name: 'congratulation',
    path: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item7_congratulation.png',
  },
  {
    source: require('../../assets/images/emoji/ver1_item8_fighting.png'),
    name: 'fighting',
    path: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item8_fighting.png',
  },
  {
    source: require('../../assets/images/emoji/ver1_item9_play.png'),
    name: 'play',
    path: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item9_play.png',
  },
  {
    source: require('../../assets/images/emoji/ver1_item10_secret.png'),
    name: 'secret',
    path: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item10_secret.png',
  },
  {
    source: require('../../assets/images/emoji/ver1_item11_wondering.png'),
    name: 'wondering',
    path: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item11_wondering.png',
  },
  {
    source: require('../../assets/images/emoji/ver1_item12_dugundugun.png'),
    name: 'dugundugun',
    path: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item12_dugundugun.png',
  },
  {
    source: require('../../assets/images/emoji/ver1_item13_upset.png'),
    name: 'ver1 upset',
    path: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item13_upset.png',
  },
  {
    source: require('../../assets/images/emoji/ver1_item14_stress.png'),
    name: 'ver1 stress',
    path: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item14_stress.png',
  },
  {
    source: require('../../assets/images/emoji/ver1_item15_impressed.png'),
    name: 'ver1 impressed',
    path: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item15_impressed.png',
  },
  {
    source: require('../../assets/images/emoji/ver1_item16_badresult.png'),
    name: 'ver1 badresult',
    path: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item16_newbadresult.png',
  },
  {
    source: require('../../assets/images/emoji/ver1_item17_aha.png'),
    name: 'ver1 aha',
    path: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item17_aha.png',
  },
  {
    source: require('../../assets/images/emoji/ver1_item18_firefriday.png'),
    name: 'ver1 firefriday',
    path: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item18_fireFriday.png',
  },
  {
    source: require('../../assets/images/emoji/ver1_item19_cookiehi.png'),
    name: 'ver1 cookiehi',
    path: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item19_cookieHi.png',
  },
  {
    source: require('../../assets/images/emoji/ver1_item20_music.png'),
    name: 'ver1 music',
    path: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item20_music.png',
  },
  {
    source: require('../../assets/images/emoji/ver1_item21_netflix.png'),
    name: 'ver1 netflix',
    path: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item21_netflix.png',
  },
  {
    source: require('../../assets/images/emoji/ver1_item22_book.png'),
    name: 'ver1 book',
    path: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item22_book.png',
  },
  {
    source: require('../../assets/images/emoji/ver1_item23_exercise.png'),
    name: 'ver1 exercise',
    path: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item23_exercise.png',
  },
  {
    source: require('../../assets/images/emoji/ver1_item24_lucky.png'),
    name: 'ver1 lucky',
    path: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item24_lucky.png',
  },
];

const NewEmojiPanel: React.FC<NewEmojiPanelProps> = ({ height, selectedEmoji, onSelectEmoji }) => {
  //const { selectedEmoji, onSelectEmoji } = useSelectedEmoji();
  const [hasPurchased, setHasPurchased] = useState<boolean>(false);
  const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null);
  useEffect(() => {
    const setup = async () => {
      await initializeInApp();
      const offering = await getCurrentOffering();
      setCurrentOffering(offering);
      const purchased = await updatePurchaseStatus();
      setHasPurchased(purchased);
    };
    setup().catch(console.log);
  }, []);

  const handlePurchase = async (pkg) => {
    const success = await purchasePackage(pkg, hasPurchased);
    if (success) {
      const purchased = await updatePurchaseStatus();
      setHasPurchased(purchased);
    }
  };

  const COLUMNS = 4;
  const ROWS = 6;
  const TOTAL_ITEMS = COLUMNS * ROWS; // 24개

  // 화면에 보여줄 아이템 배열
  const displayItems = emojiData.slice(0, TOTAL_ITEMS);

  const FIXED_ITEM_SIZE = 85; //아이템 하나 당 고정 크기
  const SCROLLVIEW_HORIZONTAL_PADDING = rsWidth * 10; //스크롤뷰 좌우 패딩값
  const ITEM_GAP = {
    //아이템간 가로 세로 간격 설정
    horizontal: rsWidth * 10,
    vertical: rsHeight * 10,
  };
  const SCROLLVIEW_VERTICAL_PADDING = rsHeight * 20;

  // 이모지 데이터 배열을 4개씩 잘라서 6개의 행으로 묶어주는 유틸 함수
  const groupItemsByRows = (arr: EmojiData[], columns: number) => {
    const rows: EmojiData[][] = [];
    for (let i = 0; i < arr.length; i += columns) {
      rows.push(arr.slice(i, i + columns));
    }
    return rows;
  };

  // 24개 이미지를 4개씩 묶어서 [[0,1,2,3], [4,5,6,7], ..., [20,21,22,23]] 형태로 만듬
  const itemRows = groupItemsByRows(displayItems, COLUMNS);

  // 개별 이모지 박스
  const renderItem = (emojiItem: EmojiData, globalIndex: number) => (
    <TouchableOpacity
      key={globalIndex}
      style={{
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        width: FIXED_ITEM_SIZE,
      }}
      activeOpacity={1} // 터치 시 투명도 변경 방지
      onPress={() => {
        console.log(`'${emojiItem.name}' 아이콘 클릭됨`);
        console.log(`'${emojiItem.source}' 아이콘 클릭됨`);
        onSelectEmoji(emojiItem.path);
      }}>
      <Image
        source={{ uri: emojiItem.path }}
        style={{
          width: '100%',
          height: '100%',
        }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  // 한 행의 아이템 렌더링하는 함수
  const renderRow = (rowItems: EmojiData[], rowIndex: number) => (
    <View
      key={rowIndex}
      style={{
        backgroundColor: 'pink',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: ITEM_GAP.horizontal, //개별 아이템마다의 가로 간격
        height: FIXED_ITEM_SIZE,
      }}>
      {rowItems.map((item, itemIndex) => {
        const globalIndex = rowIndex * COLUMNS + itemIndex;
        return renderItem(item, globalIndex);
      })}
    </View>
  );

  return (
    <View style={{ backgroundColor: 'pink', height: height, borderColor: 'black', borderWidth: 1 }}>
      {/* 이모티콘 소개 및 구매하기 버튼*/}
      <View
        style={{
          backgroundColor: 'orange',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: rsWidth * 15,
          paddingVertical: rsHeight * 10,
        }}>
        <View
          style={{
            position: 'relative', // 오버레이를 위해 부모를 상대 위치로 설정
            width: 30,
            height: 30,
            borderRadius: 5,
            backgroundColor: hasPurchased ? palette.primary[500] : palette.neutral[100],
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {hasPurchased ? '이모지 샀음' : '이모지 안샀음'}
          <Icon name={hasPurchased ? `emoji-thumbnail` : `emoji-thumbnail-off`} width={24} />
          {!hasPurchased && (
            <View
              style={{
                position: 'absolute',
                top: -15,
                right: -5,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon name="lock" width={16} color={palette.neutral[50]} />
            </View>
          )}
        </View>

        {currentOffering?.availablePackages?.length > 0 && (
          <TouchableOpacity onPress={() => handlePurchase(currentOffering.availablePackages[0])}>
            <Text style={{ color: 'blue' }}>구매하기</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 스크롤 가능한 아이템 그리드 */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: SCROLLVIEW_HORIZONTAL_PADDING,
          paddingVertical: SCROLLVIEW_VERTICAL_PADDING, //스크롤뷰의 상하 패딩 값
          backgroundColor: 'yellow',
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, gap: ITEM_GAP.vertical }}>
          {itemRows.map((rowItems, rowIndex) => renderRow(rowItems, rowIndex))}
        </View>
      </ScrollView>
    </View>
  );
};

export default NewEmojiPanel;
