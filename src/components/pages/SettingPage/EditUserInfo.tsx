import React from 'react';
import { StyleSheet } from 'react-native';
import NameInput from '../../molecules/NameInput';
import BirthInput from '../../molecules/BirthInput';
import GenderInput from '../../molecules/GenderInput';
import Button from '../../button/button';
import { ContentContainer } from '../sign-up/input-name/input-name.styles';
import { validateName } from '../../../utils/ValidateName';
import { CTAContainer } from '../sign-up/input-name/input-name.styles';
import { getUserBirthdate, getUserGender, getUserNickname } from '../../../utils/storageUtils';
//설정 - 프로필 수정 화면

const EditUserInfo: React.FC = () => {
  const [name, setName] = React.useState('');

  return (
    <>
      <ContentContainer style={styles.container}>
        <NameInput name={'' + getUserNickname()} setName={setName} />
        <BirthInput />
        <GenderInput />
      </ContentContainer>
      <CTAContainer>
        <Button
          title="저장"
          disabled={!(validateName(name) === 'correct')}
          primary={true}
          onPress={
            () => {}
            //TODO: 이름, 생년월일, 성별을 api로 보내서 수정하기
          }
        />
      </CTAContainer>
    </>
  );
};
export default EditUserInfo;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: 'white',
  },
});
