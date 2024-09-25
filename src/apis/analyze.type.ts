export type TDailyAnalyze = {
  date: string;
  record: DailyRecordDto;
  summary: DailySummaryDto;
  classification: DailyClassificationDto;
};

export type DailyRecordDto = {
  isNULL: boolean;
  Keywords: EmotionKeyword[];
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

export type TEmotions = {
  keywords: string[];
};

export type TEmotionCheck = {
  desc?: string;
  //group: 'angry' | 'sad' | 'happy' | 'calm';
  group: string;
  keyword: string;
};
