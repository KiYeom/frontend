import { Image } from 'react-native';
import { ImageShowContainer } from './ImageShow.styles';
import { useEffect, useState } from 'react';
import AttachmentPreview from '../image-container/AttachmentPreview';
import Analytics from '../../utils/analytics';
import type { ImageSourcePropType } from 'react-native';

type ImageShowProps = {
  image?: string | ImageSourcePropType | null; // 이미지 URL
  setImage?: React.Dispatch<React.SetStateAction<string | null>>;
};

const ImageShow = ({ image, setImage }: ImageShowProps) => {
  const [scaledSize, setScaledSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    //console.log('이미지 보여주기 컴포넌트 실행됨', image);
    if (!image) return;
    if (typeof image === 'string') {
      //console.log('이미지~~', image);
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
          console.log('이미지 URL:', image);
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
            Analytics.clickImagePreviewCancelButton();
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
