import { Link } from "react-router-dom";
import "./NotFound.css"
export const NotFound = () => {
  //const { pathname } = useLocation();

  return (
    <main className="nf-root" role="main" aria-label="404 Not Found">
        <div className="nf-box">
            <Link to="/" className="nf-title">404 Not Found</Link>
        </div>
    </main>
  );
}
