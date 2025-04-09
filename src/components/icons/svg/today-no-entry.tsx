import { SvgXml } from 'react-native-svg';

export const TodayNoEntry = ({ width = 24, height = 25, color = '#ffffff' }: IconProps) => {
  const svg = `
<svg width="11" height="11" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.99844 0.900391V12.1004M1.39844 6.50039H12.5984" stroke="#31B28E" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
  return <SvgXml xml={svg} width={width} height={height} color={color} />;
};

export default TodayNoEntry;
