import { SvgXml } from 'react-native-svg';

export const ArrowRight = ({ width = 20, height = 20, color = '#A0A8B0' }: IconProps) => {
  const svg = `
<svg width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 19L10 10L1 1" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
  return <SvgXml xml={svg} width={width} height={height} color={color} />;
};

export default ArrowRight;
