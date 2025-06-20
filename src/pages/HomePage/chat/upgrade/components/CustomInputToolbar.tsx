//// 커스텀 입력창
import React from 'react';
import { InputToolbar as GiftedInputToolbar, InputToolbarProps } from 'react-native-gifted-chat';

const InputToolbar = (props: InputToolbarProps) => (
  <GiftedInputToolbar
    {...props}
    containerStyle={styles.inputToolbarContainer}
    primaryStyle={styles.inputToolbarPrimary}
  />
);

const styles = {
  inputToolbarContainer: {
    borderTopWidth: 0,
    paddingVertical: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  inputToolbarPrimary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
};

export default InputToolbar;
