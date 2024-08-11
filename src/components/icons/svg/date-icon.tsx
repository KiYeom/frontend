import { SvgXml } from 'react-native-svg';

export const DateIcon = ({ width = 20, height = 20, color = '#A0A8B0' }: IconProps) => {
  const svg = `
<svg width=${width} height=${height} viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.75 1.25C4.75 0.834375 4.41563 0.5 4 0.5C3.58437 0.5 3.25 0.834375 3.25 1.25V2.5H2C0.896875 2.5 0 3.39687 0 4.5V5V6.5V14.5C0 15.6031 0.896875 16.5 2 16.5H12C13.1031 16.5 14 15.6031 14 14.5V6.5V5V4.5C14 3.39687 13.1031 2.5 12 2.5H10.75V1.25C10.75 0.834375 10.4156 0.5 10 0.5C9.58438 0.5 9.25 0.834375 9.25 1.25V2.5H4.75V1.25ZM1.5 6.5H12.5V14.5C12.5 14.775 12.275 15 12 15H2C1.725 15 1.5 14.775 1.5 14.5V6.5Z" fill="black"/>
</svg>



`;
  return <SvgXml xml={svg} width={width} height={height} color={color} />;
};

export default DateIcon;
