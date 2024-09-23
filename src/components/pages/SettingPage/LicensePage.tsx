import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { TLicense } from '../../../constants/types';

const LicensePage: React.FC<any> = ({ navigation }) => {
  const [data, setData] = useState<TLicense[]>([]);
  const [selectedLicense, setSelectedLicense] = useState<string | null>(null);

  const renderItem = ({ item }: { item: TLicense }) => (
    <View style={styles.renderItems}>
      <TouchableOpacity
        onPress={() => {
          setSelectedLicense(item.libraryName);
          navigation.navigate('LicenseDetailPage', { item });
          //naviage('페이지', 넘겨줄 데이터)
        }}
        style={styles.touchable}>
        <Text>{item.libraryName}</Text>
        <Icon source="chevron-right" size={32} color="#3B506B" />
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    const OpenLinceseObject = require('../../../constants/OpenSourceLicense.json');
    setData(OpenLinceseObject);
  }, []);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.libraryName}
      contentContainerStyle={styles.flatlist}
    />
  );
};

export default LicensePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    //backgroundColor: "yellow",
  },
  flatlist: {
    //backgroundColor: "pink",
  },
  renderItems: {
    //backgroundColor: "blue",
    margin: 3,
    textAlign: 'center',
    justifyContent: 'center',
  },
  touchable: {
    //backgroundColor: "yellow",
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});
