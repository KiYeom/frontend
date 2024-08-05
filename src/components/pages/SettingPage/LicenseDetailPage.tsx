import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { useLayoutEffect } from 'react';
import { useRoute } from '@react-navigation/native';

const LicenseDetailPage: React.FC<any> = ({ navigation }) => {
  //const [selectedLicense, setSelectedLicense] = useState<string | null>(null);
  const route = useRoute();
  const { item }: any = route.params;
  //useRoute를 통해 넘겨온 데이터를 받을 수 있음, object 형태
  console.log('전달받은 데이터 : ', item);

  const HeaderTitle: React.FC<any> = ({ title }) => (
    <Text style={{ fontSize: 18, width: 250 }} ellipsizeMode="tail" numberOfLines={1}>
      {title}
    </Text>
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle title={item.libraryName} />,
    });
  }, [navigation, item.libraryName]);

  return (
    <ScrollView style={styles.details}>
      {item.version ? <Text>Version: {item.version}</Text> : null}
      {item._description ? <Text>Description: {item._description}</Text> : null}
      {item._license ? <Text>License: {item._license}</Text> : null}
      {item.homepage ? <Text>Homepage: {item.homepage}</Text> : null}
      {item.author?.name ? <Text>Author: {item.author.name}</Text> : null}
      {item.author?.emial ? <Text>Email: {item.author.email}</Text> : null}
      {item.author?.url && <Text>URL: {item.author.url}</Text>}
      {item.repository?.url ? <Text>Repository: {item.repository.url}</Text> : null}
      {item.repository?.directory && <Text>Directory: {item.repository.directory}</Text>}
      {item._licenseContent && <Text>License Content: {item._licenseContent}</Text>}
    </ScrollView>
  );
};
export default LicenseDetailPage;

const styles = StyleSheet.create({
  details: {
    backgroundColor: 'lightgray',
    padding: 10,
  },
});
