import { SvgXml } from 'react-native-svg';

export const ArrowUp = ({ width = 20, height = 20, color = '#A0A8B0' }: IconProps) => {
  const svg = `
<svg width=${width} height=${height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M3.33301 10.667L7.99967 6.00033L12.6663 10.667" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
  return <SvgXml xml={svg} width={width} height={height} color={color} />;
};

export default ArrowUp;
