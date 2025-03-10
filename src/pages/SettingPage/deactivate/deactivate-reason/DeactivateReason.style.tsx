import styled from '@emotion/native';
import { Checkbox } from 'react-native-ui-lib';
import { rsHeight } from '../../../../utils/responsive-size';

//체크박스와 버튼을 감싸는 form container
export const FormContainer = styled.View`
  flex: 1;
  height: 100%;
  flex-direction: column;
`;

//체크박스를 감싸는 checkbox container
export const CheckboxContainer = styled.View`
  flex: 1;
  gap: ${rsHeight * 16 + 'px'};
`;

//체크박스를 꾸미는 checkbox contaienr
type checkboxProps = {
  label: string; //필수. 체크박스 옆에 작성할 글자
  value: boolean; //checkbox의 check 상태
  onValueChange?: () => void; //check가 바뀔 때 불리는 함수
};

//기타를 클릭하면 textarea가 나와야 함
const Check = (props: checkboxProps) => {
  const { label, value } = props;
  return <Checkbox label={label} value={value} />;
};
export default Check;
