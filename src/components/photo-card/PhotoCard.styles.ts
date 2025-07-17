import styled from '@emotion/native';
import palette from '../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../utils/responsive-size';

export const PhotoCardContainer = styled.View`
  position: relative;
  align-items: center;
`;
export const PhotoCardTextContainer = styled.View<{ imageId: string }>`
  width: 292px;
  height: 148px;
  //background-color: rgba(255, 255, 255, 0.35);
  background-color: ${(props) =>
    props.imageId === 'bg4' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.38)'};
  position: absolute;
  border-radius: 20px;
  padding-vertical: ${rsHeight * 5 + 'px'};
  padding-horizontal: ${rsWidth * 5 + 'px'};
  //top: 53px;
  justify-content: center;
  align-self: center;
  align-items: center;
  align-center: center;
  padding-horizontal: ${rsWidth * 5 + 'px'};
  padding-vertical: ${rsHeight * 5 + 'px'};
  gap: 10px;
`;

export const PhotoCardLyric = styled.Text<{ imageId: string }>`
  font-size: ${rsFont * 15 + 'px'};
  font-family: Kyobo-handwriting;
  //color: ${palette.neutral[900]};
  color: ${(props) => (props.imageId === 'bg2' ? 'white' : palette.neutral[900])};
  text-align: center;
`;

export const PhotoCardInfo = styled.Text<{ imageId: string }>`
  font-size: ${rsFont * 11 + 'px'};
  font-family: Kyobo-handwriting;
  //color: ${palette.neutral[900]};
  color: ${(props) => (props.imageId === 'bg2' ? 'white' : palette.neutral[900])};
  text-align: center;
`;
