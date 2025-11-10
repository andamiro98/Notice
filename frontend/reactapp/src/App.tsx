import { useDispatch } from "react-redux"
import AppRouter from "./AppRouter"
import "./assets/main.css"
import { useEffect } from "react";
import { get_userinfo } from "./services/authService";
import { signoutSuccess, signSuccess } from "./store/authSlice";
import axios from "axios";
//import { useSelector } from "react-redux";
//import type {RootState} from "./store"
import { requestRefreshToken } from "./services/refreshTokenService";


function App() {
  const dispatch = useDispatch();
  //const isauthenticated = useSelector((state : RootState) => state.auth.isAuthenticated);

  const checkAuth = async () => {
    try {
        const me = await get_userinfo();          // 1) access 유효
        dispatch(signSuccess(me));
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          try {
            await requestRefreshToken();          // 2) access 만료면 refresh 1회
            const me2 = await get_userinfo();     // 3) 복구 후 재시도
            dispatch(signSuccess(me2));
          } catch {
            dispatch(signoutSuccess());           // 4) refresh 실패 → 로그아웃
          }
        } else {
          dispatch(signoutSuccess());
        }
      }
    }
       

  useEffect(()=>{
    checkAuth();
  },[dispatch]);

  return (
    <>
      <AppRouter/>
    </>
  )
}

export default App
