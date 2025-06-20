import React, { useRef, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Icon from '../icons/icons';
import { Card, IconContainer, TextContainer, ValueText, LabelText } from './streak.styles';
import { TIconName } from '../icons/icons';
import LottieView from 'lottie-react-native';
type StreakProps = {
  icon?: TIconName;
  value?: number;
  label?: string;
  lottieTrigger?: number;
};
const StreakCard = (props: StreakProps) => {
  const { icon, value, label, lottieTrigger = 0 } = props;
  const lottieAnimationRef = useRef<LottieView>(null);
  const previousLottieTriggerRef = useRef<number>(lottieTrigger);
  const [isLottieVisible, setIsLottieVisible] = useState(false);
  useEffect(() => {
    if (lottieTrigger !== previousLottieTriggerRef.current) {
      //console.log('streakCard : lottie 애니메이션 재생');
      setIsLottieVisible(true); // Lottie 뷰를 보이도록 설정
      lottieAnimationRef.current?.reset();
      lottieAnimationRef.current?.play();
    }
    previousLottieTriggerRef.current = lottieTrigger;
  }, [lottieTrigger]);
  // Lottie 애니메이션 재생이 완료되면 호출될 함수
  const handleAnimationFinish = () => {
    //console.log(`StreakCard (${label}): Lottie 애니메이션 종료.`);
    setIsLottieVisible(false); // Lottie 뷰를 다시 숨김
  };

  //console.log('isLottieVisible', isLottieVisible);

  return (
    <Card>
      {icon === 'fire' && (
        <LottieView
          ref={lottieAnimationRef}
          source={require('../../assets/motion/streak.json')}
          loop={false}
          autoPlay={false}
          onAnimationFinish={handleAnimationFinish}
          style={{
            width: 160,
            height: 100,
            position: 'absolute',
            bottom: 0,
            left: 0,
            opacity: isLottieVisible ? 1 : 0,
            zIndex: 5,
            //backgroundColor: 'black',
          }}
        />
      )}

      {icon && (
        <IconContainer>
          <Icon name={icon} width={45} />
        </IconContainer>
      )}

      <TextContainer>
        <ValueText>{value}일</ValueText>
        <LabelText>{label}</LabelText>
      </TextContainer>
    </Card>
  );
};
export default StreakCard;
