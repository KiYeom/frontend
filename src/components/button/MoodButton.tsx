import React from 'react';
import { MoodButtonContainer, MoodButtonLabel } from './MoodButton.style';
export type MoodButtonProps = {
  title: string;
  key?: number;
  primary?: boolean;
  onPress?: () => void;
};
const MoodButton = (props: MoodButtonProps) => {
  const { title, primary, onPress } = props;
  return (
    <MoodButtonContainer primary={primary} onPress={onPress}>
      <MoodButtonLabel primary={primary}>{title}</MoodButtonLabel>
    </MoodButtonContainer>
  );
};
export default MoodButton;
