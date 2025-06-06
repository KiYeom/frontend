import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageSourcePropType,
  Image,
} from 'react-native';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
import palette from '../../assets/styles/theme';

type NewEmojiPanelProps = {
  height: number;
};

// 이모지 데이터 타입 정의
type EmojiData = {
  source: ImageSourcePropType;
  name: string;
};

// 실제 이미지 소스 배열과 이름 매핑 (24개)
const emojiData: EmojiData[] = [
  {
    source: require('../../assets/images/emoji/ver1_item1_goodmorning.png'),
    name: 'ver1 goodmorning',
  },
  {
    source: require('../../assets/images/emoji/ver1_item2_goodnight.png'),
    name: 'ver1 goodnight',
  },
  {
    source: require('../../assets/images/emoji/ver1_item3_gratitude.png'),
    name: 'ver1 gratitude',
  },
  {
    source: require('../../assets/images/emoji/ver1_item4_love.png'),
    name: 'ver1 love',
  },
  {
    source: require('../../assets/images/emoji/ver1_item5_hungry.png'),
    name: 'ver1 hungry',
  },
  {
    source: require('../../assets/images/emoji/ver1_item6_sleepy.png'),
    name: 'ver1 sleepy',
  },
  {
    source: require('../../assets/images/emoji/ver1_item7_congratulation.png'),
    name: 'ver1 congratulation',
  },
  {
    source: require('../../assets/images/emoji/ver1_item8_fighting.png'),
    name: 'ver1 fighting',
  },
  {
    source: require('../../assets/images/emoji/ver1_item9_play.png'),
    name: 'ver1 play',
  },
  {
    source: require('../../assets/images/emoji/ver1_item10_secret.png'),
    name: 'ver1 secret',
  },
  {
    source: require('../../assets/images/emoji/ver1_item11_wondering.png'),
    name: 'ver1 wondering',
  },
  {
    source: require('../../assets/images/emoji/ver1_item12_dugundugun.png'),
    name: 'ver1 dugundugun',
  },
  {
    source: require('../../assets/images/emoji/ver1_item13_upset.png'),
    name: 'ver1 upset',
  },
  {
    source: require('../../assets/images/emoji/ver1_item14_stress.png'),
    name: 'ver1 stress',
  },
  {
    source: require('../../assets/images/emoji/ver1_item15_impressed.png'),
    name: 'ver1 impressed',
  },
  {
    source: require('../../assets/images/emoji/ver1_item16_badresult.png'),
    name: 'ver1 badresult',
  },
  {
    source: require('../../assets/images/emoji/ver1_item17_aha.png'),
    name: 'ver1 aha',
  },
  {
    source: require('../../assets/images/emoji/ver1_item18_firefriday.png'),
    name: 'ver1 firefriday',
  },
  {
    source: require('../../assets/images/emoji/ver1_item19_cookiehi.png'),
    name: 'ver1 cookiehi',
  },
  {
    source: require('../../assets/images/emoji/ver1_item20_music.png'),
    name: 'ver1 music',
  },
  {
    source: require('../../assets/images/emoji/ver1_item21_netflix.png'),
    name: 'ver1 netflix',
  },
  {
    source: require('../../assets/images/emoji/ver1_item22_book.png'),
    name: 'ver1 book',
  },
  {
    source: require('../../assets/images/emoji/ver1_item23_exercise.png'),
    name: 'ver1 exercise',
  },
  {
    source: require('../../assets/images/emoji/ver1_item24_lucky.png'),
    name: 'ver1 lucky',
  },
];

const { width: screenWidth } = Dimensions.get('window');

const NewEmojiPanel: React.FC<NewEmojiPanelProps> = ({ height }) => {
  const COLUMNS = 4;
  const ROWS = 6;
  const TOTAL_ITEMS = COLUMNS * ROWS; // 24개

  // 화면에 보여줄 아이템 배열
  const displayItems = emojiData.slice(0, TOTAL_ITEMS);

  const FIXED_ITEM_SIZE = 85; //아이템 하나 당 고정 크기
  const SCROLLVIEW_HORIZONTAL_PADDING = rsWidth * 10; //스크롤뷰 좌우 패딩값
  const ITEM_GAP = {
    //아이템간 가로 세로 간격 설정
    horizontal: rsWidth * 10, // 예시로 rsWidth * 0.05 정도로 설정
    vertical: rsHeight * 10, // 예시로 rsHeight * 0.02 정도로 설정
  };
  const CONTAINERVERTICALPADDING = rsHeight * 20;
  const SCROLLVIEW_VERTICAL_PADDING = rsHeight * 20;
  const ITEM_GAP_VERTICAL = rsHeight * 0.02; // 예시로 rsHeight * 0.02 정도로 설정

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
      }}>
      <Image
        source={emojiItem.source}
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
    <View style={{ backgroundColor: 'pink', height: height, borderColor: 'black' }}>
      {/* 이모티콘 소개 및 구매하기 버튼*/}
      <View
        style={{
          backgroundColor: 'orange',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: rsWidth * 0.05,
          paddingVertical: rsHeight * 0.01,
          height: 30,
        }}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: 'bold',
            color: palette.neutral[900],
          }}>
          하잉
        </Text>
        <Text style={{ fontSize: 13, color: 'blue' }}>구매하기</Text>
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
