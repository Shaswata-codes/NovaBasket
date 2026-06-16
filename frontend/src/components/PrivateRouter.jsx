import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => {
    return !!localStorage.getItem("access_token");
};

export default function PrivateRouter() {
    return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
}
