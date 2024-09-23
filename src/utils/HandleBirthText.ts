//YYYY.MM.DD로 맞춰지게 .을 찍어주는 함수
const handleDateChange = (text: string) => {
  let formatted = text.replace(/\D/g, '');

  // 형식이 YYYY.MM.DD 로 맞춰지도록 수정
  if (formatted.length > 4) {
    formatted = formatted.slice(0, 4) + '.' + formatted.slice(4);
  }
  if (formatted.length > 7) {
    formatted = formatted.slice(0, 7) + '.' + formatted.slice(7);
  }
  // 최대 10자리로 자르기 (YYYY.MM.DD)
  if (formatted.length > 10) {
    formatted = formatted.slice(0, 10);
  }
  setBirth(formatted);
};
