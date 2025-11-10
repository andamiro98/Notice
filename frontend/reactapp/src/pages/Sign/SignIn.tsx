import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { get_userinfo, signin } from "../../services/authService";
import { signSuccess } from "../../store/authSlice";
import "./AuthForm.css";

function SignIn() {

  interface SignInForm {
  email: string;
  password: string;
};

  const [form, setForm] = useState<SignInForm>({ email: "", password: "" });
  const [loading, setLoding] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async(e:FormEvent) =>{
    setLoding(true);
    e.preventDefault(); // 새로고침 방지 
    
    try{
      await signin(form.email, form.password);
      const userData = await get_userinfo();
      dispatch(signSuccess(userData));
      setLoding(false);
      navigate("/")
    }catch(err){
      console.log("Error:",err)
      alert("아이디 또는 비밀번호 오류")
      navigate("/")
    }
  }

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="auth-title">로그인</h1>

        <label className="auth-label">
          이메일
          <input
            className="auth-input"
            type="email"
            name="email"
            value={form.email}
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

        <button className="auth-btn primary" type="submit" disabled={loading}>
          {loading ? "로그인 중…" : "로그인"}
        </button>

        <p className="auth-subtext">
          아직 계정이 없나요? <Link className="auth-link" to="/signup">회원가입</Link>
        </p>
      </form>
    </div>
    )
  }

export default SignIn