//채팅을 보낸 현재 시간 (date)을 리턴하는 함수
const getTime = (): number => {
  const currentDate: number = Date.now();
  console.log('현재 시간 : ', currentDate);
  return currentDate;
};

//현재 시간을 [오전/오후]hh:mm 으로 변경하는 함수
const formatTime = (date: number): string => {
  console.log('=======================', date);
  console.log('---------------------------', typeof date);
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
const formatDate = (date: number): string => {
  const dateObject = new Date(date);
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, '0');
  const day = String(dateObject.getDate()).padStart(2, '0');
  return `${year}년 ${month}월 ${day}일`;
};

export { getTime, formatTime, formatDate };
