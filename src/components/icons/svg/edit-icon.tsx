import { SvgXml } from 'react-native-svg';

export const EditIcon = ({ width = 24, height = 24, color = '#6e7781' }: IconProps) => {
  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_5284_58154)">
<path d="M18.6766 5.83277L21.1672 8.32338M20.2778 3.63863L13.5401 10.3763C13.1909 10.7232 12.9533 11.1665 12.8577 11.6493L12.2354 14.7646L15.3507 14.1411C15.833 14.0446 16.2754 13.8081 16.6236 13.4599L23.3613 6.72219C23.5638 6.51972 23.7244 6.27935 23.834 6.01481C23.9436 5.75027 24 5.46674 24 5.18041C24 4.89407 23.9436 4.61054 23.834 4.346C23.7244 4.08146 23.5638 3.8411 23.3613 3.63863C23.1589 3.43616 22.9185 3.27555 22.654 3.16597C22.3894 3.0564 22.1059 3 21.8196 3C21.5332 3 21.2497 3.0564 20.9852 3.16597C20.7206 3.27555 20.4803 3.43616 20.2778 3.63863Z" stroke="#2A2A2A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M21.6472 17.1179V20.6473C21.6472 21.2713 21.3993 21.8698 20.9581 22.3111C20.5168 22.7524 19.9183 23.0003 19.2943 23.0003H6.35297C5.72892 23.0003 5.13043 22.7524 4.68917 22.3111C4.2479 21.8698 4 21.2713 4 20.6473V7.70599C4 7.08195 4.2479 6.48346 4.68917 6.04219C5.13043 5.60093 5.72892 5.35303 6.35297 5.35303H9.88241" stroke="#2A2A2A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_5284_58154">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>

`;
  return <SvgXml xml={svg} width={width} height={height} color={color} />;
};

export default EditIcon;
