import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import palette from '../../assets/styles/theme';
import { TabBarLabel } from '../../constants/Constants';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
import Icon from '../icons/icons';
import { BottomTabBarCotainer, TabButtonContainer, TabLabel } from './bottom-tab-bar.style';

const BottomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  return (
    <BottomTabBarCotainer insets={insets}>
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
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <TabButtonContainer
            key={index}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}>
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
    </BottomTabBarCotainer>
  );
};
export default BottomTabBar;

/*
function MyTabBar({ state, descriptors, navigation }) {
  return (
    //탭 바 메뉴들을 가로로 정렬해두는 View 컴포넌트
    <BottomCotainer>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;
        console.log('tabbarlabel있음', options.tabBarLabel);
        const isFocused = state.index === index;

        //탭 버튼 클릭 시 호출되는 함수
        const onPress = () => {
          console.log('눌림!');
          console.log(route.name); //route.name을 통해 setting 클릭 시 api 호출하도록
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              //onLongPress={onLongPress}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                height: rsHeight * 50,
              }}>
              {options.tabBarLabel === '홈' ? (
                <HomeIcon
                  style={{ color: isFocused ? palette.primary[500] : palette.neutral[300] }}
                />
              ) : (
                <SettingIcon
                  style={{ color: isFocused ? palette.primary[500] : palette.neutral[300] }}
                />
              )}

              <Text
                style={{
                  color: isFocused ? palette.primary[500] : palette.neutral[300],
                  fontSize: 13 * rsFont,
                  fontFamily: 'Pretendard-Medium',
                  marginTop: 4 * rsHeight,
                }}>
                {label}
              </Text>
            </TouchableOpacity>
          </>
        );
      })}
    </BottomCotainer>
  );
}
export default MyTabBar;
*/
