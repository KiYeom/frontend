import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import palette from '../../assets/styles/theme';
import {
  HomeStackName,
  RootStackName,
  SettingStackName,
  TabBarLabel,
  TabScreenName,
} from '../../constants/Constants';
import Analytics from '../../utils/analytics';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
import Icon from '../icons/icons';
import { BottomTabBarContainer, TabButtonContainer, TabLabel } from './bottom-tab-bar.style';
import { deleteIsDemo, getIsDemo, setIsDemo } from '../../utils/storageUtils';
import { getDemoActivePush, getDemoAllow, getDemoAnalyticsPush } from '../../apis/demo';
import { setDemoTalk } from '../../utils/demo-chat';

const requestDemoMode = () => {
  getDemoAllow().then((response) => {
    if (response && response.result) {
      setIsDemo(true);
      setDemoTalk();
      return;
    }
  });
};

const endDemoMode = () => {
  deleteIsDemo();
};

const BottomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const isNewChatFocused = state.routes[state.index].name === TabScreenName.NewChat;
  return (
    <BottomTabBarContainer insets={insets} style={{ display: isNewChatFocused ? 'none' : 'flex' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        //탭의 라벨 설정 (tabBarLabel, title, route 이름 순으로 라벨 설정)
        const label =
          options.tabBarLabel?.toString() !== undefined
            ? options.tabBarLabel.toString()
            : options.title !== undefined
              ? options.title
              : route.name;
        const isFocused = state.index === index;
        //현재의 탭이 포커스 되어있는지

        //탭 버튼 클릭 시 호출되는 함수
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          //탭 클릭 시 이동
          if (!isFocused && !event.defaultPrevented) {
            //Analytics.clickTabButton(label);
            if (route.name === TabScreenName.NewChat) {
              navigation.navigate(RootStackName.HomeStackNavigator, {
                screen: HomeStackName.NewChat,
              });
            } else {
              navigation.navigate(route.name, route.params);
            }
          }
        };

        const onLongPress = () => {
          if (route.name === TabScreenName.Setting) {
            Analytics.clickTabSettingConnectButton();
            navigation.navigate(RootStackName.SettingStackNavigator, {
              screen: SettingStackName.OrganizationConnect,
            });
            return;
          } else if (route.name === TabScreenName.Home) {
            Analytics.clickTabHomeDemoModeButton();
            if (getIsDemo()) endDemoMode();
            else requestDemoMode();
            return;
          } else if (route.name === TabScreenName.NewChat) {
            if (getIsDemo()) getDemoActivePush();
            else onPress();
            return;
          } else if (route.name === TabScreenName.Statistic) {
            if (getIsDemo()) getDemoAnalyticsPush();
            else onPress();
            return;
          } else {
            onPress();
            return;
          }
        };

        return (
          <TabButtonContainer
            key={index}
            activeOpacity={1}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}>
            {label === TabBarLabel.Home ? (
              <Icon
                name={'home-icon'}
                width={rsWidth * 34}
                height={rsHeight * 30}
                color={isFocused ? palette.primary[500] : palette.neutral[300]}
              />
            ) : (
              <></>
            )}
            {label === TabBarLabel.NewChat ? (
              <Icon
                name={'chat-icon'}
                width={rsWidth * 34}
                height={rsHeight * 30}
                color={isFocused ? palette.primary[500] : palette.neutral[300]}
              />
            ) : (
              <></>
            )}
            {label === TabBarLabel.Statistic ? (
              <Icon
                name={'statistic-icon'}
                width={rsWidth * 32}
                height={rsHeight * 30}
                color={isFocused ? palette.primary[500] : palette.neutral[300]}
              />
            ) : (
              <></>
            )}

            {label === TabBarLabel.Setting ? (
              <Icon
                name={'setting-icon'}
                width={rsWidth * 30}
                height={rsHeight * 32}
                color={isFocused ? palette.primary[500] : palette.neutral[300]}
              />
            ) : (
              <></>
            )}
            <TabLabel isFocused={isFocused}>{label}</TabLabel>
          </TabButtonContainer>
        );
      })}
    </BottomTabBarContainer>
  );
};
export default BottomTabBar;
