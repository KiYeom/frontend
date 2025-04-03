import React from 'react';
import { Text } from 'react-native';
import palette from '../../../assets/styles/theme';
import { rsFont } from '../../../utils/responsive-size';

/*
            textStyle={{
              left: css`
                //color: ${palette.neutral[500]};
                color: red;
                font-family: Pretendard-Regular;
                font-size: ${rsFont * 14 + 'px'};
                text-align: left;
                margin-top: 0;
                margin-bottom: 0;
                margin-left: 0;
                margin-right: 0;
              `,
              right: css`
                color: #fff;
                font-family: Pretendard-Regular;
                font-size: ${rsFont * 14 + 'px'};
                text-align: left;
                margin-top: 0;
                margin-bottom: 0;
                margin-left: 0;
                margin-right: 0;
              `,
            }}
*/

/**
 * 정규표현식에서 특수문자를 이스케이프하기 위한 헬퍼 함수
 */

const commentTextStyle = {
  fontFamily: 'Pretendard-Regular',
  fontSize: rsFont * 14,
  textAlign: 'left',
  margin: 0,
};

const targetWordStyle = {
  fontFamily: 'Pretendard-Regular',
  backgroundColor: palette.neutral[900],
  color: 'white',
};

const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const HighlightedMessageText: React.FC<{
  text: string;
  highlight?: string;
  checkUserOrBot: '쿠키' | '나';
}> = ({ text, highlight, checkUserOrBot }) => {
  console.log('props', checkUserOrBot);
  const textColor = checkUserOrBot === '쿠키' ? palette.neutral[900] : 'white';
  if (!highlight || highlight.trim() === '') {
    return <Text style={[commentTextStyle, { color: textColor }]}>{text}</Text>;
  }

  // highlight에 포함될 수 있는 특수문자를 이스케이프 처리
  const escapedHighlight = escapeRegExp(highlight);
  const regex = new RegExp(`(${escapedHighlight})`, 'gi');

  // 키워드를 기준으로 텍스트를 분리
  const parts = text.split(regex);

  return (
    <Text style={[commentTextStyle, { color: textColor }]}>
      {parts.map((part, index) =>
        part === highlight ? (
          <Text key={index} style={[{ color: textColor }, targetWordStyle]}>
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
