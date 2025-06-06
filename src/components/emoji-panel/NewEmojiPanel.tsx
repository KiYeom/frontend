import React from 'react';
import { View, Text, ScrollView, Dimensions, ImageSourcePropType, Image } from 'react-native';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
import palette from '../../assets/styles/theme';

type NewEmojiPanelProps = {
  height: number;
};

// 실제 이미지 소스 배열 (24개)
const emojiImages: ImageSourcePropType[] = [
  require('../../assets/images/emoji/ver1_item1_goodmorning.png'),
  require('../../assets/images/emoji/ver1_item2_goodnight.png'),
  require('../../assets/images/emoji/ver1_item3_gratitude.png'),
  require('../../assets/images/emoji/ver1_item4_love.png'),
  require('../../assets/images/emoji/ver1_item5_hungry.png'),
  require('../../assets/images/emoji/ver1_item6_sleepy.png'),
  require('../../assets/images/emoji/ver1_item7_congratulation.png'),
  require('../../assets/images/emoji/ver1_item8_fighting.png'),
  require('../../assets/images/emoji/ver1_item9_play.png'),
  require('../../assets/images/emoji/ver1_item10_secret.png'),
  require('../../assets/images/emoji/ver1_item11_wondering.png'),
  require('../../assets/images/emoji/ver1_item12_dugundugun.png'),
  require('../../assets/images/emoji/ver1_item13_upset.png'),
  require('../../assets/images/emoji/ver1_item14_stress.png'),
  require('../../assets/images/emoji/ver1_item15_impressed.png'),
  require('../../assets/images/emoji/ver1_item16_badresult.png'),
  require('../../assets/images/emoji/ver1_item17_aha.png'),
  require('../../assets/images/emoji/ver1_item18_firefriday.png'),
  require('../../assets/images/emoji/ver1_item19_cookiehi.png'),
  require('../../assets/images/emoji/ver1_item20_music.png'),
  require('../../assets/images/emoji/ver1_item21_netflix.png'),
  require('../../assets/images/emoji/ver1_item22_book.png'),
  require('../../assets/images/emoji/ver1_item23_exercise.png'),
  require('../../assets/images/emoji/ver1_item24_lucky.png'),
];

const { width: screenWidth } = Dimensions.get('window');

const NewEmojiPanel: React.FC<NewEmojiPanelProps> = ({ height }) => {
  const COLUMNS = 4;
  const ROWS = 6;
  const TOTAL_ITEMS = COLUMNS * ROWS; // 24개

  // 만약 props로 아이템을 따로 넘기지 않았다면 기본적으로 emojiImages 사용
  // (defaultItems는 사실 사용되지 않고, 여기서는 emojiImages 배열 길이가 24로 고정되므로 그냥 emojiImages만 씁니다)
  const displayItems = emojiImages.slice(0, TOTAL_ITEMS);

  const FIXED_ITEM_SIZE = 50;
  const SCROLLVIEW_HORIZONTAL_PADDING = rsWidth * 0.05;
  const ITEM_GAP_HORIZONTAL = 10;
  const ITEM_GAP_VERTICAL = rsHeight * 0.02; // 예시로 rsHeight * 0.02 정도로 설정

  // 배열을 4개씩 잘라서 6개의 행으로 묶어주는 유틸 함수
  const groupItemsByRows = (arr: any[], columns: number) => {
    const rows: any[][] = [];
    for (let i = 0; i < arr.length; i += columns) {
      rows.push(arr.slice(i, i + columns));
    }
    return rows;
  };

  // 24개 이미지를 4개씩 묶어서 [[0,1,2,3], [4,5,6,7], ..., [20,21,22,23]] 형태로 만듬
  const itemRows = groupItemsByRows(displayItems, COLUMNS);

  // 이제 renderItem은 “전달받은 index(전역 인덱스)를 그대로 사용”하도록 수정
  const renderItem = (imageSource: ImageSourcePropType, globalIndex: number) => (
    <View
      key={globalIndex}
      style={{
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        flex: 1,
        width: 85,
      }}>
      <Image
        source={emojiImages[globalIndex]} // 여기서 globalIndex로 접근
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 8,
        }}
        resizeMode="contain"
      />
    </View>
  );

  // 각 행을 렌더링할 때 “globalIndex = rowIndex * COLUMNS + itemIndex” 로 계산
  const renderRow = (rowItems: ImageSourcePropType[], rowIndex: number) => (
    <View
      key={rowIndex}
      style={{
        backgroundColor: 'pink',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        height: 85,
        marginBottom: rowIndex < itemRows.length - 1 ? ITEM_GAP_VERTICAL : 0,
      }}>
      {rowItems.map((item, itemIndex) => {
        const globalIndex = rowIndex * COLUMNS + itemIndex;
        return renderItem(item, globalIndex);
      })}
    </View>
  );

  return (
    <View style={{ backgroundColor: 'pink', height: height }}>
      {/* 헤더 */}
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
          paddingHorizontal: 10,
          paddingVertical: 10,
          backgroundColor: 'yellow',
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, gap: 10 }}>
          {itemRows.map((rowItems, rowIndex) => renderRow(rowItems, rowIndex))}
        </View>
        <View style={{ height: rsHeight * 0.02 }} />
      </ScrollView>
    </View>
  );
};

export default NewEmojiPanel;
