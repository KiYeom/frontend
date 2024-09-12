import { SvgXml } from 'react-native-svg';

export const CalmEmotion = ({ width = 50, height = 50, color = '#9DDFCC' }: IconProps) => {
  const svg = `
<svg width=${width} height=${height} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.2002 18.8999H21.3002" stroke="black"/>
<circle cx="15" cy="15" r="15" fill="#9DDFCC"/>
<path d="M9 18C12 22.5 18.6 22.2 21 18" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M7.2002 13.2L12.3002 11.1" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M22.7998 13.2L17.3998 11.4" stroke="black" stroke-width="2" stroke-linecap="round"/>
</svg>
`;
  return <SvgXml xml={svg} width={width} height={height} color={color} />;
};

export default CalmEmotion;
