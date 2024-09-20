export const validateBirth = (birth: string): 'error' | 'default' | 'correct' => {
  const parts = birth.split('.');
  if (parts.length < 3 || parts[2].length < 2) {
    //끝까지 다 입력하기 전까지는 default
    return 'default';
  }
  if (parts.length === 3 || parts[2].length === 2) {
    //다 입력했으면
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    const isValidYear = year >= 1900 && year <= new Date().getFullYear();
    const isValidMonth = month >= 1 && month <= 12;
    const isValidDay = day >= 1 && day <= new Date(year, month, 0).getDate();
    if (isValidYear && isValidMonth && isValidDay) {
      return 'correct'; //유효한 날짜
    } else {
      return 'error'; //유효하지 않은 날짜
    }
  }
};
//input 창에 입력한 생일이 유효한지 판단해주는 validateName 함수
