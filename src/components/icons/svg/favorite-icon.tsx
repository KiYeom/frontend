import { SvgXml } from 'react-native-svg';
import { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
type FavoriteIconProps = IconProps & {
  toggleable?: boolean;
  isSaved?: boolean;
  messageId?: string;
  onFavoritePress?: (msg: string) => void;
  iconType?: string;
};

export const FavoriteIcon = ({
  width = 16,
  height = 16,
  color = '#6e7781',
  toggleable = false,
  isSaved = true, // default
  messageId,
  onFavoritePress,
  iconType = 'favorite-icon',
}: FavoriteIconProps) => {
  const [isFilled, setIsFilled] = useState(isSaved);
  useEffect(() => {
    setIsFilled(isSaved);
  }, [isSaved]);
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
  let svg = ``;
  if (iconType === 'favorite-icon') {
    svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.22139 3.35591L7.5 3.90434L7.77861 3.35591C8.28408 2.36093 9.28452 1.6875 10.435 1.6875C12.0843 1.6875 13.4375 3.06804 13.4375 4.80062C13.4375 6.57574 12.541 8.10784 10.9329 9.61849L10.9329 9.61854C10.1785 10.3275 9.27955 11.013 8.56498 11.5235C8.20856 11.7781 7.8998 11.9879 7.68039 12.134C7.6102 12.1807 7.54919 12.2208 7.49872 12.2538C7.44606 12.2199 7.38201 12.1783 7.30816 12.1298C7.08338 11.9821 6.76825 11.7703 6.40772 11.5144C5.68437 11.0011 4.78759 10.3171 4.07068 9.62191C2.62613 8.22105 1.5625 6.56499 1.5625 4.80062C1.5625 3.07332 2.91607 1.6875 4.565 1.6875C5.71548 1.6875 6.71592 2.36093 7.22139 3.35591Z" fill="${fillValue}" stroke="#FF6F61" stroke-width="0.625"/>
    <path d="M10.435 1.375C9.1575 1.375 8.05438 2.12312 7.5 3.21437C6.94562 2.12312 5.8425 1.375 4.565 1.375C2.73375 1.375 1.25 2.91063 1.25 4.80062C1.25 6.69062 2.38562 8.42313 3.85312 9.84625C5.32063 11.2694 7.5 12.625 7.5 12.625C7.5 12.625 9.60875 11.2919 11.1469 9.84625C12.7875 8.305 13.75 6.69625 13.75 4.80062C13.75 2.905 12.2662 1.375 10.435 1.375Z" stroke="#FF6F61" stroke-width="0.9375" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `;
  } else if (iconType === 'favorite-bookmark-icon') {
    svg = `
      <svg width="${width}" height="${height}" viewBox="0 0 14 17" fill="${fillValue}" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.19696 14.5404L7 14.456L6.80304 14.5404L2.60443 16.3398C2.60423 16.3399 2.60404 16.34 2.60384 16.3401C2.08871 16.5588 1.63151 16.5182 1.17315 16.2192C0.714907 15.9203 0.5 15.5237 0.5 14.975V2C0.5 1.58381 0.642455 1.24014 0.941252 0.941854C1.24047 0.64315 1.5846 0.500568 2.00033 0.5H12C12.4162 0.5 12.7604 0.642483 13.0594 0.941553C13.3585 1.24061 13.5005 1.58424 13.5 1.99939V2V14.975C13.5 15.5228 13.2852 15.9197 12.8265 16.2194C12.3683 16.5188 11.9113 16.5594 11.3964 16.3402C11.3962 16.3401 11.3961 16.3401 11.396 16.34L7.19696 14.5404Z" stroke="#FF6F61"/>
      </svg>
    `;
  }
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
