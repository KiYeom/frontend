export type TDailyAnalyzeStatus = {
  dates: string[];
};

export type TDailyAnalyze = {
  date: string;
  record: DailyRecordDto;
  summary: DailySummaryDto;
  classification: DailyClassificationDto;
};

export type DailyRecordDto = {
  isNULL: boolean;
  Keywords: EmotionKeyword[];
  todayFeeling: string | null;
  images: string[] | null;
};

export type EmotionKeyword = {
  keyword: string;
  group: string;
};

export type DailySummaryDto = {
  isNULL: boolean;
  keywords: string[];
};

export type DailyClassificationDto = {
  isNULL: boolean;
  labels: TLabel[];
};

export type TLabel = {
  label: string;
  percent: number;
};

export type TPeriodChart = {
  start_date: string;
  end_date: string;
  charts: EmotionChart[];
};

export type TNewPeriodChart = {
  id?: number;
  nickname?: string;
  dates: string[];
  groups: string[];
};

export type EmotionChart = {
  category: string;
  chart: PercentByDate[];
};

export type PercentByDate = {
  date: string;
  value: number;
};

export type TPeriodKeywords = {
  start_date: string;
  end_date: string;
  count: number;
  keywords: string[];
};

export type TPeriodTotalEmotions = {
  start_date: string;
  end_date: string;
  count: number;
  emotions: string[];
};

export type TPeriodRecordEmotions = {
  records: TRecordEmotion[];
};

export type TRecordEmotion = {
  date: string;
  todayFeeling: string | null;
  keywords: EmotionKeyword[];
  images: string[]; //1.6.9 update
};
export type TEmotions = {
  keywords: string[];
};

export type TEmotionCheck = {
  desc?: string;
  group: string; //group: 'angry' | 'sad' | 'happy' | 'calm';
  keyword: string; //keyword: '지친', '신나는', '엄준식(커스텀)'
  type?: 'default' | 'custom'; //default, custom
};
