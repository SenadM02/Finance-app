import "./Homepage.css"
import "../App.css"
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes.jsx"

function Homepage() {
    const navigate = useNavigate();
    const logOut = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userEmail")
        navigate(ROUTES.LOGIN);
    }
    return (
        <>
        <div className="homepage">
            <nav className="navbar">
                <div className="buttons">
                    <button className="settings">Settings</button>
                    <button className="trans">Transactions</button>
                    <button className="setup">Setup</button>
                </div>
                
                <button className="logout" onClick={logOut}>Log out</button>
            </nav>
        </div> 
        </>
    );
}

export default Homepage;