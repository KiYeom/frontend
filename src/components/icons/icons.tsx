import Airplane from './svg/airplane';
import AngryEmotion from './svg/angry-emotion';
import ArrowDown from './svg/arrow-down';
import ArrowLeft from './svg/arrow-left';
import ArrowRight from './svg/arrow-right';
import Calendar from './svg/calendar';
import CancelIcon from './svg/cancel-icon';
import CheckIcon from './svg/check-icon';
import CloverIcon from './svg/clover';
import DateIcon from './svg/date-icon';
import HappyEmotion from './svg/happy-emotion';
import HomeIcon from './svg/home-icon';
import CalmEmotion from './svg/relax-emotion';
import Remindlogo from './svg/remind-logo';
import SadEmotion from './svg/sad-emotion';
import SettingIcon from './svg/setting-icon';
import StatisticIcon from './svg/statistic-icon';

export type TIconName =
  | 'airplane'
  | 'arrow-down'
  | 'arrow-left'
  | 'arrow-right'
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
  | 'remind-logo';

export default function Icon({
  width,
  height,
  color,
  name,
}: {
  width?: number | string;
  height?: number | string;
  color?: string;
  name: TIconName;
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
    case 'date-icon':
      return <DateIcon width={width} height={height} color={color} />;
    case 'home-icon':
      return <HomeIcon width={width} height={height} color={color} />;
    case 'setting-icon':
      return <SettingIcon width={width} height={height} color={color} />;
    case 'statistic-icon':
      return <StatisticIcon width={width} height={height} color={color} />;
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
  }
}
