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
}
