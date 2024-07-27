import styled from "@emotion/native";
import { rsFont, rsHeight, rsWidth } from "../../utils/responsive-size";
import palette from "../../assets/styles/theme";


export const InputContainer = styled.View`
display: flex;
flex-dircetion: column;
gap: ${rsHeight * 4 + 'px'};
position: relative;
`

export const InputField = styled.TextInput<{status: "default" | "error"|"correct" | "disabled"}>`
border-radius: 10px;
height: ${rsHeight * 52 + 'px'};
padding: 0 ${rsHeight * 18 + 'px'};
background-color: ${palette.neutral[50]};
font-size: ${rsFont * 16 + 'px'};
font-family: Pretendard-Regular;
color: ${props => props.status === "disabled" ? palette.neutral[200] : palette.neutral[900]};

border: ${props => props.status === 'error' ? `1px solid ${palette.function.error}` : props.status === "correct" ? `1px solid ${palette.primary[400]}` : 'none'};
`;


export const WithMessage = styled.Text<{status: "default" | "error" | "correct" | "disabled", textAlign?: "left" | "center" | "right"}>`
font-size: ${rsFont * 12 + 'px'};
font-family: Pretendard-Regular;
color: ${props => props.status === 'error' ? palette.function.error : props.status === "correct" ? palette.primary[400] : palette.neutral[300]};
text-align: ${props => props.textAlign ? props.textAlign : 'left'};
`

export const IconContainer = styled.View`
position: absolute;
right: ${rsWidth * 18 + 'px'};
top: ${rsHeight * 18 + 'px'};
background-color: ${palette.neutral[50]};
`;

/* Auto layout */
// display: flex;
// flex-direction: row;
// align-items: flex-start;
// padding: 18px;
// gap: 10px;

// width: 321px;
// height: 52px;

// background: #F6F6F6;
// border-radius: 10px;

/* Inside auto layout */
// flex: none;
// order: 0;
// align-self: stretch;
// flex-grow: 0;


/* 내용을 입력해주세요. */

// width: 133px;
// height: 16px;

// font-family: 'Pretendard';
// font-style: normal;
// font-weight: 400;
// font-size: 16px;
// line-height: 100%;
/* identical to box height, or 16px */

// color: #B6BDC6;


/* Inside auto layout */
// flex: none;
// order: 0;
// flex-grow: 0;
