import { css } from "@emotion/native"
import { Platform, TouchableOpacity, View } from "react-native"
import { rsHeight, rsWidth } from "../../utils/responsive-size"
import { useNavigation } from "@react-navigation/native";
import palette from "../../assets/styles/theme";
import Icon from "../icons/icons";

const Header = () => {
    const navigation = useNavigation();
    return (
        <View style={css`
            margin-top:${rsHeight * 40 + 'px'};
            height: ${rsHeight * 56 + 'px'};
            padding-left: ${rsWidth * 24 + 'px'};
            display: flex;
            justify-content: center;
            `}>
              <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={1}>
                <Icon name='arrow-left' width={rsWidth * 9 + 'px'} color={palette.neutral[900]}/>
              </TouchableOpacity>
            </View>
    )
}

export default Header;