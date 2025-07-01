import { SvgXml } from 'react-native-svg';

export const CallResume = ({ width = 13, height = 15, color = '#484848', disabled }: IconProps) => {
  const finalColor = disabled ? '#B3B3B3' : color;
  const svg = `
<svg width="${width}" height=${height}" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.66428 0.986065C1.5861 0.939711 1.49704 0.914876 1.40616 0.914082C1.31527 0.913288 1.2258 0.936565 1.14682 0.981546C1.06784 1.02653 1.00217 1.09161 0.95649 1.17018C0.910807 1.24876 0.886735 1.33803 0.886719 1.42892V13.3533C0.886735 13.4442 0.910807 13.5334 0.95649 13.612C1.00217 13.6906 1.06784 13.7556 1.14682 13.8006C1.2258 13.8456 1.31527 13.8689 1.40616 13.8681C1.49704 13.8673 1.5861 13.8425 1.66428 13.7961L11.7254 7.83394C11.8022 7.78834 11.8659 7.72354 11.9101 7.6459C11.9543 7.56825 11.9776 7.48044 11.9776 7.39109C11.9776 7.30174 11.9543 7.21393 11.9101 7.13628C11.8659 7.05864 11.8022 6.99383 11.7254 6.94824L1.66428 0.986065Z" fill="${finalColor}" stroke="${finalColor}" stroke-width="1.28736" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

`;
  return <SvgXml xml={svg} width={width} height={height} color={color} />;
};

export default CallResume;
