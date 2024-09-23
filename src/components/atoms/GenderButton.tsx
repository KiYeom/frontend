import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface props {
  selectedGender: string;
  setSelectedGender: (gender: string) => void;
}

const GenderButton: React.FC<props> = ({ selectedGender, setSelectedGender }) => {
  const onPress = (gender: 'male' | 'female') => {
    if (selectedGender == gender) {
      setSelectedGender('');
    } else {
      setSelectedGender(gender);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.btn, selectedGender === 'male' && styles.btnPressed]}
        onPress={() => onPress('male')}>
        <Icon name="male" size={50} color="black" />
        <Text style={styles.txt}>남성</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.btn, selectedGender === 'female' && styles.btnPressed]}
        onPress={() => onPress('female')}>
        <Icon name="female" size={50} color="black" />
        <Text style={styles.txt}>여성</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 30,
  },
  txt: {
    fontSize: 16,
    color: '#333',
  },
  btn: {
    width: 100,
    height: 100,
    backgroundColor: '#D9D9D9',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
  },
  btnPressed: {
    backgroundColor: '#A9A9A9',
  },
});

export default GenderButton;
