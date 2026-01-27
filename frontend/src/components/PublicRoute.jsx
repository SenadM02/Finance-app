import { Navigate } from 'react-router-dom'
import { ROUTES } from '../routes.jsx'

const PublicRoute = ({ children }) => {
    const token = localStorage.getItem("authToken");

    if(token){
        return <Navigate to={ROUTES.HOME} replace />
    }

    return children;
};

export default PublicRoute;