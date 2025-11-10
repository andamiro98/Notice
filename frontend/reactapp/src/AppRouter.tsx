import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navber";
import {RefreshToken} from "./components/RefreshToken/RefreshToken";
import {Home} from "./pages/Home/Home";
import SignIn from"./pages/Sign/SignIn";
import {NoticeCreate} from "./pages/NoticeCreate/NoticeCreate";
import {NoticeUpdate} from "./pages/NoticeUpdate/NoticeUpdate";
import { SignUp } from "./pages/Sign/SignUp";
import {NotFound} from "./NotFound/NotFound"

function AppRouter(){
  return (
    <Router>
        <Navbar/>
        <RefreshToken/>
        <Routes>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/signin" element={<SignIn/>}></Route>
            <Route path="/signup" element={<SignUp/>}></Route>
            <Route path="/noticecreate" element={<NoticeCreate/>}></Route>
            <Route path="/noticeupdate/:id" element={<NoticeUpdate/>}></Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    </Router>
  )
}

export default AppRouter
