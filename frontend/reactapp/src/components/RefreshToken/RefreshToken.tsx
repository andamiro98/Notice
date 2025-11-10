import { useEffect } from "react"
import { useSelector } from "react-redux"
import { requestRefreshToken } from "../../services/refreshTokenService"
import type {RootState} from "../../store/"

export const RefreshToken = () => {

  const isAuthenticated = useSelector(
    (state:RootState) => state.auth.isAuthenticated
  );
  
  useEffect(()=> {
    if (!isAuthenticated) return; 

    const intervalid = setInterval(()=> {
      if(isAuthenticated){
        requestRefreshToken();
      }
    }, 1*60*1000); // 15분마다 RefreshToken 요청 타이머 설정
    console.log("1")
    return()=> clearInterval(intervalid);

  },[isAuthenticated])

  return null;
}
