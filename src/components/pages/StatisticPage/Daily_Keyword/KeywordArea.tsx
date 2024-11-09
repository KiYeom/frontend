import React from 'react';
import palette from '../../../../assets/styles/theme';
import { rsHeight, rsWidth } from '../../../../utils/responsive-size';
import Icon from '../../../icons/icons';
import BlurredButton from '../BlurredButton';
import { SectionTitle } from '../StatisticMain.style';
import { Container, KeywordContainer, KeywordIcon, KeywordText } from './Keyword.style';
import { TouchableOpacity, View } from 'react-native';
const KeywordArea: React.FC<any> = (props: any) => {
  const { value, isSummaryList, summaryList } = props;

  return (
    <Container>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
        <SectionTitle>쿠키와 이런 이야기를 했어요</SectionTitle>
        <TouchableOpacity
          activeOpacity={1}
          style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 4 }}
          onPress={() => {
            /* Handle press here */
          }}>
          <Icon name="information" width={16} height={16} />
        </TouchableOpacity>
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
