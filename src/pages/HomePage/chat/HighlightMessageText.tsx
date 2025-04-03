import React from 'react';
import { Text } from 'react-native';
import palette from '../../../assets/styles/theme';
import { rsFont } from '../../../utils/responsive-size';

/**
 * 정규표현식에서 특수문자를 이스케이프하기 위한 헬퍼 함수
 */
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * HighlightedMessageText 컴포넌트
 * - text: 전체 텍스트
 * - highlight: 하이라이트할 키워드
 */
const HighlightedMessageText: React.FC<{ text: string; highlight?: string }> = ({
  text,
  highlight,
}) => {
  if (!highlight || highlight.trim() === '') {
    return <Text>{text}</Text>;
  }

  // highlight에 포함될 수 있는 특수문자를 이스케이프 처리
  const escapedHighlight = escapeRegExp(highlight);
  const regex = new RegExp(`(${escapedHighlight})`, 'gi');

  // 키워드를 기준으로 텍스트를 분리
  const parts = text.split(regex);

  return (
    <Text>
      {parts.map((part, index) =>
        part === highlight ? (
          <Text key={index} style={{ backgroundColor: `${palette.neutral[900]}`, color: 'white' }}>
            {part}
          </Text>
        ) : (
          <Text key={index}>{part}</Text>
        ),
      )}
    </Text>
  );
};

export default HighlightedMessageText;
