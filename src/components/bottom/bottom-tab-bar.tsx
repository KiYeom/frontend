import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { AppEventsLogger } from 'react-native-fbsdk-next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import palette from '../../assets/styles/theme';
import {
  RootStackName,
  SettingStackName,
  TabBarLabel,
  TabScreenName,
} from '../../constants/Constants';
import Analytics from '../../utils/analytics';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
import Icon from '../icons/icons';
import { BottomTabBarContainer, TabButtonContainer, TabLabel } from './bottom-tab-bar.style';

const BottomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  return (
    <BottomTabBarContainer insets={insets}>
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
          //console.log('눌림!');
          //console.log(route.name); //route.name을 통해 setting 클릭 시 api 호출하도록
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          //탭 클릭 시 이동
          if (!isFocused && !event.defaultPrevented) {
            Analytics.clickTabButton(label);
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          if (route.name === TabScreenName.Setting && isFocused) {
            Analytics.clickTabSettingConnectButton();
            AppEventsLogger.logEvent(AppEventsLogger.AppEvents.CompletedRegistration, {
              [AppEventsLogger.AppEventParams.RegistrationMethod]: 'email',
            });
            navigation.navigate(RootStackName.SettingStackNavigator, {
              screen: SettingStackName.OrganizationStatus,
            });
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
