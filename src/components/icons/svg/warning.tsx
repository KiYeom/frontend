import { SvgXml } from 'react-native-svg';

export const Warning = ({ width = 16, height = 16, color = '#6e7781' }: IconProps) => {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width=${width} height=${height} fill=${color} viewBox="0 0 512 512">
<path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24l0 112c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-112c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/>
</svg>
`;
  return <SvgXml xml={svg} width={width} height={height} color={color} />;
};

export default Warning;
