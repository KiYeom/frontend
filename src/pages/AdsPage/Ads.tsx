import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  RewardedAd,
  TestIds,
  useForeground,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';
const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});

const AdsScreen = ({ navigation, route }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setLoaded(true);
    });
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log('User earned reward of ', reward);
      },
    );

    // Start loading the rewarded ad straight away
    rewarded.load();
    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);
  if (!loaded) {
    return null;
  }
  return (
    <View>
      <Text>{adUnitId}</Text>
    </View>
  );
};

export default AdsScreen;
