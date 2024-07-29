import { Svg, SvgXml } from 'react-native-svg';

export const arrowLeft = ({ width = 20, height = 20, color = '#A0A8B0' }: IconProps) => {
  const svg = `
<svg width=${width} height=${height} viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 1L1 10L10 19" stroke=${color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

`;
  return <SvgXml xml={svg} width={width} height={height} color={color} />;
};

export default arrowLeft;
