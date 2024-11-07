import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { AppEventsLogger } from 'react-native-fbsdk-next';
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
import Home from '../pages/HomePage/Home';
import { Alert } from 'react-native';
import { deleteIsDemo, setIsDemo } from '../../utils/storageUtils';

const setDemoMode = () => {
  Alert.alert(
    '시연 모드로 실행하시겠습니까?',
    '시연 모드일 경우, 보고서 생성은 실시간으로 실행되며, 푸시 알림도 실시간으로 전송됩니다. \n\n 시연 모드는 앱을 재시작하면 해제됩니다. ',
    [
      {
        text: '뒤로 가기',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: '시연 모드 진입', onPress: () => setIsDemo(true) },
    ],
  );
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
            Analytics.clickTabButton(label);
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
          if (route.name === TabScreenName.Setting && isFocused) {
            Analytics.clickTabSettingConnectButton();
            navigation.navigate(RootStackName.SettingStackNavigator, {
              screen: SettingStackName.OrganizationStatus,
            });
            return;
          } else if (route.name === TabScreenName.Home) {
            Analytics.clickTabHomeDemoModeButton();
            setDemoMode();
            return;
          } else {
            onPress();
            return;
          }
        };

        return (
          <TabButtonContainer
            key={index}
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
