import react from 'react';
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
            <button className="logout" onClick={logOut}>Log out</button>
        </>
    );
}

export default Homepage;