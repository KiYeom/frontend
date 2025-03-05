import React from 'react';
import { Hint } from 'react-native-ui-lib';
import { View, TouchableOpacity } from 'react-native';
import css from '@emotion/native';
import { rsFont } from '../../utils/responsive-size';
import palette from '../../assets/styles/theme';
import Icon from '../../components/icons/icons';

interface HintComponentProps {
  visible: boolean | undefined;
  onClose: () => void;
  onToggle: () => void;
  message: string;
}
const HintComponent: React.FC<HintComponentProps> = ({ visible, onClose, onToggle, message }) => {
  return (
    <Hint
      visible={visible}
      position={Hint.positions.BOTTOM}
      message={message}
      color={'white'}
      enableShadow
      messageStyle={{
        fontFamily: 'Kyobo-handwriting',
        fontSize: 16 * rsFont,
        color: palette.neutral[900],
      }}
      onPress={onClose}
      onBackgroundPress={onClose}
      backdropColor={'rgba(0, 0, 0, 0.5)'}>
      <View>
        <TouchableOpacity
          activeOpacity={1}
          style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 4 }}
          onPress={onToggle}>
          <Icon name="information" width={14} height={14} />
        </TouchableOpacity>
      </View>
    </Hint>
  );
};
export default HintComponent;
