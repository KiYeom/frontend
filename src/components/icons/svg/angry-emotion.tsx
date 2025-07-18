import { SvgXml } from 'react-native-svg';

export const AngryEmotion = ({ width = 50, height = 50, color = '#F49B9B' }: IconProps) => {
  const svg = `
<svg width=${width} height=${height} viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_5222_52121)">
<rect y="0.5" width="28" height="28" rx="14" fill="#F49B9B"/>
<g clip-path="url(#clip1_5222_52121)">
<path d="M24.6606 16.344C24.6606 21.6128 19.958 23.76 14.1126 23.76C8.26729 23.76 4.75262 22.248 4.53662 16.344C4.53662 11.0752 8.95129 6.01196 14.7966 6.01196C20.642 6.01196 24.6606 11.0752 24.6606 16.344Z" fill="#F8E9D3"/>
<circle cx="13.3041" cy="15.6121" r="3" fill="#76675C" fill-opacity="0.5"/>
<path d="M9.104 16.332H10.784" stroke="#424242" stroke-width="0.72" stroke-linecap="round"/>
<path d="M15.5839 16.332H17.2639" stroke="#424242" stroke-width="0.72" stroke-linecap="round"/>
<path d="M14.6166 18.1799C14.6166 18.657 14.6166 19.3319 13.0686 19.5119C12.2137 19.5119 11.7006 19.0439 11.5206 18.3599C11.5206 17.8828 12.2137 17.3159 13.0686 17.3159C13.9236 17.3159 14.6166 17.7028 14.6166 18.1799Z" fill="#424242"/>
<path d="M22.2485 17.424C21.2199 16.1645 20.5917 14.7068 19.7645 10.404L23.3285 7.88403C26.6778 10.355 29.0117 12.9588 29.1246 14.292L22.2485 17.424Z" fill="#AD805D"/>
<path d="M21.9606 11.9879C23.2331 11.9879 24.2646 10.9725 24.2646 9.7199C24.2646 8.46732 23.2331 7.4519 21.9606 7.4519C20.6881 7.4519 19.6566 8.46732 19.6566 9.7199C19.6566 10.9725 20.6881 11.9879 21.9606 11.9879Z" fill="#AD805D"/>
<path d="M25.3447 18.9721C27.492 18.9721 29.2328 17.2959 29.2328 15.2281C29.2328 13.1604 27.492 11.4841 25.3447 11.4841C23.1974 11.4841 21.4567 13.1604 21.4567 15.2281C21.4567 17.2959 23.1974 18.9721 25.3447 18.9721Z" fill="#AD805D"/>
<path d="M-0.107484 15.876C0.84166 12.3903 7.18806 6.72233 8.96453 7.884C5.90453 10.368 5.40053 13.464 5.40053 14.868C5.40053 14.868 3.88853 17.316 5.40053 20.34C5.00991 20.8839 -1.05662 19.3617 -0.107484 15.876Z" fill="#AD805D" stroke="#AD805D" stroke-width="0.072"/>
<path d="M15.9194 14.5604C16.2638 14.3615 16.4463 14.0329 16.327 13.8262C16.2077 13.6196 15.8318 13.6133 15.4874 13.8121C15.1431 14.0109 14.9606 14.3396 15.0799 14.5462C15.1992 14.7529 15.5751 14.7592 15.9194 14.5604Z" fill="#BEA48B"/>
<path d="M10.2075 14.5602C10.5519 14.759 10.9278 14.7526 11.0471 14.546C11.1664 14.3394 10.9839 14.0107 10.6395 13.8119C10.2951 13.6131 9.9193 13.6194 9.79999 13.826C9.6807 14.0326 9.86314 14.3613 10.2075 14.5602Z" fill="#BEA48B"/>
<path d="M13.0686 20.4134V18.7559" stroke="#424242" stroke-width="0.3744"/>
<path d="M11.2639 21.0119C11.2639 21.0119 12.3229 20.4119 13.0639 20.4119C13.8049 20.4119 14.8639 21.0119 14.8639 21.0119" stroke="#424242" stroke-width="0.372" stroke-linecap="round"/>
</g>
</g>
<defs>
<clipPath id="clip0_5222_52121">
<rect y="0.5" width="28" height="28" rx="14" fill="white"/>
</clipPath>
<clipPath id="clip1_5222_52121">
<rect width="29.952" height="17.856" fill="white" transform="translate(-0.495972 6.01196)"/>
</clipPath>
</defs>
</svg>


`;
  return <SvgXml xml={svg} width={width} height={height} color={color} />;
};

export default AngryEmotion;

/*
<svg width=${width} height=${height} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="25" cy="25" r="25" fill="#F49B9B"/>
<path d="M20 22L12 18" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M38 19L29 22" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M16 34.003C22.5 28 26.5 28.0004 33 34.003" stroke="black" stroke-width="2" stroke-linecap="round"/>
</svg>

*/
