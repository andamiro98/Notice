import { useEffect, useState } from "react";
import { useParams, useNavigate} from "react-router-dom";
import axios from "axios";

type UpdateNotice = {
  title : string,
  content : string,
  nickname : string,
};

export const NoticeUpdate = () => {

  const [title,setTitle] = useState("");
  const [content,setContent] = useState("");
  const [nickname,setNickname] = useState("");
  const {id} = useParams();

  const navigate = useNavigate();


  useEffect(() => {
    const fetchNotice = async() => {
      try{
        const res = await axios.get(
          `http://3.36.1.167:8080/api/notice/${id}`,
          { withCredentials: true}
        );
        const {title, content, nickname} = res.data;
        setTitle(title);
        setContent(content);
        setNickname(nickname);
      }catch(err){
        console.log("err :" + err)
        alert("기존 데이터를 불러오는데 실패")
        navigate(-1);
      }
    };
    fetchNotice();
  },[id])

  
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatenotice : UpdateNotice ={
      title, 
      content, 
      nickname, 
    };

    try{
      await axios.put(
        `http://3.36.1.167:8080/api/notice/${id}`,
         updatenotice,
         {withCredentials:true}
      )
      alert("수정이 완료되었습니다.")
    }catch(err){
      console.log("err:"+ err)
    }
    
    navigate(-1);
  };

  return (
    <main className="container">
      <form className="nc-card" onSubmit={onSubmit} noValidate>
        <header className="nc-header">
          <h1 className="nc-title">공지 수정</h1>
          <div className="nc-actions">
            <button type="button" className="btn" onClick={() => navigate(-1)}>취소</button>
            <button type="submit" className="btn primary">저장</button>
          </div>
        </header>

        <label className="nc-label">
          제목
          <input
            className="nc-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            required
          />
        </label>

        <label className="nc-label">
          내용
          <textarea
            className="nc-textarea"
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            required
          />
        </label>

        <p className="nc-meta">
          작성자: <strong>@{nickname}</strong>
        </p>
      </form>
    </main>
  );
}
