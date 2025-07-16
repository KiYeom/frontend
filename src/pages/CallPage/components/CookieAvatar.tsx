import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { getUserNickname } from '../../../utils/storageUtils';
const userNickname = getUserNickname() || '';
type CookieAvatarProps = {
  responseText: string;
  isReceivingAudio?: boolean;
  waveform?: number[];
  isActive?: boolean;
};
const CookieAvatar = (props: CookieAvatarProps) => {
  const { responseText, isReceivingAudio, waveform, isActive } = props;
  return (
    <View
      style={{
        borderColor: 'green',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
      }}>
      <View style={{ flexDirection: 'column', alignItems: 'center' }}>
        <View
          style={{
            width: 250,
            height: 250,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: 'purple',
          }}>
          <Text
            style={{
              color: 'white',
              paddingBottom: 10,
              fontSize: 17,
              fontFamily: 'Pretendard-SemiBold',
            }}>
            리마인드 쿠키
          </Text>
          <View
            style={{
              backgroundColor: 'white',
              width: 123,
              height: 123,
              borderRadius: 100,
              overflow: 'hidden',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1,
            }}>
            <Image
              source={require('@assets/images/callcookie.png')}
              style={{ width: 140, height: 120 }}
            />
          </View>
        </View>
      </View>
      <View style={{ borderColor: 'pink', width: 310, height: 17 * 8 }}>
        <ScrollView
          style={{ height: 17 * 5 + 10 }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
          }}>
          <Text
            style={{
              color: 'white',
              fontFamily: 'Kyobo-handwriting',
              fontSize: 17,
              textAlign: 'center',
              lineHeight: 24,
            }}>
            {responseText ||
              `찾아와줘서 고마워요, ${userNickname ? `${userNickname}님` : ''}\n마음 속의 생각을 편하게 이야기 해 주세요`}
          </Text>
        </ScrollView>
      </View>
    </View>
  );
};
export default CookieAvatar;
