import { SvgXml } from 'react-native-svg';

export const CallPause = ({ width = 13, height = 15, color = '#484848', disabled }: IconProps) => {
  const finalColor = disabled ? '#B3B3B3' : color;
  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.66406 14.5V0.5H12.6641V14.5H8.66406ZM0.664062 14.5V0.5H4.66406V14.5H0.664062Z" fill="${finalColor}"/>
</svg>
`;
  return <SvgXml xml={svg} width={width} height={height} />;
};

export default CallPause;
