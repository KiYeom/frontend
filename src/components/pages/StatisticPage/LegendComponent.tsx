// LegendComponent.tsx
import React from 'react';
import { View, Text } from 'react-native-ui-lib';

const renderDot = (color: string) => (
  <View
    style={{
      height: 10,
      width: 10,
      borderRadius: 5,
      backgroundColor: color,
      marginRight: 10,
    }}
  />
);

const LegendComponent: React.FC = () => {
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: 120,
            marginRight: 20,
          }}>
          {renderDot('#006DFF')}
          <Text style={{ color: 'black' }}>Excellent: 47%</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: 120 }}>
          {renderDot('#8F80F3')}
          <Text style={{ color: 'black' }}>Okay: 16%</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: 120,
            marginRight: 20,
          }}>
          {renderDot('#3BE9DE')}
          <Text style={{ color: 'black' }}>Good: 40%</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: 120 }}>
          {renderDot('#FF7F97')}
          <Text style={{ color: 'black' }}>Poor: 3%</Text>
        </View>
      </View>
    </>
  );
};

export default LegendComponent;
