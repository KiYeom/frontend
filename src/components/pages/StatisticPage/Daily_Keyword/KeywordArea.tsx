import React from 'react';
import palette from '../../../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../../../utils/responsive-size';
import Icon from '../../../icons/icons';
import BlurredButton from '../BlurredButton';
import { SectionTitle } from '../StatisticMain.style';
import { Container, KeywordContainer, KeywordIcon, KeywordText } from './Keyword.style';
import { Text, TouchableOpacity, View } from 'react-native';
import { Hint } from 'react-native-ui-lib';
import { css } from '@emotion/native';

const HINT_NAME = 'keyword';
const HINT_MESSAGE =
  '키워드로 요약한 그날의 대화 주제이에요.\n※ 정확한 분석을 위해 30자 이상의 대화가 필요합니다.';

const KeywordArea: React.FC<any> = (props: any) => {
  const { summaryList, hintStatus, setHintStatus } = props;

  return (
    <Container>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
        <SectionTitle>쿠키와 이런 이야기를 했어요</SectionTitle>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 4 }}>
          <Hint
            visible={hintStatus && hintStatus === HINT_NAME}
            position={Hint.positions.TOP}
            message={HINT_MESSAGE}
            color={'white'}
            enableShadow
            messageStyle={css`
              font-family: Kyobo-handwriting;
              font-size: ${16 * rsFont + 'px'};
              color: ${palette.neutral[900]};
            `}
            onPress={() => setHintStatus(undefined)}
            onBackgroundPress={() => setHintStatus(undefined)}>
            <View>
              <TouchableOpacity
                activeOpacity={1}
                style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 4 }}
                onPress={() => setHintStatus(hintStatus ? undefined : HINT_NAME)}>
                <Icon name="information" width={16} height={16} />
              </TouchableOpacity>
            </View>
          </Hint>
        </View>
      </View>
      {summaryList.length === 0 ? (
        <BlurredButton
          blurredImageUri={
            'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/statistic/samplekeyword.png'
          } // 로컬에 저장된 블러 이미지 경로
          text={'쿠키와 대화하고\n나의 마음을 알아보세요'}
          buttonText="지금 대화하기"
          onPress={() => {
            // 버튼 클릭 시 실행될 함수
            //navigation.replace(RootStackName.HomeStackNavigator, { screen: HomeStackName.Chat });
            // 채팅 화면으로 가는데, 채팅 화면의 뒤로가기 버튼을 누르면 이 화면 말고 홈 화면으로 가야할 것 같음..
          }}
        />
      ) : (
        summaryList.map((keyword, index) => (
          <KeywordContainer key={index}>
            <KeywordIcon index={index}>
              <Icon
                name={'clover-icon'}
                width={rsWidth * 18}
                height={rsHeight * 18}
                color={
                  index === 0
                    ? palette.primary[500]
                    : index === 1
                      ? palette.function.warning
                      : '#A395F1'
                }
              />
            </KeywordIcon>
            <KeywordText>{keyword}</KeywordText>
          </KeywordContainer>
        ))
      )}
    </Container>
  );
};
export default KeywordArea;
