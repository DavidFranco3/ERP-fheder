import { useEffect } from 'react';
import { Navigate } from "react-router-dom";
import { getTokenApi, isExpiredToken, logoutApi } from "../../api/auth";
import { toast } from "react-toastify";
import { LogsInformativosLogout } from "../../components/Logs/LogsSistema/LogsSistema";

function Error404(props) {
    const { setRefreshCheckLogin } = props;

    console.log("error 404")

    // Cerrado de sesión automatico
    useEffect(() => {
        if (getTokenApi()) {
            if (isExpiredToken(getTokenApi())) {
                LogsInformativosLogout("Sesión finalizada", setRefreshCheckLogin)
                toast.warning("Sesión expirada");
                toast.success("Sesión cerrada por seguridad");
                logoutApi();
                setRefreshCheckLogin(true);
            }
        }
    }, []);
    // Termina cerrado de sesión automatico

    return (
        <>
            <Navigate to="/" />
        </>
    );
}

export default Error404;
