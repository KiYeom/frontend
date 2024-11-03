import { SvgXml } from 'react-native-svg';

export const EmptyIcon = ({ width = 40, height = 40, color = '#6e7781' }: IconProps) => {
  const svg = `
<svg width=${width} height=${height} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="40" height="40" rx="20" fill="#C5C5C5"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M16.828 13C15.3796 13 14.1477 13.5213 13.2841 14.4688C12.4284 15.4072 12 16.6924 12 18.1147C12 20.5854 13.258 22.554 14.856 24.0851C16.4472 25.6095 18.4487 26.7689 20.1056 27.6359C20.2267 27.6994 20.3613 27.7328 20.498 27.7332C20.6348 27.7335 20.7696 27.701 20.891 27.6381C22.5491 26.7802 24.5494 25.6117 26.1417 24.0795C27.7397 22.5438 29 20.5684 29 18.1147C29 16.6867 28.5693 15.4027 27.7125 14.4643C26.8467 13.5179 25.6159 13 24.172 13C22.9525 13 21.9439 13.4511 21.1766 14.3033C20.9144 14.5987 20.6873 14.9235 20.5 15.2712C20.3127 14.9235 20.0857 14.5987 19.8234 14.3033C19.0561 13.4511 18.0475 13 16.828 13Z" fill="white"/>
</svg>


`;
  return <SvgXml xml={svg} width={width} height={height} color={color} />;
};

export default EmptyIcon;
