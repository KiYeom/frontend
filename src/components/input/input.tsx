import { TextInput, View , Text} from "react-native"
import { IconContainer, InputContainer, InputField, WithMessage } from "./input.styles";
import Icon, { TIconName } from "../icons/icons";
import { rsHeight, rsWidth } from "../../utils/responsive-size";
import palette from "../../assets/styles/theme";


type InputProps = {
    status?: "correct" | "error" | "default" | "disabled";
    withMessage?: boolean;
    message?: string;
    value?: string;
    onChagne?: (text: string) => void;
    placeholder?: string;
    textAlign?: "left" | "center" | "right";
    showRightIcon?: boolean;
    rightIcon?: TIconName;
}
const Input = (props: InputProps) => {
    const {status = "default", withMessage=false, showRightIcon=false, rightIcon="arrow-down", message, value, onChagne = () => {}, placeholder, textAlign="left"} = props;
    return(
        <InputContainer>
        <InputField placeholder={placeholder} status={status} value={value} onChangeText={onChagne} editable={status !== 'disabled'}/>
        {showRightIcon &&
            <IconContainer>
                <Icon name={rightIcon} width={rsWidth * 16} height={ rsHeight * 16} color={palette.neutral[500]}/>
            </IconContainer>
        }       
        {withMessage && <WithMessage status={status} textAlign={textAlign}>{message}</WithMessage>}
        </InputContainer>
    )
}

export default Input;