import React from 'react';
import './switch-row.styles';
import {
  SwitchRowContainer,
  SwitchRowDesc,
  SwitchRowTextContainner,
  SwitchRowTitle,
} from './switch-row.styles';
import { View } from 'react-native-ui-lib';
import SwitchComponent from '../switch/switch';

export type SwitchRowProps = {
  title: string;
  desc: string;
  disabled?: boolean;
  isEnabled: boolean;
  onPress?: () => void;
};

const SwitchRow = (props: SwitchRowProps) => {
  const { title, desc, disabled = false, isEnabled, onPress = () => {} } = props;

  return (
    <SwitchRowContainer>
      <SwitchRowTextContainner>
        <SwitchRowTitle>{title}</SwitchRowTitle>
        <SwitchRowDesc>{desc}</SwitchRowDesc>
      </SwitchRowTextContainner>

      <View>
        <SwitchComponent isEnabled={isEnabled} disabled={disabled} onPress={onPress} />
      </View>
    </SwitchRowContainer>
  );
};

export default SwitchRow;
