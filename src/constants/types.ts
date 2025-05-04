export type TNotice = {
  index: number;
  title: string;
  content: string;
  buttons: TOptionButton[];
  force: boolean;
  saved: boolean;
};

export type TOptionButton = {
  text: string;
  link: string;
};

export type TGender = '여성' | '남성';
export type TPLAN = 'free' | 'pro';

export type TVender = 'kakao' | 'google' | 'apple' | 'guest';

export type TNotificationType = 'system' | 'chat_cookie';

export type TLicense = {
  libraryName: string;
  version: string;
  _license: string;
  _description: string;
  homepage: string;
  author: {
    name: string;
    email: string;
    url?: string;
  };
  repository: {
    type: string;
    url: string;
    directory: string;
  };
  _licenseContent?: string;
};
