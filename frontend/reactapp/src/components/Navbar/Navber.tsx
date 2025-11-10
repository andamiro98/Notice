import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import {signout} from"../../services/authService.ts"
import "./Navber.css"
import "../../pages/Sign/AuthForm.css"
import type { RootState } from "../../store"
import {signoutSuccess} from "../../store/authSlice.ts"
import "../../NotFound/NotFound.css"

function Navbar() {
  const isAuthenticated = useSelector((state:RootState) => state.auth.isAuthenticated)
  const nickname = useSelector((state:RootState) => state.auth.nickname)

  const dispatch = useDispatch();

  const handleLogout = () => {    
    signout();
    dispatch(signoutSuccess());
  }

  return (
     <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="nf-title" style={{fontSize:"20px"}} >NOTICE</Link>
        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <p className="nav-link">{nickname}</p>
              <button className="nav-link btn-primary" onClick={handleLogout}>로그아웃</button>
            </>
          ):(
            <>
              <Link to="/signin" className="nav-link">로그인</Link>
              <Link to="/signup" className="nav-link btn-primary">회원가입</Link>
            </>
          
          )
          }
          
        </div>
      </div>
    </nav>
  )
}

export default Navbar