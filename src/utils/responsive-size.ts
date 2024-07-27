import { Dimensions, Platform } from "react-native";
export const basicDimensions = {
    height: 844,
    width: 390,
};

const ratio = Platform.OS === "android" ? 0.9 : 1;

export const rsHeight = parseFloat((Dimensions.get("screen").height * (1 / basicDimensions.height)).toFixed(2));
export const rsWidth = parseFloat((Dimensions.get("screen").width * (1 / basicDimensions.width)).toFixed(2));
export const rsFont = parseFloat((Dimensions.get("screen").width * (0.9 / basicDimensions.width)).toFixed(2));