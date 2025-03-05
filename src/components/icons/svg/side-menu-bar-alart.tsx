import { SvgXml } from 'react-native-svg';

export const SideMenuBarAlert = ({ width = 24, height = 22, color = '#000000' }: IconProps) => {
  const svg = `
<svg width=${width} height=${height} viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 21H19M1 14.5H19M1 8H19" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="16.5" cy="6.5" r="6.75" fill="#F55E5E" stroke="white" stroke-width="0.5"/>
<path d="M16.6051 11.0851C16.4007 11.0851 16.2185 11.0121 16.0578 10.8662C15.912 10.7203 15.8389 10.5524 15.8389 10.3627V3.99216C15.8389 3.72946 15.7369 3.6492 15.5324 3.75135L14.9851 3.99216C14.8976 4.02136 14.81 4.03594 14.7224 4.03594C14.5035 4.03594 14.3284 3.97027 14.197 3.83892C14.0657 3.69299 14 3.51054 14 3.29162C14 2.98513 14.1532 2.77353 14.4597 2.65676L16.0359 2.08757C16.1966 2.02919 16.3424 2 16.4738 2C16.7509 2 16.9698 2.08757 17.1305 2.2627C17.3057 2.42326 17.3932 2.63486 17.3932 2.89757L17.3713 10.4065C17.3713 10.6108 17.2982 10.7713 17.1524 10.8881C17.0066 11.0194 16.8241 11.0851 16.6051 11.0851Z" fill="white"/>
</svg>

  `;
  return <SvgXml xml={svg} width={width} height={height} color={color} />;
};
export default SideMenuBarAlert;
