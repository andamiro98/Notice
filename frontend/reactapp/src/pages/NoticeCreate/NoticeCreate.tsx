import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import type { RootState } from "../../store";
import { useEffect, useState, type FormEvent } from "react";
import "./NoticeCreate.css"
import axios from "axios";

type FormState = {
  title: string;
  content: string;   // ← 서버 필드명에 맞춰 content로 통일
  nickname: string;
  createdat: string; // 화면 표시용
};


export const NoticeCreate = () => {
  const navigate = useNavigate();


  const nickname = useSelector((s: RootState) => s.auth.nickname);
  const userEmail = useSelector((state : RootState) => state.auth.email);

  //const role = useSelector((s: RootState) => s.auth.role);
  
  const [form, setForm] = useState<FormState>({ 
    title: "", 
    content: "",
    nickname: "",
    createdat: new Date().toISOString(), // Date → ISO 문자열 변환

  });
  //const [loading, setLoading] = useState(false);


 const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      nickname: form.nickname,
      email: userEmail
    };

  useEffect(() => {
    if (nickname) {
      setForm(prev => ({ ...prev, nickname }));
    }
  }, [nickname]);

  useEffect(() => {
  // 한국 시간 형식 지정
  const formatter = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Seoul",
  });

    // 즉시 1회 세팅(첫 렌더 직후 빈칸 방지)
    const tick = () =>
      setForm(prev => ({ ...prev, createdat: formatter.format(new Date()) }));
    tick();

    // 1초마다 갱신
    const id = setInterval(tick, 1000);

    // 언마운트 시 타이머 정리(메모리 누수 방지)
    return () => clearInterval(id);
  }, []);





  const onsubmit = async(e:FormEvent) =>{
    e.preventDefault();

    try{
      await axios.post(
        "http://localhost:8080/api/notice",
        payload
      )
      alert("작성 완료")
      navigate("/")

    }catch(err){
      console.log("err:" + err)
      alert("작성 실패")
    }

    
  }


  return (
    <main className="container">
      <form className="nc-card" noValidate>
        <header className="nc-header">
          <h1 className="nc-title">공지 작성</h1>
          <div className="nc-actions">
            <Link to="/" className="btn">취소</Link>
            <button type="submit" className="btn primary" onClick={onsubmit} /*disabled={loading}*/>
              {/* {loading ? "등록 중…" : "등록"} */}
              등록
            </button>
          </div>
        </header>

        <label className="nc-label">
          제목
          <input
            className="nc-input"
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            aria-describedby="title-error"
            placeholder="제목을 입력하세요"
            required
          />
        </label>

        <label className="nc-label">
          내용
          <textarea
            className="nc-textarea"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            aria-describedby="body-error"
            placeholder="내용을 입력하세요"
            rows={10}
            required
          />
        </label>

        <p className="nc-meta">
          작성자: <strong>{nickname ?? "-"}</strong>
        </p>
        <p className="nc-meta">
          작성시간: <strong>{form.createdat}</strong>
        </p>
      </form>
    </main>
  );
}
