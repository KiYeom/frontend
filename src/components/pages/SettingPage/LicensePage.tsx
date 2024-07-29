import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native';
import { StyleSheet } from 'react-native';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';
import React from 'react';
import { useState, useEffect } from 'react';
import OpenSourceLicense from '../../../constants/OpenSourceLicense.json';

type Author = {
  name: string;
  email: string;
  url?: string;
};

type Repository = {
  type: string;
  url: string;
  directory?: string;
};

type License = {
  libraryName: string;
  version: string;
  _license: string;
  _description: string;
  homepage: string;
  author: {
    name: string;
    email: string;
    url?: string;
  };
  repository: {
    type: string;
    url: string;
    directory: string;
  };
  _licenseContent?: string;
};

const LicensePage: React.FC<any> = ({ navigation }) => {
  const [data, setData] = useState<License[]>([]);
  const [selectedLicense, setSelectedLicense] = useState<string | null>(null);

  const renderItem = ({ item }: { item: License }) => (
    <View style={styles.renderItems}>
      <TouchableOpacity
        onPress={() => {
          setSelectedLicense(item.libraryName);
          navigation.navigate('LicenseDetailPage', { item });
          //console.log("hihihi",item.libraryName);
          //console.log("byebyebye", item);
        }}
        style={styles.touchable}>
        <Text>{item.libraryName}</Text>
        <Icon source="chevron-right" size={32} color="#3B506B" />
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    setData(OpenSourceLicense);
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
