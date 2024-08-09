import { Text, TouchableOpacity } from 'react-native';
import { BottomCotainer } from './bottom.style';
import palette from '../../assets/styles/theme';
import HomeIcon from '../../assets/icons/Home.svg';
import SettingIcon from '../../assets/icons/Setting.svg';
import StatisticIcon from '../../assets/icons/test.svg';
import { rsFont, rsHeight, rsWidth } from '../../utils/responsive-size';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { css } from '@emotion/native';

const MyTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  return (
    <BottomCotainer>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label: string = options.tabBarLabel as string;
        //탭의 라벨 설정 (tabBarLabel, title, route 이름 순으로 라벨 설정)
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
          <>
            <TouchableOpacity
              //accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              style={css`
                border: 5px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                height: ${rsHeight * 50 + 'px'};
                //background-color: gray;
              `}>
              {label === '통계' && (
                <StatisticIcon
                  style={css`
                    color: ${isFocused ? palette.primary[500] : palette.neutral[300]};
                  `}
                />
              )}
              {label === '홈' && (
                <HomeIcon
                  style={css`
                    color: ${isFocused ? palette.primary[500] : palette.neutral[300]};
                  `}
                />
              )}
              {label === '설정' && (
                <SettingIcon
                  style={css`
                    color: ${isFocused ? palette.primary[500] : palette.neutral[300]};
                  `}
                />
              )}

              <Text
                style={css`
                  color: ${isFocused ? palette.primary[500] : palette.neutral[300]};
                  font-size: ${13 * rsFont + 'px'};
                  font-family: Pretendard-Medium;
                  margin-top: ${4 * rsHeight + 'px'};
                  border: 5px;
                `}>
                {label}
              </Text>
            </TouchableOpacity>
          </>
        );
      })}
    </BottomCotainer>
  );
};
export default MyTabBar;

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
