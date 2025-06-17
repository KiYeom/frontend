// queries/emotionQueries.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  todayEmotionCheck,
  dailyAnalyze,
  todayEmotion,
  todayEmotionWithImage,
} from '../apis/analyze';
// 특정 날짜의 감정 일기 조회
export const useEmotionData = (dateID) => {
  return useQuery({
    queryKey: ['emotion', dateID],
    queryFn: async () => {
      console.log('queryFn 실행, dateID:', dateID);
      const result = await todayEmotionCheck(dateID);
      console.log('API 결과:', result);
      return result;
    },
    enabled: !!dateID,
    staleTime: 1000 * 60 * 5,
  });
};
//감정 일기 저장
export const useSaveEmotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ dateID, emotions, text }) => {
      const response = await todayEmotion(dateID, emotions, text);
      return response;
    },
    onSuccess: (data, variables) => {
      // 캐시 업데이트 - 저장된 데이터로 업데이트
      queryClient.setQueryData(['emotion', variables.dateID], {
        emotions: variables.emotions,
        text: variables.text,
        dateID: variables.dateID,
      });

      // 관련 쿼리들 무효화 (목록 새로고침 등)
      queryClient.invalidateQueries({ queryKey: ['emotionList'] });
    },
    onError: (error) => {
      console.error('감정 일기 저장 실패:', error);
    },
  });
};

export const useSaveEmotionWithImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ dateID, emotions, text, images }) => {
      console.log('💾 이미지 포함 일기 저장 API 호출:', { dateID, emotions, text, images });
      const response = await todayEmotionWithImage(dateID, emotions, text, images);
      return response;
    },
    onSuccess: (data, variables) => {
      console.log('✅ 이미지 포함 일기 저장 성공');

      // 캐시 업데이트
      queryClient.setQueryData(['emotion', variables.dateID], {
        Keywords: variables.emotions,
        todayFeeling: variables.text,
        images: variables.images,
        isNULL: false,
      });

      // 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: ['emotionList'] });
    },
    onError: (error) => {
      console.error('❌ 이미지 포함 일기 저장 실패:', error);
    },
  });
};

// 감정 일기 목록 조회
export const useEmotionList = (year, month) => {
  return useQuery({
    queryKey: ['emotionList', year, month],
    queryFn: () => getEmotionList(year, month),
    staleTime: 1000 * 60 * 2, // 2분간 캐시
  });
};
