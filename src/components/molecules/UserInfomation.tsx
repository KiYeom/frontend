import React from 'react';
import { Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import { clearInfoWhenLogout, getUserNickname } from '../../utils/storageUtils';
import { ProfileImage, UserInfoContainer, UserNickname } from './UserInfomation.style';
import { UseSigninStatus } from '../../utils/signin-status';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../icons/icons';
import palette from '../../assets/styles/theme';

const UserInfomation: React.FC<any> = ({ navigation }) => {};
export default UserInfomation;
