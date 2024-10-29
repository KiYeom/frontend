import { css } from '@emotion/native';
import { Text } from 'react-native';
import { rsFont, rsWidth } from '../../../utils/responsive-size';

type TitleProps = {
  type: string;
};
const PageName = (props: TitleProps) => {
  const { type } = props;
  return (
    <Text
      style={css`
        font-size: ${rsFont * 24 + 'px'};
        font-family: Pretendard-SemiBold;
        text-align: left;
        padding-left: ${rsWidth * 24 + 'px'};
        //background-color: red;
      `}>
      {type}
    </Text>
  );
};
export default PageName;
