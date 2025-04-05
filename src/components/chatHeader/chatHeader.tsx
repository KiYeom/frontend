import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import palette from '../../assets/styles/theme';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
import React from 'react';
import Icon, { TIconName } from '../icons/icons';
import {
  HeaderCenter,
  HeaderContainer,
  HeaderEvent,
  HeaderLeft,
  HeaderRight,
  HeaderTitle,
  OptionText,
} from '../header/header.styles';
import { searchChatWord } from '../../apis/chatting';
import { HeaderProps } from '../header/header';
import { TextInput, Text, View, TouchableOpacity } from 'react-native';
import { ExtendedIMessage } from '~/src/utils/chatting';

interface ChatHeaderProps extends HeaderProps {
  riskStatusV2: string;
  isSearchMode: boolean;
  setIsSearchMode: React.Dispatch<React.SetStateAction<boolean>>;
  scrollToMessageById?: (messageId: string | number) => void;
  handleSearch?: (text: string, direction: null | 'up' | 'down') => Promise<string | null>;
  searchWord?: string;
  setSearchWord?: React.Dispatch<React.SetStateAction<string>>;
  updateMessageHighlights?: React.Dispatch<React.SetStateAction<ExtendedIMessage>>;
}

const ChatHeader: React.FC<ChatHeaderProps> = (props: ChatHeaderProps) => {
  const insets = useSafeAreaInsets();
  const {
    riskStatusV2,
    isSearchMode,
    setIsSearchMode,
    scrollToMessageById,
    handleSearch,
    searchWord,
    setSearchWord,
    updateMessageHighlights,
    ...headerProps
  } = props;
  console.log('searchWord', searchWord);

  return (
    <HeaderContainer isTitle={headerProps.title !== undefined} insets={insets} bgcolor="white">
      <HeaderCenter>
        {!isSearchMode ? (
          <HeaderTitle ellipsizeMode="tail" numberOfLines={1}>
            {'쿠키의 채팅방'}
          </HeaderTitle>
        ) : (
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <TextInput
              numberOfLines={4}
              maxLength={40}
              onChangeText={(searchWord) => setSearchWord(searchWord)}
              value={searchWord}
              placeholder="검색어를 입력하세요."
              style={{
                backgroundColor: 'red',
                marginHorizontal: 20,
                width: rsWidth * 250,
                paddingVertical: 10,
                marginVertical: 5,
              }}
              returnKeyType="search"
              onSubmitEditing={async () => {
                await handleSearch(searchWord, null);
                //setSearchWord('');
              }}
            />
          </View>
        )}
      </HeaderCenter>

      {headerProps.isLeft &&
        (!isSearchMode ? (
          <HeaderLeft
            onPress={headerProps.leftFunction}
            activeOpacity={1}
            isTitle={headerProps.title !== undefined}>
            <Icon name={`arrow-left`} width={rsWidth * 9 + 'px'} color={palette.neutral[900]} />
            {headerProps.leftText !== undefined && <OptionText>{headerProps.leftText}</OptionText>}
          </HeaderLeft>
        ) : (
          <HeaderLeft activeOpacity={1} isTitle={headerProps.title !== undefined}>
            <Icon
              name={`chat-search-icon`}
              width={rsWidth * 20 + 'px'}
              color={palette.neutral[300]}
            />
            {headerProps.leftText !== undefined && <OptionText>{headerProps.leftText}</OptionText>}
          </HeaderLeft>
        ))}

      {headerProps.isRight && (
        <HeaderRight
          onPress={headerProps.rightFunction}
          activeOpacity={1}
          isTitle={headerProps.title !== undefined}
          style={{ backgroundColor: 'blue' }}>
          {!isSearchMode ? (
            <Icon name="side-menu-bar" />
          ) : (
            <TouchableOpacity
              style={{ marginLeft: 20, backgroundColor: 'yellow', padding: 10 }}
              onPress={() => {
                console.log('취소 버튼을 클릭함');
                setIsSearchMode((prev) => !prev);
                setSearchWord('');
                updateMessageHighlights('');
              }}>
              <OptionText>취소</OptionText>
            </TouchableOpacity>
          )}
        </HeaderRight>
      )}
      {headerProps.isEvent && (
        <HeaderEvent
          onPress={headerProps.eventFunction}
          activeOpacity={1}
          isTitle={headerProps.title !== undefined}>
          {!isSearchMode && (
            <Icon
              name={`chat-search-icon`}
              width={rsWidth * 30 + 'px'}
              color={palette.neutral[900]}
            />
          )}
          {headerProps.eventText !== undefined && <OptionText>{headerProps.eventText}</OptionText>}
        </HeaderEvent>
      )}
    </HeaderContainer>
  );
};

export default ChatHeader;
