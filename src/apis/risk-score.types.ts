export type TDangerButtonRes = {
  buttons: TDangerButton[];
};

export type TDangerButton = {
  index: number;
  text: string;
  type: 'tel' | 'in-link' | 'out-link';
  content: string;
};
