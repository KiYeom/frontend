import { SvgXml } from 'react-native-svg';

export const DefaultHeart = ({ width = 16, height = 16, color = '#6e7781' }: IconProps) => {
  const svg = `
<svg width=${width} height=${height} viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="250" cy="250" r="250" fill=${color}/>
  <path d="M168.594 264.879L239.18 330.777C242.109 333.511 245.977 335.035 250 335.035C254.023 335.035 257.891 333.511 260.82 330.777L331.406 264.879C343.281 253.824 350 238.316 350 222.105V219.84C350 192.535 330.273 169.254 303.359 164.761C285.547 161.793 267.422 167.613 254.688 180.347L250 185.035L245.312 180.347C232.578 167.613 214.453 161.793 196.641 164.761C169.727 169.254 150 192.535 150 219.84V222.105C150 238.316 156.719 253.824 168.594 264.879Z" fill="white"/>
</svg>
`;
  return <SvgXml xml={svg} width={width} height={height} color={color} />;
};

export default DefaultHeart;
