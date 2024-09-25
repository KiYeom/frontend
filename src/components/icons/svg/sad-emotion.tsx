import { SvgXml } from 'react-native-svg';

export const SadEmotion = ({ width = 50, height = 50, color = '#FCF18F' }: IconProps) => {
  const svg = `
<svg width=${width} height=${height} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.2002 18.8999H21.3002" stroke="black"/>
<circle cx="15" cy="15" r="15" fill="#FCF18F"/>
<circle cx="15" cy="15" r="15" fill="#FCF18F"/>
<path d="M9.59961 20.3999C12.2996 16.2632 18.2396 16.539 20.3996 20.3999" stroke="black" stroke-width="2" stroke-linecap="round"/>
<circle cx="10.8" cy="12" r="1.8" fill="#2A2A2A"/>
<circle cx="19.8" cy="12" r="1.8" fill="#2A2A2A"/>
</svg>

`;
  return <SvgXml xml={svg} width={width} height={height} color={color} />;
};

export default SadEmotion;
