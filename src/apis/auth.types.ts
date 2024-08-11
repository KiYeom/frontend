export type TAuth = {
  nickname: string | null;
  gender: '여성' | '남성' | null;
  birthdate: string | null;
  isNewUser: boolean;
  accessToken: string;
  refreshToken: string;
  notice: Notice | null;
};

type Notice = {
  title: string;
  content: string;
  options: OptionButton[];
  description: string;
  required: boolean;
};

type OptionButton = {
  text: string;
  link: string;
};

export type TNewUser = {
  nickname: string;
  birthdate: string | null;
  gender: string | null;
};

export type TNewAccessToken = {
  nickname: string;
  gender: '여성' | '남성';
  birthdate: string;
  accessToken: string;
  notice: Notice | null;
};
