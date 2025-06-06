import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
import palette from '../../assets/styles/theme';

type NewEmojiPanelProps = {
  height: number;
  items?: string[]; // 아이템 배열 추가
};

// 화면의 너비 가져오기
const { width: screenWidth } = Dimensions.get('window');

const NewEmojiPanel: React.FC<NewEmojiPanelProps> = ({ height, items }) => {
  const COLUMNS = 4;
  const ROWS = 6;
  const TOTAL_ITEMS = COLUMNS * ROWS; // 총 24개 아이템

  // 기본 아이템 데이터 (props로 전달되지 않은 경우)
  const defaultItems = Array.from({ length: TOTAL_ITEMS }, (_, index) => `아이템${index + 1}`);
  const displayItems = items || defaultItems;

  // 아이템 하나의 고정된 크기
  const FIXED_ITEM_SIZE = 50;

  // ScrollView의 좌우 패딩 값
  const SCROLLVIEW_HORIZONTAL_PADDING = rsWidth * 0.05;

  // 아이템 사이의 간격
  const ITEM_GAP_HORIZONTAL = 10;
  const ITEM_GAP_VERTICAL = rsWidth * 10;

  // 아이템들을 행별로 그룹화하는 함수
  const groupItemsByRows = (items: string[], columns: number) => {
    const rows = [];
    for (let i = 0; i < items.length; i += columns) {
      rows.push(items.slice(i, i + columns));
    }
    return rows;
  };

  const itemRows = groupItemsByRows(displayItems.slice(0, TOTAL_ITEMS), COLUMNS);

  // 개별 아이템 렌더링 함수
  const renderItem = (item: string, index: number) => (
    <View
      key={index}
      style={{
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8, // 약간의 둥근 모서리
        flex: 1,
        width: 85,
      }}>
      <Text
        style={{
          fontSize: rsWidth * 0.03,
          color: 'white',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
        numberOfLines={1}
        adjustsFontSizeToFit>
        {item}
      </Text>
    </View>
  );

  // 행 렌더링 함수
  const renderRow = (rowItems: string[], rowIndex: number) => (
    <View
      key={rowIndex}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: ITEM_GAP_HORIZONTAL,
        height: 85,
        marginBottom: rowIndex < itemRows.length - 1 ? ITEM_GAP_VERTICAL : 0,
      }}>
      {rowItems.map((item, itemIndex) => renderItem(item, itemIndex))}
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
        }}>
        <Text
          style={{
            fontSize: rsWidth * 0.045,
            fontWeight: 'bold',
            color: palette.neutral[900],
          }}>
          하잉
        </Text>
        <Text style={{ fontSize: rsWidth * 0.04, color: 'blue' }}>구매하기</Text>
      </View>

      {/* 스크롤 가능한 아이템 그리드 */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingVertical: rsHeight * 0.02,
          backgroundColor: 'yellow',
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}>
        {/* 아이템 그리드 */}
        <View style={{ flex: 1 }}>
          {itemRows.map((rowItems, rowIndex) => renderRow(rowItems, rowIndex))}
        </View>

        {/* 추가 콘텐츠가 있을 경우를 위한 여백 */}
        <View style={{ height: rsHeight * 0.02 }} />
      </ScrollView>
    </View>
  );
};

export default NewEmojiPanel;
