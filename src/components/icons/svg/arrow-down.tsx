import { Svg, SvgXml } from 'react-native-svg';

export const arrowDown = ({ width = 20, height = 20, color = '#A0A8B0' }: IconProps) => {
  const svg = `
<svg width=${width} height=${height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.33301 5.33301L7.99967 9.99967L12.6663 5.33301" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>


`;
  return <SvgXml xml={svg} width={width} height={height} color={color} />;
};

export default arrowDown;
