import ArrowDown from './svg/arrow-down';
import ArrowLeft from './svg/arrow-left';
import Airplane from './svg/airplane';
import ArrowRight from './svg/arrow-right';

export type TIconName = 'arrow-left' | 'arrow-down' | 'airplane' | 'arrow-right';

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
    case 'arrow-left':
      return <ArrowLeft width={width} height={height} color={color} />;
    case 'arrow-right':
      return <ArrowRight width={width} height={height} color={color} />;
    case 'arrow-down':
      return <ArrowDown width={width} height={height} color={color} />;
    case 'airplane':
      return <Airplane width={width} height={height} color={color} />;
  }
}
