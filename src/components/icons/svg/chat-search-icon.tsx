import { SvgXml } from 'react-native-svg';

export const ChatSearch = ({ width = 24, height = 24, color = '#6e7781' }: IconProps) => {
  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.75 14.625C11.547 14.625 14.625 11.547 14.625 7.75C14.625 3.95304 11.547 0.875 7.75 0.875C3.95304 0.875 0.875 3.95304 0.875 7.75C0.875 11.547 3.95304 14.625 7.75 14.625Z" stroke="${color}" stroke-width="1.5"/>
<path d="M12.75 12.75L17.75 17.75" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
  return <SvgXml xml={svg} width={width} height={height} color={color} />;
};

export default ChatSearch;
