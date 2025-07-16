import React from 'react';
import { View, ScrollView, Platform, Alert, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { rsWidth, rsHeight } from '../../../../utils/responsive-size';
//import UploadButton from '../../../../components/upload-picture/UploadButton';
import UploadButton from '@components/upload-picture/UploadButton';
import useEmotionStore from '../../../../store/useEmotionStore';
import { MAX_DIARY_IMAGE_COUNT } from '../../../../constants/Constants';
import AttachmentPreview from '../../../../components/image-container/AttachmentPreview';
const DiaryImageSection = () => {
  const image = useEmotionStore((state) => state.image);
  const addImage = useEmotionStore((state) => state.addImage);
  const removeImage = useEmotionStore((state) => state.removeImage);

  const getPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          '사진 접근 권한이 필요합니다',
          '사진 업로드를 위해 앱 설정에서 사진 접근 권한을 허용해주세요.',
          [
            { text: '취소', style: 'cancel' },
            {
              text: '설정',
              onPress: () => Linking.openSettings(),
            },
          ],
          { cancelable: true },
        );
        return false;
      }
      return true;
    }
  };

  const pickImage = async () => {
    const permission = await getPermission();
    if (!permission) return;

    if (image.length >= MAX_DIARY_IMAGE_COUNT) {
      //setModalVisible(true);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.5,
      allowsMultipleSelection: false,
      exif: false,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      addImage(uris[0]);
    }
  };

  return (
    <View
      style={{
        justifyContent: 'center',
        paddingHorizontal: rsWidth * 24,
        paddingVertical: rsHeight * 10,
        height: 120,
      }}>
      {image.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}>
          {image.map((img, idx) => (
            <AttachmentPreview key={idx} image={img} onDelete={removeImage} />
          ))}
        </ScrollView>
      ) : (
        <UploadButton onPress={pickImage} />
      )}
    </View>
  );
};

export default DiaryImageSection;
