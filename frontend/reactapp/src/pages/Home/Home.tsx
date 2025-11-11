import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux";
import type {RootState} from "../../store/"
import { useNavigate} from "react-router-dom";
import axios from "axios";
import { NoticeItem, type Notice} from "../../components/Notice/NoticeItem";
import "../../assets/main.css"
import "../../NotFound/NotFound.css"
 
export const Home = () => {

  const[notices,setNotices] = useState([]);
  const role = useSelector((state : RootState) => state.auth.role);
  const nickname = useSelector((state : RootState) => state.auth.nickname);
  const isauthenticated = useSelector((state : RootState) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  // useEffect(()=>{
  //   if(!role || (role !== "ADMIN" && role !==  "MANAGER"))
  //   {
  //     navigate("/")
  //   }
  // },[role,navigate])

  useEffect(()=>{
    const getNotice = async() =>{
      try{
        const response = await axios.get("http://3.36.1.167:8080/api/notice",{
          withCredentials:true,
        });
        setNotices(response.data);
      }catch(e){
        console.log("Error:", e)
      }
    }
    getNotice();
  },[])

const onDelete = async(id:string) =>{
  try{
    await axios.delete(`http://3.36.1.167:8080/api/notice/${id}`,{
        withCredentials:true,
      });
      
      setNotices(notices.filter((n:Notice) => n.id !== id))
      alert("삭제완료")
  }catch(e)
  {
    console.log("error: ", e)
  }
}

const onUpdate = (id:string) =>{
  navigate(`/noticeupdate/${id}`)
}

const handleNoticeWrite = () =>{
  navigate("/noticecreate")
}

const canManageMent = role === 'ADMIN';
const canEdit = (notice:Notice) => notice.nickname == nickname;

const toTs = (x: string | number) => (typeof x === "number" ? x : Date.parse(x));

  const sorted = useMemo(
    () => [...notices].sort((a:Notice, b:Notice) => toTs(b.createdat) - toTs(a.createdat)),
    [notices]
  );

  return (
    <main className="container">
      <section className="section">
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12}}>

        <h2 className="hero-title" style={{ marginBottom: 12 }}>공지사항</h2>
        {isauthenticated?(
          <button onClick={handleNoticeWrite}  className="btn" >
            공지 작성
          </button>
        ):(
          <>
          <p className="nf-title"
          style={{fontSize:"15px", cursor:"default"}}> 공지 작성을 위해서는 로그인이 필요합니다.</p>
          </>
        )
        }
        </div>
        
        <div>
          {notices.length > 0 ? (
            <>
            {sorted.map((n:Notice) => 
            <NoticeItem 
              key={n.id} 
              notice={n} 
              onDelete={() => onDelete(n.id)}
              onUpdate={()=> onUpdate(n.id)}
              canEdit={canEdit(n)}
              canManageMent = {canManageMent}/>
          )}
          </>
          ):(
            <>
            <main className="nf-root" role="main" aria-label="404 Not Found">
              <div className="nf-box">
                <p className="nf-title">게시글이 존재하지 않습니다.</p>
              </div>
            </main>
            </>
          )
          }
        </div>
      </section>
    </main>
  );
}