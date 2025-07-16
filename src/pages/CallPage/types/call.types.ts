// types/call.types.ts

export interface PaymentOption {
  minutes: number;
  price: number;
  label: string;
}

export interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  onPayment: (minutes: number) => void;
}

export interface CallTimerProps {
  remainingTime: number;
  totalTime: number;
  onChargePress: () => void;
  isLoading?: boolean;
}

export interface CookieAvatarProps {
  responseText?: string;
  isReceivingAudio: boolean;
  waveform: number[];
  isActive: boolean;
}

export interface CallControlsProps {
  canStart: boolean;
  canPause: boolean;
  canResume: boolean;
  canDisconnect: boolean;
  onConnect: () => void;
  onPause: () => void;
  onResume: () => void;
  onDisconnect: () => void;
}

export interface CallControl {
  name: string;
  onPress: () => void;
  disabled: boolean;
}

export const PRODUCT_ID_MAP: Record<number, string> = {
  10: 'time_10min',
  30: 'time_30min',
  60: 'time_60min',
  120: 'time_120min',
} as const;

export const PAYMENT_OPTIONS: PaymentOption[] = [
  { minutes: 10, price: 2200, label: '10분' },
  { minutes: 30, price: 5900, label: '30분' },
  { minutes: 60, price: 10900, label: '60분' },
  { minutes: 120, price: 19900, label: '120분' },
];
