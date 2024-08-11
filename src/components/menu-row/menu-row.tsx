import React from 'react';
import './menu-row.styles';
import { View } from 'react-native-ui-lib';
import SwitchComponent from '../switch/switch';
import Icon from '../icons/icons';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
import palette from '../../assets/styles/theme';
import {
  MenuRowContainer,
  MenuRowText,
  MenuRowTextContainer,
  VersionStatus,
  VersionText,
} from './menu-row.styles';
import { getAppVersion } from '../../utils/device-info';

export type MenuRowProps = {
  text: string;
  showVersion?: boolean;
  onPress?: () => void;
};

const MenuRow = (props: MenuRowProps) => {
  const { text, showVersion = false, onPress = () => {} } = props;
  const isNew = false;

  return (
    <MenuRowContainer onPress={onPress} activeOpacity={1}>
      <MenuRowTextContainer>
        <MenuRowText>{text}</MenuRowText>
        {showVersion && (
          <>
            <VersionText>{'v' + getAppVersion()}</VersionText>
            <VersionStatus isNew={isNew}>
              {isNew ? '최신' : '업데이트 필요 | 백엔드 일하자'}
            </VersionStatus>
          </>
        )}
      </MenuRowTextContainer>

      <Icon
        name="arrow-right"
        width={rsWidth * 9}
        height={rsHeight * 18}
        color={palette.neutral[300]}
      />
    </MenuRowContainer>
  );
};

export default MenuRow;
