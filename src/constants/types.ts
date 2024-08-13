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
