import { StyleProp, TextStyle, Text } from 'react-native';
import palette from '../../assets/styles/theme';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
import Icon, { TIconName } from '../icons/icons';
import { IconContainer, InputContainer, InputField, WithMessage } from './input.styles';
import { ImageShowContainer } from './ImageShow.styles';

const ImageShow = (image: string | null) => {
  return (
    <ImageShowContainer>
      <Text>이미지</Text>
    </ImageShowContainer>
  );
};

export default ImageShow;
