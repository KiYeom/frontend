import { View, Text, TouchableOpacity } from 'react-native';
import { BottomCotainer } from './bottom.style';
import palette from '../../assets/styles/theme';
import { Image } from 'react-native';
import HomeIcon from '../../assets/icons/Home.svg';
import SettingIcon from '../../assets/icons/Setting.svg';
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

        /*const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };*/

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
                //backgroundColor: 'pink',
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

              <Text style={{ color: isFocused ? palette.primary[500] : palette.neutral[300] }}>
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
