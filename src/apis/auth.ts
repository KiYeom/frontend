import axios from "axios";
import { TAuth} from "./auth.types";
import { storage } from "../utils/storageUtils";
import { REFRESHTOKEN } from "../constants/Constants";
import { instance } from "./interceptor";


//INFO: SSO 로그인
export const ssoLogin = async (code: string, vender: "google" | "apple" | "kakao"): Promise<TAuth | undefined> => {

    try{
    const res = await instance.post('/auth/sso-login', {
        "providerName": vender,
        "providerCode": code,
        "deviceId": "device123",
        "appVersion": "1.0.0",
        "deviceOs": "Android 10"
    })

    return res.data;

    }catch(error){
        console.error("[ERROR] ssoLogin", error);
        return;
    }
}


//INFO: refreshToken으로 accessToken 재발급
export const getGenerateAccessToken = async (): Promise<string | undefined> => {
    const refreshToken = storage.getString(REFRESHTOKEN);
    console.log('리프레시 토큰: ', refreshToken);
    try {
        const res = await axios.patch("/auth/refresh", {
                "deviceId": "device123",
                "appVersion": "1.0.0",
                "deviceOs": "Android 10",
                "refreshToken": refreshToken,
                "isAppStart": false
        })

        if(res.status === 200){
            return res.data.data.accessToken;
        }
        else return;

    }catch(error){
        console.error("[ERROR] getGenerateAccessToken ", error);
        return;
    }
}