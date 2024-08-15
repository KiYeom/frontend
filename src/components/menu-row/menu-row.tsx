import React from 'react';
import './menu-row.styles';
import { View } from 'react-native-ui-lib';
import SwitchComponent from '../switch/switch';
import Icon from '../icons/icons';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
import palette from '../../assets/styles/theme';
import {
  LargeTouchArea,
  MenuRowContainer,
  MenuRowText,
  MenuRowTextContainer,
  VersionStatus,
  VersionText,
} from './menu-row.styles';
import { getAppVersion } from '../../utils/device-info';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

export type MenuRowProps = {
  text: string;
  showVersion?: boolean;
  isLatest?: boolean;
  onPress?: () => void;
  latestVersion?: string;
};

const linkingToStore = (
  showVersion: boolean | undefined,
  isLatest: boolean | undefined,
  func: (() => void) | undefined,
) => {
  if (showVersion === true && isLatest === false) {
    //버전 표시 하고, 업데이트 필요할 때
    if (Platform.OS === 'ios') {
      Linking.openURL('https://apps.apple.com/app/remind/id6544783154');
    }
    return;
  }
  if (func) func();
  return;
};

const MenuRow = (props: MenuRowProps) => {
  const { text, showVersion = false, isLatest = true, onPress = () => {} } = props;

  return (
    <MenuRowContainer
      onPress={() => linkingToStore(props.showVersion, props.isLatest, props.onPress)}
      activeOpacity={1}>
      <MenuRowTextContainer>
        <MenuRowText>{text}</MenuRowText>
        {showVersion && (
          <>
            <VersionText>{'v' + getAppVersion()}</VersionText>
            <VersionStatus isLatest={isLatest}>
              {isLatest ? '최신' : '지금 업데이트하기!'}
            </VersionStatus>
          </>
        )}
      </MenuRowTextContainer>

      {showVersion ? (
        !isLatest && (
          <Icon
            name="arrow-right"
            width={rsWidth * 9}
            height={rsHeight * 18}
            color={palette.neutral[300]}
          />
        )
      ) : (
        <Icon
          name="arrow-right"
          width={rsWidth * 9}
          height={rsHeight * 18}
          color={palette.neutral[300]}
        />
      )}
    </MenuRowContainer>
  );
};

export default MenuRow;
