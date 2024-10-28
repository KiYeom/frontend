import { SvgXml } from 'react-native-svg';

export const CheckIcon = ({ width = 40, height = 29, color = '#ffffff' }: IconProps) => {
  const svg = `
  <svg width=${width} height=${height} viewBox="0 0 40 29" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M39.163 0.908188C40.279 2.02414 40.279 3.83643 39.163 4.95238L16.3084 27.807C15.1925 28.9229 13.3802 28.9229 12.2643 27.807L0.83696 16.3797C-0.278987 15.2637 -0.278987 13.4514 0.83696 12.3355C1.95291 11.2195 3.7652 11.2195 4.88115 12.3355L14.2908 21.7362L35.1278 0.908188C36.2437 -0.207759 38.056 -0.207759 39.172 0.908188H39.163Z" fill="white"/>
  </svg>
`;
  return <SvgXml xml={svg} width={width} height={height} color={color} />;
};

export default CheckIcon;
