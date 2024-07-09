import axios from "axios";
import { storage } from "../../utils/storageUtils";
import { ACCESSTOKEN } from "../constants/Constants";

/* 백엔드 500번 에러 발생..
export const callGpt = async (prompt) => {
  // AccessToken을 가져옵니다.
  const accessToken = storage.getString(ACCESSTOKEN);
  console.log("accessToken", accessToken);

  try {
    // axios를 사용하여 POST 요청을 보냅니다.
    const response = await axios.post(
      "http://34.125.112.144:8000/chat", 
      {
        characterId: 1,
        question: prompt, // prompt를 question 필드로 보냅니다.
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    // 요청이 성공하면 응답을 출력합니다.
    console.log("백엔드 gpt랑 연결 완료");
    console.log("response:", response.data);
  } catch (error) {
    // 오류가 발생하면 오류 정보를 출력합니다.
    console.log("백엔드랑 gpt 연결 실패...");
    console.log("error:", error);
  }
};
*/

/*
import Config from "react-native-config";

const apikey = process.env.EXPO_PUBLIC_API_KEY;

export const callGpt = async (prompt : string) => {
  //console.log("gpt call",prompt);
  const messages = [
    {
      role: "system",
      content: `프롬프트 지시사항`},
    {
      role : "user",
      content : `"${prompt}"`
    }];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method : "POST",
    headers : {
      "Content-Type": "application/json",
      "Authorization" : `Bearer ${apikey}`,
    },
    body : JSON.stringify({
      model : "ft:gpt-3.5-turbo-0125:personal::9bX4NuR6",
      messages,
      temperature : 0.7
    }),
  });
  const responseData = await response.json();
  //console.log("response : ", responseData);
  //console.log("gpt의 대답 : ", responseData.choices[0].message.content);
  return responseData.choices[0].message.content;
}*/