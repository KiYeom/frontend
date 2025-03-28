import React, { useEffect } from 'react';
import { Alert, View, Linking, Platform, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../../components/header/header';

const Favorites: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    //내가 좋아했던 말들
  }, []);

  return (
    <View
      style={{
        flex: 1,
      }}>
      <Header title={'따스한 대화 모아보기'} />
      <View>
        <Text>내가 좋아했던 말</Text>
      </View>
    </View>
  );
};

export default Favorites;
