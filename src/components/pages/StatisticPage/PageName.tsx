import { css } from '@emotion/native';
import { Text } from 'react-native';
import { rsFont } from '../../../utils/responsive-size';

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
        text-align: center;
      `}>
      {type}
    </Text>
  );
};
export default PageName;
