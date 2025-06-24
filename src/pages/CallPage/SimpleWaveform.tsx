import React from 'react';
import { View } from 'react-native';

interface SimpleWaveformProps {
  data: number[]; // 0~1 사이의 진폭 값들 (예: Math.abs(samples))
  width?: number;
  height?: number;
  barColor?: string;
}

const SimpleWaveform: React.FC<SimpleWaveformProps> = ({
  data,
  width = 300,
  height = 80,
  barColor = '#007bff',
}) => {
  const barWidth = width / data.length;

  return (
    <View
      style={{
        width,
        height,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
        borderRadius: 4,
      }}>
      {data.map((value, index) => (
        <View
          key={index}
          style={{
            width: barWidth - 1,
            height: value * height,
            backgroundColor: barColor,
            marginRight: 1,
          }}
        />
      ))}
    </View>
  );
};

export default SimpleWaveform;
