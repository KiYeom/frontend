import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Platform } from 'react-native';
import palette from '../../assets/styles/theme';
import Analytics from '../../utils/analytics';
import { getAppVersion } from '../../utils/device-info';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
import { TouchableOpacity } from 'react-native';
import Icon, { TIconName } from '../icons/icons';
import './menu-row.styles';
import {
  MenuRowContainer,
  MenuRowText,
  MenuRowTextContainer,
  VersionStatus,
  VersionText,
} from './menu-row.styles';
import { getIsDemo } from '../../utils/storageUtils';
import SwitchComponent from '../switch/switch';

export type MenuRowProps = {
  text?: string;
  showVersion?: boolean;
  isLatest?: boolean;
  onPress?: () => void;
  latestVersion?: string;
  showIcon?: boolean;
  showToggle?: boolean;
  isEnabled?: boolean;
  disabled?: boolean;
  showEventIcon?: boolean;
  eventName?: TIconName | undefined;
  shouldBlockTouch?: boolean;
};

const linkingToStore = (
  showVersion: boolean | undefined,
  isLatest: boolean | undefined,
  func: (() => void) | undefined,
) => {
  if (showVersion === true && isLatest === false) {
    //버전 표시 하고, 업데이트 필요할 때
    Analytics.clickTabSettingUpdateButton();
    if (Platform.OS === 'ios') {
      WebBrowser.openBrowserAsync('https://apps.apple.com/app/remind/id6544783154');
    } else if (Platform.OS === 'android') {
      WebBrowser.openBrowserAsync(
        'https://play.google.com/store/apps/details?id=com.ceunnseo.reMIND',
      );
    }
    return;
  }
  if (func) func();
  return;
};

const MenuRow = (props: MenuRowProps) => {
  const {
    text,
    showVersion = false,
    isLatest = true,
    onPress = () => {},
    showIcon = true,
    showToggle = false,
    isEnabled = true,
    disabled = false,
    showEventIcon = false,
    eventName = '',
    shouldBlockTouch = false,
  } = props;
  //console.log(
  //'showVersionshowVersionshowVersionshowVersion',
  //getAppVersion(),
  //'showVersion',
  //showVersion,
  //'isLatest',
  //isLatest,
  //);

  return (
    <MenuRowContainer
      onPress={
        !shouldBlockTouch
          ? () => {
              //console.log('초록색 누름');
              linkingToStore(props.showVersion, props.isLatest, props.onPress);
            }
          : undefined
      }
      showEventIcon={showEventIcon}
      activeOpacity={1}>
      <MenuRowTextContainer>
        {text && <MenuRowText>{text}</MenuRowText>}
        {showVersion && (
          <>
            <VersionText>{'v' + getAppVersion()}</VersionText>
            <VersionStatus isLatest={isLatest}>
              {isLatest ? '최신' : '지금 업데이트 '}
            </VersionStatus>
          </>
        )}
        {showEventIcon && (
          <TouchableOpacity onPress={onPress}>
            {eventName && <Icon name={eventName} width={90} height={45} />}
          </TouchableOpacity>
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
      ) : showIcon ? (
        <Icon
          name="arrow-right"
          width={rsWidth * 9}
          height={rsHeight * 18}
          color={palette.neutral[300]}
        />
      ) : null}
      {showToggle && (
        <SwitchComponent isEnabled={isEnabled} disabled={disabled} onPress={onPress} />
      )}
    </MenuRowContainer>
  );
};

export default MenuRow;
