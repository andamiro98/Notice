import axios,{AxiosError} from "axios";
import "./AuthForm.css"
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";


export const SignUp = () => {
    interface SignUpForm  {
        nickname: string;
        email: string;
        password: string;
        confirm: string;
    }

    const [form, setForm] = useState<SignUpForm>({
    nickname: "",
    email: "",
    password: "",
    confirm: ""
  });

  const navigate = useNavigate();
  

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e:FormEvent) => {
    e.preventDefault();
    setLoading(!loading);

    const { nickname, email, password, confirm } = form;

    if (password !== confirm) {
      alert("비밀번호 확인이 일치하지 않습니다.");
    return console.warn("비밀번호 확인이 일치하지 않습니다.");
  }

    try{    
      await axios.post("http://3.36.1.167:8080/api/auth/signup", {
        email,
        password,
        nickname
      })
      alert("회원가입 성공하였습니다.");
      setLoading(!loading);
      navigate("/signin")
    } catch(err: unknown) {
      if (axios.isAxiosError(err)) {
        // (선택) 서버가 보내는 에러 바디 타입이 있다면 제네릭으로 명시
        const axErr = err as AxiosError<{ message?: string; code?: string }>;

        // 2) 응답이 있는지 확인 후 status 체크
        if (axErr.response && axErr.response?.status === 409) {
          // 중복 아이디 처리
          alert("이미 사용 중인 아이디입니다.");
        } else{
          alert("회원가입 실패");
          console.log("signUp ERR : " + err)
        }
    }}
  }





  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="auth-title">회원가입</h1>

        <label className="auth-label">
          닉네임
          <input
            className="auth-input"
            type="text"
            name="nickname"
            aria-describedby="nickname-error"
            onChange={(e) => setForm({ ...form, nickname: e.target.value })}
            required
          />
        </label>

        <label className="auth-label">
          이메일
          <input
            className="auth-input"
            type="email"
            name="email"
             onChange={(e) => setForm({ ...form, email: e.target.value })}
            aria-describedby="email-error"
            required
          />
        </label>

        <label className="auth-label">
          비밀번호
          <input
            className="auth-input"
            type="password"
            name="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            aria-describedby="password-error"
            required
          />
        </label>

        <label className="auth-label">
          비밀번호 확인
          <input
            className="auth-input"
            type="password"
            name="confirm"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            aria-describedby="confirm-error"
            required
          />
        </label>

        <button className="auth-btn primary" type="submit" disabled={loading}>
          {loading ? "가입 중…" : "가입하기"}
        </button>

        <p className="auth-subtext">
          이미 계정이 있나요? <Link className="auth-link" to="/login">로그인</Link>
        </p>
      </form>
    </div>
  )
}
