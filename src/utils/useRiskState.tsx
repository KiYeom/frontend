import create from 'zustand';

/*
1. 사용자의 위험 상황을 아래와 같이 정의함
safe : 위험 점수가 RISK_SCORE_THRESHOLD 미만 (85점 미만)
danger : 위험 점수가 RISK_SCORE_THRESHOLD 이상 (85점 이상) 이고, 새로운 편지가 도착했으나 읽지 않은 상태
danger-opened : 위험 점수가 RISK_SCORE_THRESHOLD 이상 (85점 이상) 이고, 새로운 편지가 도착했으며 읽은 상태W
*/
type TRiskState = 'safe' | 'danger' | 'danger-opened';

/*
2. RiskStore 의 객체 구조를 정의한 RiskStore 타입을 정의
zustand 의 create 함수가 반환할 상태 타입이며, useRiskStateVer2의 속성과 메서드를 정의함
*/
interface RiskStore {
  riskState: TRiskState; // 사용자의 위험 상태
  setRiskState: (riskState: TRiskState) => void; // 사용자의 위험 상태를 변경하는 함수
}

/* 
3. 사용자의 점수와 편지 읽음에 따라 위험 상태를 관리하는 훅
*/
const useRiskStateVer2 = create<RiskStore>((set) => ({
  riskState: 'safe',
  setRiskState: (riskState: TRiskState) => set({ riskState }),
}));

export default useRiskStateVer2;
