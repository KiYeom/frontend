import { SvgXml } from 'react-native-svg';

export const CallEnd = ({ width = 19, height = 7, color = '#F44336', disabled }: IconProps) => {
  const finalColor = disabled ? '#B3B3B3' : color;
  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 19 7" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.7975 3.51909L16.7625 2.48409C13.1175 -1.07091 4.3875 -0.575912 1.2375 2.48409L0.2025 3.51909C-0.0675 3.78909 -0.0675 4.23909 0.2025 4.55409L2.2725 6.57909C2.5425 6.84909 3.0375 6.84909 3.3075 6.57909L5.6025 4.37409L5.4225 1.98909C6.1425 1.26909 11.9025 1.26909 12.6225 1.98909L12.4875 4.46409L14.6925 6.57909C14.9625 6.84909 15.4575 6.84909 15.7275 6.57909L17.7975 4.55409C18.1125 4.23909 18.1125 3.78909 17.7975 3.51909Z" fill="${finalColor}"/>
</svg>

`;
  return <SvgXml xml={svg} width={width} height={height} color={color} />;
};

export default CallEnd;
