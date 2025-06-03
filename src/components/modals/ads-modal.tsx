import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  ActivityIndicator,
} from 'react-native';
import styled from '@emotion/native';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
import Button from '../button/button';

interface AdsModalProps {
  modalVisible: boolean;
  onClose: (type: 'cancel' | 'submit') => void;
  onSubmit: () => Promise<void> | void;
  imageSource: ImageSourcePropType;
  modalContent: string;
  isButtonDisabled?: boolean;
  adStatus?: {
    isLoaded: boolean;
    isLoading: boolean;
    isShowing: boolean;
    isReady: boolean;
  };
}

const AdsModal: React.FC<AdsModalProps> = ({
  modalVisible,
  onClose,
  onSubmit,
  imageSource,
  modalContent,
  isButtonDisabled = false,
  adStatus,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 버튼 상태 결정
  const isWatchButtonDisabled =
    isSubmitting || isButtonDisabled || adStatus?.isShowing || !adStatus?.isReady;

  const isCancelButtonDisabled = isSubmitting || adStatus?.isShowing;

  // 버튼 텍스트 결정
  const getWatchButtonText = () => {
    if (isSubmitting) return '처리 중...';
    if (adStatus?.isLoading) return '광고 로딩 중...';
    if (adStatus?.isShowing) return '광고 시청 중...';
    if (!adStatus?.isLoaded) return '광고 준비 중...';
    return '광고 시청하기';
  };

  const handleSubmit = async () => {
    if (isWatchButtonDisabled) return;

    try {
      setIsSubmitting(true);
      await onSubmit();
      // 성공 시 모달은 onSubmit 내부에서 닫힘
    } catch (error) {
      console.error('광고 시청 오류:', error);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isCancelButtonDisabled) return;

    onClose('cancel');
    setIsSubmitting(false);
  };

  // 모달이 닫힐 때 상태 초기화
  React.useEffect(() => {
    if (!modalVisible) {
      setIsSubmitting(false);
    }
  }, [modalVisible]);

  return (
    <Modal visible={modalVisible} animationType="fade" transparent>
      <ModalOverlay>
        <ModalContainer onStartShouldSetResponder={() => true}>
          <ImageContainer>
            <Image source={imageSource} style={{ width: 140, height: 140 }} />
          </ImageContainer>

          <ContentContainer>
            <ModalText>{modalContent}</ModalText>

            {/* 광고 상태 표시 (개발용) */}
            {__DEV__ && adStatus && (
              <DebugInfo>
                <DebugText>
                  로드: {adStatus.isLoaded ? '✅' : '❌'} | 로딩: {adStatus.isLoading ? '⏳' : '⭕'}{' '}
                  | 표시: {adStatus.isShowing ? '📺' : '⭕'} | 준비:{' '}
                  {adStatus.isReady ? '✅' : '❌'}
                </DebugText>
              </DebugInfo>
            )}
          </ContentContainer>

          <ButtonGroup>
            <ButtonWrapper>
              <Button
                title="취소"
                primary={false}
                disabled={isCancelButtonDisabled}
                onPress={handleCancel}
              />
            </ButtonWrapper>

            <ButtonWrapper>
              <Button
                title={getWatchButtonText()}
                primary={true}
                disabled={isWatchButtonDisabled}
                onPress={handleSubmit}
                renderIcon={() =>
                  isSubmitting ? (
                    <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />
                  ) : null
                }
              />
            </ButtonWrapper>
          </ButtonGroup>

          {/* 광고 로딩 인디케이터 */}
          {adStatus?.isLoading && !isSubmitting && (
            <LoadingContainer>
              <ActivityIndicator size="small" color="#666" />
              <LoadingText>광고를 불러오는 중...</LoadingText>
            </LoadingContainer>
          )}
        </ModalContainer>
      </ModalOverlay>
    </Modal>
  );
};

const ModalOverlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContainer = styled.View`
  width: 300px;
  background-color: white;
  padding: ${rsHeight * 30}px ${rsWidth * 24}px;
  border-radius: 30px;
  align-items: center;
  gap: ${rsHeight * 16}px;
`;

const ImageContainer = styled.View`
  align-items: center;
`;

const ContentContainer = styled.View`
  align-items: center;
  gap: ${rsHeight * 8}px;
`;

const ModalText = styled.Text`
  font-size: ${rsWidth * 15}px;
  font-family: 'Pretendard-Regular';
  color: black;
  text-align: center;
  line-height: ${rsWidth * 22}px;
`;

const ButtonGroup = styled.View`
  flex-direction: row;
  gap: ${rsWidth * 8}px;
  width: 100%;
`;

const ButtonWrapper = styled.View`
  flex: 1;
`;

const LoadingContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-top: ${rsHeight * 8}px;
`;

const LoadingText = styled.Text`
  font-size: ${rsWidth * 12}px;
  font-family: 'Pretendard-Regular';
  color: #666;
`;

const DebugInfo = styled.View`
  background-color: #f0f0f0;
  padding: 8px;
  border-radius: 4px;
  margin-top: 8px;
`;

const DebugText = styled.Text`
  font-size: 10px;
  font-family: 'Pretendard-Regular';
  color: #333;
`;

export default AdsModal;
