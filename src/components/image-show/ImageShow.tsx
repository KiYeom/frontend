import { StyleProp, TextStyle, Text, Image } from 'react-native';
import palette from '../../assets/styles/theme';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
import Icon, { TIconName } from '../icons/icons';
import { IconContainer, InputContainer, InputField, WithMessage } from './input.styles';
import { ImageShowContainer, CancelButton } from './ImageShow.styles';
import { useEffect, useState } from 'react';

type ImageShowProps = {
  image?: string | null;
  setImage?: React.Dispatch<React.SetStateAction<string | null>>;
};

const ImageShow = ({ image, setImage }: ImageShowProps) => {
  const [scaledSize, setScaledSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (image) {
      Image.getSize(
        image,
        (width, height) => {
          setScaledSize({ width: 50, height: 50 });
        },
        (error) => {
          console.error('이미지 크기를 가져오는데 실패함:', error);
        },
      );
    }
  }, [image]);

  return (
    <ImageShowContainer>
      <CancelButton
        onPress={() => {
          console.log('image : ', image);
          console.log('취소 버튼 클릭');
          if (setImage) {
            setImage(null);
          }
        }}>
        <Icon name="cancel-icon" size={rsWidth * 14} color={'white'} />
      </CancelButton>
      {/*<Text style={{ color: 'white' }}>이미지</Text>*/}
      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: scaledSize.width, height: scaledSize.height }}
        />
      )}
    </ImageShowContainer>
  );
};

export default ImageShow;
