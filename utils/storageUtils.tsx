import AsyncStorage from "@react-native-async-storage/async-storage";

// 데이터 저장 함수
export const storageData = async (key: string, value: object) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    console.log("Storage에 데이터 저장 성공!");
  } catch (e) {
    console.log(e);
  }
};

// 데이터 가져오기 함수
export const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    console.log("========", jsonValue);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(e);
  }
};
