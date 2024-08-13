import { SvgXml } from 'react-native-svg';

export const StatisticIcon = ({ width = 16, height = 16, color = '#6E7781' }: IconProps) => {
  const svg = `
<svg width=${width} height=${height} viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.125 3.02039V16.875V17.2892L12.4179 17.5821L21.5054 26.6696C19.3958 28.1408 16.8305 29 14.0625 29C6.85084 29 1 23.1545 1 15.9375C1 9.38458 5.83236 3.9512 12.125 3.02039ZM16.9375 13.0625V1.00016C23.5837 1.03371 28.9663 6.41631 28.9998 13.0625H16.9375ZM30.7353 17.875C30.2973 20.8182 28.8796 23.4388 26.8183 25.3982L19.2903 17.875H30.7353Z" stroke=${color} stroke-width="2"/>
</svg>
`;
  return <SvgXml xml={svg} width={width} height={height} color={color} />;
};

export default StatisticIcon;
