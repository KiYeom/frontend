import { SvgXml } from 'react-native-svg';

export const Search = ({ width = 24, height = 24, color = '#6e7781' }: IconProps) => {
  const svg = `
<svg width=${width} height=${height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.5398 13.2808C3.0838 13.2808 0.299805 10.4968 0.299805 7.04078C0.299805 3.58478 3.0838 0.800781 6.5398 0.800781C9.9958 0.800781 12.7798 3.58478 12.7798 7.04078C12.7798 10.4968 9.9958 13.2808 6.5398 13.2808ZM6.5398 1.76078C3.6118 1.76078 1.2598 4.11278 1.2598 7.04078C1.2598 9.96878 3.6118 12.3208 6.5398 12.3208C9.4678 12.3208 11.8198 9.96878 11.8198 7.04078C11.8198 4.11278 9.4678 1.76078 6.5398 1.76078Z" fill="white"/>
<path d="M11.1875 11.0078L15.4979 15.3182L14.8192 15.9969L10.5088 11.6865L11.1875 11.0078Z" fill="white"/>
</svg>
`;
  return <SvgXml xml={svg} width={width} height={height} color={color} />;
};

export default Search;
