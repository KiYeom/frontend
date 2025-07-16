import { SvgXml } from 'react-native-svg';

export const Mic = ({ width = 25, height = 25, color = '#6e7781' }: IconProps) => {
  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_519_30338)">
<g clip-path="url(#clip1_519_30338)">
<path d="M10.8346 4.33333C10.8346 3.04467 9.78997 2 8.5013 2C7.21264 2 6.16797 3.04467 6.16797 4.33333V8.66667C6.16797 9.95533 7.21264 11 8.5013 11C9.78997 11 10.8346 9.95533 10.8346 8.66667V4.33333Z" fill="white"/>
<path d="M3.5 8.33594C3.5 11.0974 5.73857 13.3359 8.5 13.3359C11.2614 13.3359 13.5 11.0974 13.5 8.33594" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.5 13.3359V15.3359" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
</g>
<defs>
<clipPath id="clip0_519_30338">
<rect width="16" height="16" fill="white" transform="translate(0.5 0.667969)"/>
</clipPath>
<clipPath id="clip1_519_30338">
<rect width="16" height="16" fill="white" transform="translate(0.5 0.667969)"/>
</clipPath>
</defs>
</svg>

`;
  return <SvgXml xml={svg} width={width} height={height} color={color} />;
};

export default Mic;
