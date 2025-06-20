// services/imagePreloader.js
import { Image } from 'expo-image';

const emojiImageUrls = [
  'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item1_goodmorning.png',
  'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item2_goodnight.png',
  'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item3_gratitude.png',
  'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item4_love.png',
  'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item5_hungry.png',
  'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item6_sleepy.png',
  'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item7_congratulation.png',
  'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item8_fighting.png',
  'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item9_play.png',
  'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item10_secret.png',
  'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item11_wondering.png',
  'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item12_dugundugun.png',
  'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item13_upset.png',
  'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item14_stress.png',
  'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item15_impressed.png',
  'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item16_newbadresult.png',
  'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item17_aha.png',
  'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item18_fireFriday.png',
  'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item19_cookieHi.png',
  'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item20_music.png',
  'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item21_netflix.png',
  'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item22_book.png',
  'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item23_exercise.png',
  'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/emoji/ver1_item24_lucky.png',
];

export const preloadEmojiImages = async () => {
  try {
    console.log('🚀 이모지 이미지 프리로딩 시작...');

    const preloadPromises = emojiImageUrls.map((url) =>
      Image.prefetch(url, { cachePolicy: 'memory-disk' }),
    );

    await Promise.all(preloadPromises);
    console.log('✅ 이모지 이미지 프리로딩 완료!');
  } catch (error) {
    console.error('❌ 이미지 프리로딩 실패:', error);
  }
};
