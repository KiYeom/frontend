import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import Icon from '@components/icons/icons';
import palette from '@assets/styles/theme';

type CallTimerProps = {
  remainingTime: number;
  totalTime: number; // 전체 시간 (선택적)
  onChargePress: () => void;
  isLoading?: boolean;
  isSyncing?: boolean; // 서버와 동기화 중인지 여부
  isChargeDisabled?: boolean; // 충전 버튼 비활성화 여부
};

const CallTimer = (props: CallTimerProps) => {
  const { remainingTime, totalTime, onChargePress, isLoading, isSyncing, isChargeDisabled } = props;

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isCritical = remainingTime <= 180; // 3분 이하일 때 critical로 간주
  const color = isCritical ? '#DA1E28' : '#8CC1FF';
  const progress = totalTime > 0 ? remainingTime / totalTime : 0;

  return (
    <View style={{ borderColor: 'red', flexDirection: 'row', marginTop: 36, gap: 8 }}>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: color,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Icon name="clock" width="24" height="24" color={palette.neutral[50]} />
      </View>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderColor: 'gray',
          flex: 1,
        }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View
            style={{
              flexDirection: 'row',
              gap: 8,
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flex: 1,
            }}>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-end' }}>
              {isLoading ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <ActivityIndicator size="small" color="white" />
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 14,
                      fontFamily: 'Pretendard-Medium',
                    }}>
                    충전 처리중...
                  </Text>
                </View>
              ) : (
                <>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 18,
                      lineHeight: 28,
                      fontFamily: 'Pretendard-Medium',
                      width: 85,
                    }}>
                    {formatTime(remainingTime)}
                  </Text>
                  <View style={{ flexDirection: 'column' }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 12,
                        fontFamily: 'Pretendard-Medium',
                      }}>
                      남았습니다
                    </Text>
                  </View>
                </>
              )}
            </View>
            <TouchableOpacity
              onPress={onChargePress}
              disabled={isLoading || isChargeDisabled}
              style={{
                backgroundColor:
                  isLoading || isChargeDisabled ? palette.neutral[400] : palette.primary[500],
                padding: 5,
                borderRadius: 5,
                opacity: isLoading || isChargeDisabled ? 0.6 : 1,
              }}>
              <Text style={{ color: 'white', fontSize: 12, fontFamily: 'Pretendard-SemiBold' }}>
                충전하기
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <ProgressBar
          progress={progress}
          color={color}
          style={{
            height: 8,
            backgroundColor: '#E0E0E0',
            borderRadius: 10,
            marginTop: isSyncing ? 8 : 12, // 동기화 텍스트가 있을 때 간격 조정
          }}
        />
      </View>
    </View>
  );
};

export default CallTimer;
