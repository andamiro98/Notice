import axios from "axios";

// httponly 쿠키방식으로 jwt토큰을 저장후 refreshToken 발급요청

export const requestRefreshToken = async () => {
    try{
        await axios.post(
            "http://3.36.1.167:8080/api/auth/refresh",
            {},
            {withCredentials:true}
        )
        console.log("Refresh")
    }catch(e){
        console.log("Refrsh Token Faild", e)
    }
}