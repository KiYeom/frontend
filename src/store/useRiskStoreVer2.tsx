import { create } from 'zustand';
import { getRiskScore } from '../apis/riskscore';
import { getRiskData, setRiskData } from '../utils/storageUtils';
import { getKoreanServerTodayDateString } from '../utils/times';
import { RISK_SCORE_THRESHOLD } from '../constants/Constants';
import { DANGER_LETTER } from '../constants/Constants';

//useRiskStore 인터페이스 정의
interface RiskState {
  riskScoreV2: number; //위험 점수
  riskStatusV2: 'safe' | 'danger' | 'danger-opened'; //점수에 따른 위험 상태 정의
  setRiskScoreV2: (score: number) => Promise<void>; //api 를 호출하여 위험 점수 가져오기
  setRiskStatusV2: () => void; //위험 점수에 따라 위험 상태 정의하기
  setHandleDangerPressV2: () => void;
}

export const useRiskStoreVer2 = create<RiskState>()((set, get) => ({
  riskScoreV2: 0,
  riskStatusV2: 'safe',
  setRiskScoreV2: async () => {
    //api 호출에 따라 riskScoreV2를 갱신
    //console.log('😀😀😀😀😀');
    const data = getKoreanServerTodayDateString(new Date());
    try {
      const score = await getRiskScore(data);
      set({ riskScoreV2: score }); //위험 점수 갱신
      if (score >= 0 && !getRiskData()) {
        //푸시 하기 전에 숫자 변수로 바꾸기
        setRiskData({
          timestamp: new Date().getTime(),
          isRead: false,
          letterIndex: null,
        });
      }
      get().setRiskStatusV2(); //riskStatusV2 갱신
    } catch (error) {
      console.log('에러');
    }
  },
  setRiskStatusV2: () => {
    const riskData = getRiskData();
    if (!riskData) set({ riskStatusV2: 'safe' });
    else if (riskData.isRead) set({ riskStatusV2: 'danger-opened' });
    else set({ riskStatusV2: 'danger' });
  },
  setHandleDangerPressV2: () => {
    //편지를 안 본 상태에서 버튼을 눌렀을 때 데이터와 상태를 다시 정의
    if (get().riskStatusV2 === 'danger') {
      console.log('위험 상태일 때 누르는 버튼');
      const letterIndex = Math.floor(Math.random() * DANGER_LETTER.length);
      setRiskData({
        timestamp: new Date().getTime(),
        isRead: true,
        letterIndex,
      });
      get().setRiskStatusV2();
    }
  },
}));
