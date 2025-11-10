import { createSlice } from "@reduxjs/toolkit"

export type Role = "ADMIN" | "USER" | "MANAGER" | null;


export interface AuthState {
  isAuthenticated: boolean;
  role: Role;
  nickname: string | null;
  email: string | null;
}

export const initialState:AuthState = {
    isAuthenticated : false, // 로그인 인증 여부
    role : null, // 사용자 권한
    nickname : null, // 사용자 이름
    email : null,
}


const authSlice = createSlice({
    name:'auth', // 로그인 인증 기능 slice
    initialState,
    reducers:{
        // 로그인 성공시 사용자 정보 저장 (토큰 X)
        signSuccess : (state, action) => {
            // distptch(loginSuccess({role:"admin",username:"이름"}))
            // action이라는 주문 요청서를 가지고 dispatch를 통해서 리덕스 라이브러리에 전달

            state.isAuthenticated = true;
            state.role = action.payload.role;
            state.nickname = action.payload.nickname;
            state.email = action.payload.email;
        },

        // 로그아웃시 초기화
        signoutSuccess:(state) => {
            state.isAuthenticated = false;
            state.role = null;
            state.nickname = null;
            state.email = null;
        }
    }

})

export const {signSuccess, signoutSuccess} = authSlice.actions;
export default authSlice.reducer;