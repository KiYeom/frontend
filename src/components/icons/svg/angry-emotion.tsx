import { SvgXml } from 'react-native-svg';

export const AngryEmotion = ({ width = 50, height = 50, color = '#F49B9B' }: IconProps) => {
  const svg = `
<svg width=${width} height=${height} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="25" cy="25" r="25" fill="#F49B9B"/>
<path d="M20 22L12 18" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M38 19L29 22" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M16 34.003C22.5 28 26.5 28.0004 33 34.003" stroke="black" stroke-width="2" stroke-linecap="round"/>
</svg>

`;
  return <SvgXml xml={svg} width={width} height={height} color={color} />;
};

export default AngryEmotion;
