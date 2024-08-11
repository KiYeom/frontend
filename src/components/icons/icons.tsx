import ArrowDown from './svg/arrow-down';
import ArrowLeft from './svg/arrow-left';
import Airplane from './svg/airplane';
import DateIcon from './svg/date-icon';
import ArrowRight from './svg/arrow-right';
import CookieProfile from './svg/cookie-profile';
import StatisticIcon from './svg/statistic-icon';
import HomeIcon from './svg/home-icon';
import SettingIcon from './svg/setting-icon';

export type TIconName =
  | 'airplane'
  | 'arrow-down'
  | 'arrow-left'
  | 'arrow-right'
  | 'date-icon'
  | 'home-icon'
  | 'setting-icon'
  | 'statistic-icon';

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
  }
}
