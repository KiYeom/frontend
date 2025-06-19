// components/ActionButton.tsx
import React, { useCallback } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ActionsProps } from 'react-native-gifted-chat';
import Icon from '../../../../../components/icons/icons';
import palette from '../../../../../assets/styles/theme';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from 'react-redux';
import { sendMessages } from '../../../../../redux/chatSlice';

const ActionButton = (props: ActionsProps) => {
  const dispatch = useDispatch();

  const onPressAlbum = useCallback(async () => {
    console.log('앨범 버튼 클릭됨');
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('앨범 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      const imageMessage = {
        _id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        user: { _id: 1 },
        image: uri,
        text: '',
      };
      dispatch(sendMessages([imageMessage]));
    }
  }, [dispatch]);

  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPressAlbum}>
      <Icon name="picture-icon" width={20} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    margin: 0,
    width: 35,
    height: 35,
    borderRadius: 50,
    backgroundColor: palette.neutral[100],
    marginLeft: 10,
  },
});

export default ActionButton;
