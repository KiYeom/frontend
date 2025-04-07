import { StyleProp, TextStyle, Text } from 'react-native';
import palette from '../../assets/styles/theme';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
import Icon, { TIconName } from '../icons/icons';
import { IconContainer, InputContainer, InputField, WithMessage } from './input.styles';
import { ImageShowContainer, CancelButton } from './ImageShow.styles';

type ImageShowProps = {
  image?: string | null;
  setImage?: React.Dispatch<React.SetStateAction<string | null>>;
};

const ImageShow = ({ image, setImage }: ImageShowProps) => {
  return (
    <ImageShowContainer>
      <CancelButton
        onPress={() => {
          console.log('image : ', image);
          console.log('취소 버튼 클릭');
          if (setImage) {
            setImage(null);
          } else {
            console.log('setImage 안옴');
          }
        }}
      />
      <Text style={{ color: 'white' }}>이미지</Text>
    </ImageShowContainer>
  );
};

export default ImageShow;
