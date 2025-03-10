import { css } from '@emotion/native';
import { Image } from 'expo-image';
import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import palette from '../../assets/styles/theme';
import { rsHeight, rsWidth } from '../../utils/responsive-size';

const BlurredButton = ({ blurredImageUri, text, buttonText, onPress }) => {
  //console.log('BlurredButton');
  const regex = /(나의 마음)/;
  const [beforeHighlight, highlight, afterHighlight] = text.split(regex);

  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
      }}>
      <View
        style={css`
          justify-content: center;
          align-items: center;
          width: 100%; // EmptyContainer의 너비에 맞춤
          height: ${rsHeight * 600 + 'px'}; // EmptyContainer 높이에 맞춤
          gap: ${rsHeight * 100 + 'px'};
          height: ${buttonText === '쿠키랑 대화하기'
            ? rsHeight * 630 + 'px'
            : rsHeight * 300 + 'px'};
        `}>
        {/* 이미 블러 처리된 이미지 사용 */}
        <ImageBackground
          source={{ uri: blurredImageUri }}
          style={styles.imageBackground}
          resizeMode="cover">
          {/* 반투명 검정 프레임 */}
          <View
            style={css`
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.4); // 검정색 40% 불투명도
              justify-content: center;
              align-items: center;
            `}>
            {/* 텍스트 */}
            <Text style={styles.text}>
              {beforeHighlight}
              <Text style={[styles.text, { color: '#D8FF75' }]}>{highlight}</Text>
              {afterHighlight}
            </Text>

            {/* 쿠키 이미지*/}
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              {buttonText === '쿠키랑 대화하기' ? (
                <View style={{ width: 140 * rsWidth, height: 112 * rsHeight }}>
                  <Image
                    style={{ flex: 1, width: '100%', height: '100%' }}
                    source={{
                      uri: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/statistic/waitingcookie.png',
                    }}
                  />
                </View>
              ) : (
                <View style={{ width: 220 * rsWidth, height: 85 * rsHeight }}>
                  <Image
                    style={{ flex: 1, width: '100%', height: '100%' }}
                    source={{
                      uri: 'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/statistic/mindthinkingcookie.png',
                    }}
                  />
                </View>
              )}
              {/* 버튼 */}
              <View
                style={css`
                  background-color: ${buttonText === '쿠키랑 대화하기'
                    ? palette.primary[500]
                    : '#A091EF'};
                  padding-vertical: ${10 * rsHeight + 'px'};
                  padding-horizontal: ${20 * rsWidth + 'px'};
                  border-radius: 10px;
                `}>
                <Text style={styles.buttonText}>{buttonText}</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    overflow: 'hidden',
  },
  text: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Pretendard-Bold',
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Pretendard-SemiBold',
  },
});

export default BlurredButton;
