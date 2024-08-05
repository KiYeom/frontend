export type TNotice = {
  title: string;
  content: string;
  options: TOptionButton[];
  description: string;
  required: boolean;
};

export type TOptionButton = {
  text: string;
  link: string;
};

export type TGender = '여성' | '남성';

export type TVender = 'kakao' | 'google' | 'apple';
