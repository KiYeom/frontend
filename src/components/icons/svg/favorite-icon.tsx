import { SvgXml } from 'react-native-svg';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
type FavoriteIconProps = IconProps & {
  toggleable?: boolean;
  isSaved?: boolean;
  messageId?: string;
  onFavoritePress?: (msg: string) => void;
};

export const FavoriteIcon = ({
  width = 16,
  height = 16,
  color = '#6e7781',
  toggleable = false,
  isSaved = true, // default
  messageId,
  onFavoritePress,
}: FavoriteIconProps) => {
  const [isFilled, setIsFilled] = useState(isSaved);
  const handlePress = () => {
    if (toggleable) {
      setIsFilled((prev) => !prev);
      if (onFavoritePress && messageId) {
        //console.log('messageId', messageId);
        onFavoritePress(messageId);
      }
    }
  };
  const fillValue = isFilled ? '#FF6F61' : 'none';
  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.22139 3.35591L7.5 3.90434L7.77861 3.35591C8.28408 2.36093 9.28452 1.6875 10.435 1.6875C12.0843 1.6875 13.4375 3.06804 13.4375 4.80062C13.4375 6.57574 12.541 8.10784 10.9329 9.61849L10.9329 9.61854C10.1785 10.3275 9.27955 11.013 8.56498 11.5235C8.20856 11.7781 7.8998 11.9879 7.68039 12.134C7.6102 12.1807 7.54919 12.2208 7.49872 12.2538C7.44606 12.2199 7.38201 12.1783 7.30816 12.1298C7.08338 11.9821 6.76825 11.7703 6.40772 11.5144C5.68437 11.0011 4.78759 10.3171 4.07068 9.62191C2.62613 8.22105 1.5625 6.56499 1.5625 4.80062C1.5625 3.07332 2.91607 1.6875 4.565 1.6875C5.71548 1.6875 6.71592 2.36093 7.22139 3.35591Z" fill="${fillValue}" stroke="#FF6F61" stroke-width="0.625"/>
<path d="M10.435 1.375C9.1575 1.375 8.05438 2.12312 7.5 3.21437C6.94562 2.12312 5.8425 1.375 4.565 1.375C2.73375 1.375 1.25 2.91063 1.25 4.80062C1.25 6.69062 2.38562 8.42313 3.85312 9.84625C5.32063 11.2694 7.5 12.625 7.5 12.625C7.5 12.625 9.60875 11.2919 11.1469 9.84625C12.7875 8.305 13.75 6.69625 13.75 4.80062C13.75 2.905 12.2662 1.375 10.435 1.375Z" stroke="#FF6F61" stroke-width="0.9375" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
  if (toggleable) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <SvgXml xml={svg} width={width} height={height} color={color} key={isFilled.toString()} />
      </TouchableOpacity>
    );
  } else {
    return <SvgXml xml={svg} width={width} height={height} color={color} />;
  }
};

export default FavoriteIcon;
