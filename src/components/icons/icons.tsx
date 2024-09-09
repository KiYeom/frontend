import ArrowDown from './svg/arrow-down';
import ArrowLeft from './svg/arrow-left';
import Airplane from './svg/airplane';
import DateIcon from './svg/date-icon';
import ArrowRight from './svg/arrow-right';
import CookieProfile from './svg/cookie-profile';
import StatisticIcon from './svg/statistic-icon';
import HomeIcon from './svg/home-icon';
import SettingIcon from './svg/setting-icon';
import CloverIcon from './svg/clover';
import HappyEmotion from './svg/happy-emotion';
import AngryEmotion from './svg/angry-emotion';
import SadEmotion from './svg/sad-emotion';
import RelaxEmotion from './svg/relax-emotion';
import CheckIcon from './svg/check-icon';
import CancelIcon from './svg/cancel-icon';

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
  | 'relax-emotion'
  | 'check-icon'
  | 'cancel-icon';

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
    case 'relax-emotion':
      return <RelaxEmotion width={width} height={height} color={color} />;
    case 'check-icon':
      return <CheckIcon width={width} height={height} color={color} />;
    case 'cancel-icon':
      return <CancelIcon width={width} height={height} color={color} />;
  }
}
