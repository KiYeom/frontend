import { SvgXml } from 'react-native-svg';

export const CallStart = ({ width = 12, height = 16, color = '#31B28E', disabled }: IconProps) => {
  const finalColor = disabled ? '#B3B3B3' : color;
  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path
    d="M0.734807 0.717994L0.355971 2.13183C-0.90025 7.06599 3.89343 14.3789 8.11847 15.5769L9.53231 15.9557C9.90113 16.0545 10.2908 15.8295 10.4286 15.4382L11.1473 12.633C11.2462 12.2642 10.9987 11.8355 10.6298 11.7367L7.57276 10.8517L5.59729 12.2001C4.61375 11.9365 1.73375 6.94821 1.99729 5.96468L4.2082 4.84409L4.93735 1.877C5.03617 1.50818 4.78867 1.07949 4.41984 0.980666L1.63114 0.200493C1.20085 0.0851949 0.811133 0.310195 0.734807 0.717994Z"
    fill="${finalColor}"
  />
</svg>
`;
  return <SvgXml xml={svg} width={width} height={height} />;
};

export default CallStart;
