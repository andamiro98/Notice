import axios from "axios"

const APL_URL = "http://localhost:8080/api/auth";

// 로그인
export const signin = async (email: string, password: string) => {
  const response = await axios.post(
    `${APL_URL}/signin`,
    {email, password},
    {withCredentials: true} // httponly
  );

return response.data;
}


// 로그아웃
export const signout = async () => {
  await axios.post(
    `${APL_URL}/logout`,
    {},
    {withCredentials: true} // httponly
  );
}

// 사용자 정보
export const get_userinfo = async () => {
  const response = await axios.get(
    `${APL_URL}/user`,
    {withCredentials: true} // httponly
  );

return response.data;
}