import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { css } from '@emotion/native';
import { rsHeight, rsWidth } from '../../../utils/responsive-size';
import palette from '../../../assets/styles/theme';
import Icon from '../../../components/icons/icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const StickyFooter = () => {
  const insets = useSafeAreaInsets();
  console.log('insets', insets);

  return (
    <KeyboardStickyView
      hideOnKeyboardClosed={false}
      offset={{
        closed: insets.bottom, // 키보드가 닫혀있을 때
        opened: 0, // 키보드가 열렸을 때 offset 없음
      }}>
      <View
        style={css`
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: ${rsHeight * 12 + 'px'} ${rsWidth * 16 + 'px'};
          background-color: ${palette.neutral[50]};
          border-top-width: 1px;
          border-top-color: ${palette.neutral[200]};
        `}>
        <Icon
          name="picture-icon"
          width={rsWidth * 20}
          height={rsHeight * 20}
          color={palette.neutral[400]}
        />
        <Icon
          name="check-icon"
          width={rsWidth * 20}
          height={rsHeight * 20}
          color={palette.neutral[400]}
        />
      </View>
    </KeyboardStickyView>
  );
};

export default StickyFooter;
