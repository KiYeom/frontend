import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView } from 'react-native';
import Header from '../header/header';
import Icon from '../icons/icons';
import { rsHeight } from '../../utils/responsive-size';
import palette from '../../assets/styles/theme';
import {
  DateLineContainer,
  DateLineText,
  StatisticTitle,
  Container,
  ItemContainer,
} from './StatisticLayout.style';

interface StatisticLayoutProps {
  headerTitle: string;
  iconName: string;
  iconSize?: number;
  dateText: string;
  onDatePress: () => void;
  title: string;
  children: React.ReactNode; // 필수!
  modalComponent?: React.ReactNode;
  backgroundColor?: string;
  rightIcon?: string;
  rightFunction?: () => void;
  leftFunction?: () => void;
}

const StatisticLayout: React.FC<StatisticLayoutProps> = ({
  headerTitle,
  iconName,
  iconSize = 70,
  dateText,
  onDatePress,
  title,
  children, // 여기서 받아서
  modalComponent,
  backgroundColor = palette.neutral[50],
  rightIcon,
  rightFunction,
  leftFunction,
}) => {
  return (
    <Container>
      <Header
        title={headerTitle}
        bgcolor={backgroundColor}
        isRight={!!rightIcon}
        rightIcon={rightIcon}
        rightFunction={rightFunction}
        leftFunction={leftFunction}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingVertical: rsHeight * 16 }}>
        {/* 상단 고정 영역 */}
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Icon name={iconName} width={iconSize} height={iconSize} />
          <View style={{ marginVertical: 10 * rsHeight }}>
            <DateLineContainer onPress={onDatePress} accessibilityLabel="날짜 선택">
              <DateLineText>{dateText}</DateLineText>
              <Icon name="arrow-down" color="white" />
            </DateLineContainer>
            <StatisticTitle>{title}</StatisticTitle>
          </View>
        </View>

        {/* 여기서 children 렌더링, 간격 : 16px */}
        <ItemContainer>{children}</ItemContainer>
      </ScrollView>

      {modalComponent}
    </Container>
  );
};
export default StatisticLayout;
