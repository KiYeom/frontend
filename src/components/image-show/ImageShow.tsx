import { Image } from 'react-native';
import { ImageShowContainer } from './ImageShow.styles';
import { useEffect, useState } from 'react';
import AttachmentPreview from '../image-container/AttachmentPreview';

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
          const maxWidth = 80; // 기준 너비
          const scaleFactor = maxWidth / width;

          const scaledWidth = maxWidth;
          const scaledHeight = height * scaleFactor;

          setScaledSize({ width: scaledWidth, height: scaledHeight });
        },
        (error) => {
          console.error('이미지 크기를 가져오는데 실패함:', error);
        },
      );
    }
  }, [image]);

  return (
    <ImageShowContainer>
      {/*<Text style={{ color: 'white' }}>이미지</Text>*/}
      {image && (
        <AttachmentPreview
          image={image}
          onDelete={(image) => {
            //console.log('삭제 버튼 클릭');
            if (setImage) {
              setImage(null);
            }
          }}
        />
      )}
    </ImageShowContainer>
  );
};

export default ImageShow;
