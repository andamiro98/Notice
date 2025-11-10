import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"


const store = configureStore({
    reducer:{
        auth:authReducer, 
        // authReducer는 로그인할때 로그인 인증정보 (ID,PW) 같은 정보들을 
        // 관리하는 리듀서 파일 만들기
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;



export default store;