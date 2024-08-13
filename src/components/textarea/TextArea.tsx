import { TextAreaContainer, TextAreaField } from './TextArea.style';

type TextAreaProps = {
  value?: string;
  onChange?: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
};
const TextArea = (props: TextAreaProps) => {
  const { placeholder, value, onChange = () => {} } = props;
  return (
    <TextAreaContainer>
      <TextAreaField
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        multiline={true}
      />
    </TextAreaContainer>
  );
};
export default TextArea;
