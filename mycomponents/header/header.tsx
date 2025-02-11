// 페이지에서 뒤로 갈 때 사용되는 기본 헤더
// [1] 좌측 : 뒤로 가기 아이콘
// [2] 중앙 : 상황에 따라 페이지에 대한 안내 제목
// [3] 우측 : 채팅 화면에서만 + 위험한 경우에만 사용되는 위험 신호 알림

import Icon, { TIconName } from '../src/components/icons/icons';
import {
  HeaderContainer,
  HeaderCenter,
  HeaderLeft,
  HeaderRight,
  HeaderTitle,
} from './header.style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React from 'react';
type HeaderProps = {
  //중앙
  title?: string;
  //좌측
  isLeft?: boolean;
  leftIcon?: TIconName;
  leftFunction?: () => void;
  //우측
  isRight?: boolean;
  rightIcon?: TIconName;
  rightFunction?: () => void;
};

/* 헤더 컴포넌트 설계 (일반화 과정)
1. React.FC로 함수형 컴포넌트로 만들기
2. 헤더 컴포넌트는 HeaderProps 속성(props)을 전달 받는다.
3. HeaderProps 타입에 따라 전달된 값이 props로 들어오게 된다.
*/
const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const insets = useSafeAreaInsets();
  //기기의 안전 영역 (Safe Area)에 대한 정보를 객체 형태로 받아옴

  const {
    title = undefined,
    isLeft = true,
    leftFunction = () => {
      console.log('왼쪽 버튼을 누름');
    },
    isRight = false,
    rightFunction = () => {
      console.log('오른쪽 버튼을 누름!');
    },
  } = props;
  //구조 분해 할당을 통해 props에서 필요한 속성들을 변수로

  return (
    <HeaderContainer isTitle={title !== undefined} insets={insets}>
      <HeaderCenter>
        <HeaderTitle>{title}</HeaderTitle>
      </HeaderCenter>
    </HeaderContainer>
  );
};
export default Header;
