import { Navigate } from 'react-router-dom'
import { ROUTES } from '../routes.jsx'

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("authToken");

    if(!token){
        return <Navigate to={ROUTES.LOGIN} replace />
    }

    return children;
};

export default ProtectedRoute;