// hooks/useSelectedEmoji.ts
import { useState } from 'react';
import type { EmojiData } from '../components/emoji-panel/NewEmojiPanel';

export function useSelectedEmoji(initial: EmojiData | null = null) {
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiData | null>(initial);

  /**
   * 이 함수를 호출하면 파라미터로 전달된 이모지가 선택되고,
   * 이전에 선택된 이모지는 자동으로 해제됩니다.
   */
  const onSelectEmoji = (emoji: EmojiData) => {
    // 이미 같은 이모지가 선택된 상태라면 해제하도록 토글을 구현하고 싶으면 아래 주석을 해제하세요.
    // if (selectedEmoji?.name === emoji.name) {
    //   setSelectedEmoji(null);
    //   return;
    // }
    //console.log('============Selected Emoji 실행됨=========', emoji);
    setSelectedEmoji(emoji);
  };

  return { selectedEmoji, onSelectEmoji };
}
