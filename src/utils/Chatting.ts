import { chatting } from '../apis/chatting';
import { ERRORMESSAGE } from '../constants/Constants';
import { getChatting, setChatting } from './storageUtils';

//채팅을 보낸 현재 시간 (date)을 리턴하는 함수
export const getTime = (): number => {
  const currentDate: number = Date.now();
  return currentDate;
};

//현재 시간을 [오전/오후]hh:mm 으로 변경하는 함수
export const formatTime = (date: number): string => {
  const dateObject = new Date(date);
  let hours = dateObject.getHours();
  const minutes = dateObject.getMinutes();
  const period = hours >= 12 ? '오후' : '오전';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  return `${period} ${hours}:${formattedMinutes}`;
};

//현재 시간을 [yyyy년 mm월 dd일]으로 변경하는 함수
export const formatDate = (date: number): string => {
  const dateObject = new Date(date);
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, '0');
  const day = String(dateObject.getDate()).padStart(2, '0');
  return `${year}년 ${month}월 ${day}일`;
};

//유저가 한 말을 여러 정보를 가진 ojbect로 리턴해주는 함수
export const userSend = (userText: string): any => {
  const today = getTime();
  const userData = {
    sender: 'user',
    text: `${userText}`,
    id: `${today}`,
    time: `${formatTime(today)}`,
    date: `${formatDate(today)}`,
  };
  return userData;
};

export const botAnswer = () => {
  const today = getTime();
  const botData = {
    sender: 'bot',
    text: ``,
    id: `${today}`,
    time: `${formatTime(today)}`,
    date: `${formatDate(today)}`,
  };
  return botData;
};

//ai가 한 말을 여러 정보를 가진 ojbect로 리턴해주는 함수
export const aiSend = async (userQuestion: string) => {
  const cookieAnswerResponse = await chatting(1, userQuestion); //1번 챗봇(=쿠키)에게 질문을 보냄
  const coolieAnswer = cookieAnswerResponse ? cookieAnswerResponse.answer : ERRORMESSAGE;
  const today = getTime();
  const aiData = {
    sender: 'bot',
    text: `${coolieAnswer}`,
    id: `${today}`,
    time: `${formatTime(today)}`,
    date: `${formatDate(today)}`,
  };
  return aiData;
};

//이제까지 모든 대화를 스토리지에 저장해두는 함수
export const saveChatLogs = (logs: any) => {
  try {
    setChatting(JSON.stringify(logs));
  } catch (error) {
    console.log('saveChatLogs error', error);
    return;
  }
};

//앱을 처음 실행할 때 스토리지에 저장된 대화를 꺼내오는 함수
export const loadChatLogs = ({ data, setData }: any) => {
  //console.log('loadChatLogs 실행');
  try {
    const chatLogs = getChatting();
    if (chatLogs) {
      setData(JSON.parse(chatLogs));
    }
  } catch (error) {
    //console.log('loadChatLogs error', error);
    return;
  }
  //console.log('실행 결과 ', data);
};
