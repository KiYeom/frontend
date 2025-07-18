import Airplane from './svg/airplane';
import AngryEmotion from './svg/angry-emotion';
import ArrowDown from './svg/arrow-down';
import ArrowLeft from './svg/arrow-left';
import ArrowRight from './svg/arrow-right';
import Calendar from './svg/calendar';
import CallIcon from './svg/call';
import CancelIcon from './svg/cancel-icon';
import CheckIcon from './svg/check-icon';
import CloverIcon from './svg/clover';
import DangerSign from './svg/danger-sign';
import DangerSignOpened from './svg/danger-sign-opened';
import DateIcon from './svg/date-icon';
import EmptyIcon from './svg/emptyicon';
import HappyEmotion from './svg/happy-emotion';
import HomeIcon from './svg/home-icon';
import Letter from './svg/letter';
import CalmEmotion from './svg/relax-emotion';
import Remindlogo from './svg/remind-logo';
import SadEmotion from './svg/sad-emotion';
import Search from './svg/search';
import SettingIcon from './svg/setting-icon';
import StatisticIcon from './svg/statistic-icon';
import TextIcon from './svg/text';
import ChatIcon from './svg/chat';
import InformationIcon from './svg/information';
import DefaultHeart from './svg/default-heart';
import Warning from './svg/warning';
import DairyCookie from './svg/DairyCookie';
import EmotionThinkingCookie from './svg/emotion-thinking-cookie';
import SideMenuBar from './svg/side-menu-bar';
import SideMenuBarAlert from './svg/side-menu-bar-alart';
import EventIcon from './svg/event-icon';
import TodayNoEntry from './svg/today-no-entry';
import Pencil from './svg/pencil';
import GreenChatIcon from './svg/chat';
import NormalEmotion from './svg/normal-emotion';
import EditIcon from './svg/edit-icon';
import FavoriteIcon from './svg/favorite-icon';
import TrashIcon from './svg/trash-icon';
import ChatSearch from './svg/chat-search-icon';
import ArrowUp from './svg/arrow-up';
import Picture from './svg/picture';
import MultiPic from './svg/multi-pic';
import HelloCookie from './svg/hellocookie';
import CloverCookie from './svg/clover-cookie';
import Fire from './svg/fire';
import TwinkleCookie from './svg/twinkle-cookie';
import Dislike from './svg/dislike';
import EmojiIcon from './svg/emoji';
import EmojiThumbnail from './svg/emoji-thumbnail-on';
import EmojiThumbnailOff from './svg/emoji-thumbnail-off';
import Lock from './svg/lock';
import CallStart from './svg/call-start-icon';
import CallPause from './svg/call-pause-icon';
import CallResume from './svg/call-resume-icon';
import CallEnd from './svg/call-end-icon';
import Clock from './svg/clock';
import Mic from './svg/mic';

export type TIconName =
  | 'airplane'
  | 'arrow-down'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-up'
  | 'date-icon'
  | 'home-icon'
  | 'setting-icon'
  | 'statistic-icon'
  | 'clover-icon'
  | 'happy-emotion'
  | 'angry-emotion'
  | 'sad-emotion'
  | 'calm-emotion'
  | 'check-icon'
  | 'cancel-icon'
  | 'calendar'
  | 'remind-logo'
  | 'call'
  | 'text'
  | 'danger-sign'
  | 'danger-sign-opened'
  | 'search'
  | 'letter'
  | 'empty-icon'
  | 'chat-icon'
  | 'information'
  | 'default-heart'
  | 'warning'
  | 'dairy-cookie'
  | 'emotion-thinking-cookie'
  | 'side-menu-bar'
  | 'side-menu-bar-alert'
  | 'event-icon'
  | 'today-no-entry'
  | 'pencil'
  | 'green-chat-icon'
  | 'normal-emotion'
  | 'edit-icon'
  | 'favorite-icon'
  | 'favorite-bookmark-icon'
  | 'trash-icon'
  | 'chat-search-icon'
  | 'picture-icon'
  | 'multi-pic'
  | 'hello-cookie'
  | 'picture-icon'
  | 'clover-cookie'
  | 'fire'
  | 'twinkle-cookie'
  | 'dislike'
  | 'emojiIcon'
  | 'emoji-thumbnail'
  | 'emoji-thumbnail-off'
  | 'lock'
  | 'call-start'
  | 'call-pause'
  | 'call-resume'
  | 'call-end'
  | 'clock'
  | 'mic';

export default function Icon({
  width,
  height,
  color,
  name,
  toggleable,
  isSaved,
  messageId,
  onFavoritePress,
  iconType,
  disabled,
}: {
  width?: number | string;
  height?: number | string;
  color?: string;
  name: TIconName;
  toggleable?: boolean;
  isSaved?: boolean;
  messageId?: string;
  onFavoritePress?: (messageId: string) => void;
  iconType?: string;
  disabled?: boolean;
}) {
  switch (name) {
    case 'airplane':
      return <Airplane width={width} height={height} color={color} />;
    case 'arrow-down':
      return <ArrowDown width={width} height={height} color={color} />;
    case 'arrow-left':
      return <ArrowLeft width={width} height={height} color={color} />;
    case 'arrow-right':
      return <ArrowRight width={width} height={height} color={color} />;
    case 'arrow-up':
      return <ArrowUp width={width} height={height} color={color} />;
    case 'date-icon':
      return <DateIcon width={width} height={height} color={color} />;
    case 'home-icon':
      return <HomeIcon width={width} height={height} color={color} />;
    case 'setting-icon':
      return <SettingIcon width={width} height={height} color={color} />;
    case 'statistic-icon':
      return <StatisticIcon width={width} height={height} color={color} />;
    case 'chat-icon':
      return <ChatIcon width={width} height={height} color={color} />;
    case 'clover-icon':
      return <CloverIcon width={width} height={height} color={color} />;
    case 'happy-emotion':
      return <HappyEmotion width={width} height={height} color={color} />;
    case 'angry-emotion':
      return <AngryEmotion width={width} height={height} color={color} />;
    case 'sad-emotion':
      return <SadEmotion width={width} height={height} color={color} />;
    case 'calm-emotion':
      return <CalmEmotion width={width} height={height} color={color} />;
    case 'check-icon':
      return <CheckIcon width={width} height={height} color={color} />;
    case 'cancel-icon':
      return <CancelIcon width={width} height={height} color={color} />;
    case 'calendar':
      return <Calendar width={width} height={height} color={color} />;
    case 'remind-logo':
      return <Remindlogo width={width} height={height} color={color} />;
    case 'call':
      return <CallIcon width={width} height={height} color={color} />;
    case 'text':
      return <TextIcon width={width} height={height} color={color} />;
    case 'danger-sign':
      return <DangerSign width={width} height={height} color={color} />;
    case 'danger-sign-opened':
      return <DangerSignOpened width={width} height={height} color={color} />;
    case 'search':
      return <Search width={width} height={height} color={color} />;
    case 'letter':
      return <Letter width={width} height={height} color={color} />;
    case 'empty-icon':
      return <EmptyIcon width={width} height={height} color={color} />;
    case 'information':
      return <InformationIcon width={width} height={height} color={color} />;
    case 'default-heart':
      return <DefaultHeart width={width} height={height} color={color} />;
    case 'warning':
      return <Warning width={width} height={height} color={color} />;
    case 'dairy-cookie':
      return <DairyCookie width={width} height={height} color={color} />;
    case 'emotion-thinking-cookie':
      return <EmotionThinkingCookie width={width} height={height} color={color} />;
    case 'side-menu-bar':
      return <SideMenuBar width={width} height={height} color={color} />;
    case 'side-menu-bar-alert':
      return <SideMenuBarAlert width={width} height={height} color={color} />;
    case 'event-icon':
      return <EventIcon width={width} height={height} color={color} />;
    case 'today-no-entry':
      return <TodayNoEntry width={width} height={height} color={color} />;
    case 'pencil':
      return <Pencil width={width} height={height} color={color} />;
    case 'green-chat-icon':
      return <GreenChatIcon width={width} height={height} color={color} />;
    case 'normal-emotion':
      return <NormalEmotion width={width} height={height} color={color} />;
    case 'edit-icon':
      return <EditIcon width={width} height={height} color={color} />;
    case 'favorite-icon':
    case 'favorite-bookmark-icon':
      return (
        <FavoriteIcon
          width={width}
          height={height}
          color={color}
          toggleable={toggleable}
          isSaved={isSaved}
          messageId={messageId}
          onFavoritePress={onFavoritePress}
          iconType={iconType}
        />
      );
    case 'trash-icon':
      return <TrashIcon width={width} height={height} color={color} />;
    case 'chat-search-icon':
      return <ChatSearch width={width} height={height} color={color} />;
    case 'picture-icon':
      return <Picture width={width} height={height} color={color} />;
    case 'multi-pic':
      return <MultiPic width={width} height={height} color={color} />;
    case 'hello-cookie':
      return <HelloCookie width={width} height={height} color={color} />;
    case 'clover-cookie':
      return <CloverCookie width={width} height={height} color={color} />;
    case 'fire':
      return <Fire width={width} height={height} color={color} />;
    case 'twinkle-cookie':
      return <TwinkleCookie width={width} height={height} color={color} />;
    case 'dislike':
      return <Dislike width={width} height={height} color={color} />;
    case 'emojiIcon':
      return <EmojiIcon width={width} height={height} color={color} />;
    case 'emoji-thumbnail':
      return <EmojiThumbnail width={width} height={height} color={color} />;
    case 'emoji-thumbnail-off':
      return <EmojiThumbnailOff width={width} height={height} color={color} />;
    case 'lock':
      return <Lock width={width} height={height} color={color} />;
    case 'call-start':
      return <CallStart width={width} height={height} color={color} disabled={disabled} />;
    case 'call-pause':
      return <CallPause width={width} height={height} color={color} disabled={disabled} />;
    case 'call-resume':
      return <CallResume width={width} height={height} color={color} disabled={disabled} />;
    case 'call-end':
      return <CallEnd width={width} height={height} color={color} disabled={disabled} />;
    case 'clock':
      return <Clock width={width} height={height} color={color} />;
    case 'mic':
      return <Mic width={width} height={height} color={color} />;
  }
}
