import { css } from '@emotion/native';
import { useHeaderHeight } from '@react-navigation/elements';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Keyboard, TextInput, View, TouchableOpacity, ScrollView } from 'react-native';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';
import Icon from '../../../components/icons/icons';
import Toast from 'react-native-root-toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { dailyAnalyze, todayEmotion, todayEmotionWithImage } from '../../../apis/analyze';
import { TabScreenName, RootStackName } from '../../../constants/Constants';
import EmotionTitleBox from './emotionTitleBox';
import EmotionChip from '../../../components/atoms/EmotionChip/EmotionChip';
import EmotionCard from '../../../components/atoms/EmotionCard/EmotionCard';
import Analytics from '../../../utils/analytics';
import useEmotionStore from '../../../store/emotion-status';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';
import { formatDateKorean } from '../../../utils/times';
import Header from '../../../components/header/header';
import { useCalendarStore } from '../../../store/calendarStore';
import palette from '../../../assets/styles/theme';
import * as ImagePicker from 'expo-image-picker';
import AttachmentPreview from '../../../components/image-container/AttachmentPreview';
import { MAX_DIARY_IMAGE_COUNT } from '../../../constants/Constants';
import TierModal from '../../../components/modals/tier-modal';
const DailyDairy = ({ navigation, route }) => {
  const { dateID } = route.params;
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  // 상태: 텍스트 인풋 높이
  const [inputHeight, setInputHeight] = useState(46); //초기 높이

  const { selectedEmotions, diaryText, setDiaryText } = useEmotionStore();
  const { updateEntryStatus } = useCalendarStore();

  //이미지 가지고 오기
  const [image, setImage] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // 서버에서 키워드 리스트 페치 (생략)
  useEffect(() => {
    Analytics.watchDiaryWriteScreen();
    // fetchData();
  }, []);

  const handleContentSizeChange = (event) => {
    const { width, height } = event.nativeEvent.contentSize;
    setInputHeight(height);
  };

  // 일기 저장 로직
  const saveDiary = async () => {
    Analytics.clickDiaryWriteButton();
    try {
      if (image.length === 0) {
        await todayEmotion(dateID, selectedEmotions, diaryText);
        const targetEmotion =
          selectedEmotions.find((e) => e.type === 'custom') || selectedEmotions[0];
        updateEntryStatus(dateID, `${targetEmotion.group}-emotion`);
        navigation.navigate(RootStackName.BottomTabNavigator, {
          screen: TabScreenName.Home,
        });
      } else {
        await todayEmotionWithImage(dateID, selectedEmotions, diaryText, image);
        const targetEmotion =
          selectedEmotions.find((e) => e.type === 'custom') || selectedEmotions[0];
        updateEntryStatus(dateID, `${targetEmotion.group}-emotion`);
        navigation.navigate(RootStackName.BottomTabNavigator, {
          screen: TabScreenName.Home,
        });
      }
    } catch (err) {
      Toast.show('저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  //사진 가져오기 로직
  const pickImage = async () => {
    if (image.length >= MAX_DIARY_IMAGE_COUNT) {
      setModalVisible(true);
      Toast.show(`사진은 최대 ${MAX_DIARY_IMAGE_COUNT}장까지 선택할 수 있습니다.`);
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: MAX_DIARY_IMAGE_COUNT,
    });
    console.log(result);
    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setImage((prev) => [...prev, ...uris]); // 기존 이미지에 추가
    }
    return;
  };

  return (
    <>
      {modalVisible && (
        <TierModal
          modalVisible={modalVisible}
          onClose={() => console.log('모달 꺼짐')}
          onSubmit={() => console.log('모달 확인')}
        />
      )}
      <View style={{ flex: 1, paddingBottom: insets.bottom }}>
        <Header title={formatDateKorean(dateID)} />

        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive">
          <View
            style={css`
              margin-top: ${rsHeight * 12 + 'px'};
            `}>
            <EmotionTitleBox
              iconName="dairy-cookie"
              mainTitle="오늘 하루를 되돌아봐요."
              subTitle="이 감정을 가장 강하게 느낀 순간은 언제인가요?"
            />
          </View>

          {/* 감정 카드 리스트 */}
          {selectedEmotions.length > 0 && (
            <View
              style={css`
                margin-top: ${rsHeight * 12 + 'px'};
                flex-direction: row;
                flex-wrap: wrap;
                gap: ${rsWidth * 6 + 'px'};
                padding-horizontal: ${rsWidth * 24 + 'px'};
              `}>
              {selectedEmotions.map((emotion, i) => (
                <EmotionCard key={i} emotion={emotion} status={'default'} />
              ))}
            </View>
          )}
          {image.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: rsWidth * 24,
                gap: rsWidth * 12,
                marginTop: rsHeight * 12,
              }}>
              {image.map((img, idx) => (
                <AttachmentPreview
                  key={idx}
                  image={img}
                  onDelete={(uriToDelete) =>
                    setImage((prev) => prev.filter((uri) => uri !== uriToDelete))
                  }
                />
              ))}
            </ScrollView>
          )}

          {/* 풀스크린 멀티라인 입력창 */}
          <TextInput
            multiline
            autoFocus
            scrollEnabled={false}
            value={diaryText}
            onChangeText={setDiaryText}
            placeholder="이 감정을 강하게 느낀 순간을 기록해보세요"
            placeholderTextColor="#AAA"
            style={css`
              margin-top: ${rsHeight * 12 + 'px'};
              margin-horizontal: ${rsWidth * 24 + 'px'};
              border-radius: 10px;
              //background-color: #f5f5f5;
              font-size: ${rsFont * 16 + 'px'};
              line-height: ${rsFont * 16 * 1.5 + 'px'};
              padding: ${rsHeight * 12 + 'px'} ${rsWidth * 12 + 'px'};
              text-align-vertical: top;
              font-family: Kyobo-handwriting;
              align-self: flex-start;
              height: ${inputHeight}px;
              padding-bottom: ${rsHeight * 50 + 'px'};
            `}
            onContentSizeChange={handleContentSizeChange}
          />
        </KeyboardAwareScrollView>

        <KeyboardStickyView offset={{ closed: 0, opened: insets.bottom }}>
          <View
            style={css`
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              padding: ${rsHeight * 12 + 'px'} ${rsWidth * 16 + 'px'};
              background-color: ${palette.neutral[100]};
              border-top-width: 1px;
              border-top-color: ${palette.neutral[200]};
            `}>
            <TouchableOpacity
              onPress={pickImage}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
              <Icon name="picture-icon" width={20} color={palette.neutral[400]} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={saveDiary}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
              <Icon name="check-icon" width={24} color={palette.neutral[400]} />
            </TouchableOpacity>
          </View>
        </KeyboardStickyView>
      </View>
    </>
  );
};

export default DailyDairy;
