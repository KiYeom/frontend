import AsyncStorage from "@react-native-async-storage/async-storage";

export const GOOGLE_KEY = "google_auth_key";

// 데이터 저장 함수
export const storageData = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    //console.log("Storage에 데이터 저장 성공!");
  } catch (e) {
    console.log(e);
  }
};

// 데이터 가져오기 함수 (return : object)
export const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    //console.log("========", jsonValue);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(e);
  }
};

//데이터 삭제
export const deleteDate = async (key: string) => {
  try {
    AsyncStorage.removeItem(key);
  } catch (e) {
    console.error(e);
  }
};
