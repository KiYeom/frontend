import { SvgXml } from 'react-native-svg';

export const HappyEmotion = ({ width = 50, height = 50, color = '#3AD3EB' }: IconProps) => {
  const svg = `
<svg width=${width} height=${height} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 31.5H35.5" stroke="black"/>
<circle cx="25" cy="25" r="25" fill="#3AD3EB"/>
<path d="M15 31C20 38.5 31 38 35 31" stroke="black" stroke-width="2" stroke-linecap="round"/>
<circle cx="18" cy="20" r="3" fill="#2A2A2A"/>
<circle cx="33" cy="20" r="3" fill="#2A2A2A"/>
</svg>

`;
  return <SvgXml xml={svg} width={width} height={height} color={color} />;
};

export default HappyEmotion;
