import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-paper';
import { APP_VERSION, MenuItemProps } from '../../constants/Constants';

//설정 (Setting) 화면에서 메뉴에 해당하는 MenuItem 컴포넌트

const MenuItem: React.FC<MenuItemProps> = ({ onPress, title }) => {
  return (
    <TouchableOpacity style={styles.menuContainer} onPress={onPress}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={styles.text}>{title}</Text>
        {title === '앱 정보' ? <Text>{APP_VERSION}</Text> : null}
      </View>
      <Icon source="chevron-right" size={32} color="#3B506B" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    borderColor: 'f0f3f8',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 17,
  },
});

export default MenuItem;
