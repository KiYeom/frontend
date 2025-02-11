import styled from '@emotion/native';
import palette from '../../src/assets/styles/theme';
import { rsHeight, rsWidth, rsFont } from '../../src/utils/responsive-size';
import { EdgeInsets } from 'react-native-safe-area-context';

//상단 헤더의 전체 박스 스타일링을 정의하는 HeaderContainer
//isTitle 속성 : 헤더에 타이틀이 있는지 (type : boolean)
//insets 속성 : 안전 영역 여백 정보를 나타내는 객체 (type : EdgeInsets)
export const HeaderContainer = styled.View<{ isTitle: boolean; insets: EdgeInsets }>`
  margin-top: ${(props) => props.insets.top + 'px'};
  height: ${rsHeight * 56 + 'px'};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative; //부모 컨테이너, 자식 요소들이 부모 기준으로 위치하게 됨
  background-color: red;
  border-color: ${palette.neutral[100]};
  border-bottom-width: ${(props) => (props.isTitle ? `${rsHeight * 1 + 'px'} ` : `0px`)};
`;

//상단 헤더의 왼쪽 영역 스타일링을 정의하는 HeaderLeft (뒤로가기 버튼)
export const HeaderLeft = styled.TouchableOpacity`
  position: absolute; //부모인 HeaderContainer를 기준으로 위치를 지정
  left: 20px; //부모의 왼쪽에 위치
  top: 19px;
  background-color: red;
`;

//상단 헤더의 오른쪽 영역 스타일링을 정의하는 HeaderRight (아이콘 버튼)
export const HeaderRight = styled.TouchableOpacity`
  position: absolute;
  background-color: blue;
`;

//상단 헤더의 가운데 영역 스타일링을 정의하는 HeaderCenter
export const HeaderCenter = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: yellow;
`;

//상단 헤더 가운데에 위치하는 타이틀 스타일링을 위한 HeaderTitle
export const HeaderTitle = styled.Text`
  text-align: center;
  font-size: ${rsFont * 18 + 'px'};
  font-family: Pretendard-SemiBold;
`;
