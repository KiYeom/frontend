import { SvgXml } from 'react-native-svg';

export const Clover = ({ width = 65.31, height = 65.31, color = '#A0A8B0' }: IconProps) => {
  const svg = `
<svg width=${width} height=${height} viewBox="0 0 66 66" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M42 9C42 16.1797 36.1797 30 29 30C21.8203 30 16 16.1797 16 9C16 1.8203 21.8203 0 29 0C36.1797 0 42 1.8203 42 9Z" fill=${color}/>
<path d="M9 17C16.1797 17 30 22.8203 30 30C30 37.1797 16.1797 43 9 43C1.8203 43 0 37.1797 0 30C0 22.8203 1.8203 17 9 17Z" fill=${color}/>
<path d="M16 51C16 43.8203 21.8203 30 29 30C36.1797 30 42 43.8203 42 51C42 58.1797 36.1797 60 29 60C21.8203 60 16 58.1797 16 51Z" fill=${color}/>
<path d="M51 43C43.8203 43 30 37.1797 30 30C30 22.8203 43.8203 17 51 17C58.1797 17 60 22.8203 60 30C60 37.1797 58.1797 43 51 43Z" fill=${color}/>
<path d="M36.8891 36.8892L58.6534 51.9174L51.9173 58.6535L36.8891 36.8892Z" fill=${color}/>
</svg>
`;
  return <SvgXml xml={svg} width={width} height={height} color={color} />;
};

export default Clover;
