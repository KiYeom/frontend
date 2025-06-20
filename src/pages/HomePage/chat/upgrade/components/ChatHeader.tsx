import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
const ChatHeader = ({ navigation }: any) => {
  //react-native (view랑 text로 구성된 컴포넌트)

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.drawerButton} onPress={() => navigation.openDrawer()} />
      <Text style={styles.headerText}>Chat Header</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    height: 80,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  drawerButton: {
    width: 35,
    height: 35,
    borderRadius: 20,
    //backgroundColor: palette.neutral[100],
    backgroundColor: 'orange',
  },
});
export default ChatHeader;
