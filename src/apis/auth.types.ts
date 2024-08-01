export type TAuth = {
  nickname: string | null;
  gender: '여성' | '남성' | null;
  birthdate: string | null;
  isNewUser: boolean;
  accessToken: string;
  refreshToken: string;
  notice: TNotice | null;
};

type TNotice = {
  title: string;
  content: string;
  options: TOptionButton[];
  description: string;
  required: boolean;
};

type TOptionButton = {
  text: string;
  link: string;
};

export type TNewUser = {
  nickname: string;
  birthdate: string;
  gender: string;
};
