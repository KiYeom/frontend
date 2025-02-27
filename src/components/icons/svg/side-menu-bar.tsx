import { SvgXml } from 'react-native-svg';

export const SideMenuBar = ({ width = 24, height = 24, color = '#000000' }: IconProps) => {
  const svg = `
    <svg width=${width} height=${height} viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 11H15M1 6H15M1 1H15" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  return <SvgXml xml={svg} width={width} height={height} color={color} />;
};
export default SideMenuBar;
