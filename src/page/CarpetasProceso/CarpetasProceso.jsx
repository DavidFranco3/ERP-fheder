import { useEffect } from 'react';
import { Alert, Button, Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { getTokenApi, isExpiredToken, logoutApi } from "../../api/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { withRouter } from "../../utils/withRouter";
import { LogsInformativosLogout } from "../../components/Logs/LogsSistema/LogsSistema";

function CarpetasProceso(props) {
    const { setRefreshCheckLogin } = props;

    // Para definir el enrutamiento
    const enrutamiento = useNavigate()

    // Define la ruta de registro
    const rutaRegistro = () => {
        enrutamiento("/RegistroCarpetasProceso")
    }

    const cierreAutomatico = () => {
        if (getTokenApi()) {
            if (isExpiredToken(getTokenApi())) {
                LogsInformativosLogout("Sesión finalizada", setRefreshCheckLogin)
                toast.warning("Sesión expirada");
                toast.success("Sesión cerrada por seguridad");
                logoutApi();
                setRefreshCheckLogin(true);
            }
        }
    }

    // Cerrado de sesión automatico
    useEffect(() => {
        cierreAutomatico();
    }, []);
    // Termina cerrado de sesión automatico

    const rutaRegreso = () => {
        enrutamiento("/DashboardProduccion")
    }

    return (
        <>
                <Alert>
                    <Row>
                        <Col xs={12} md={8}>
                            <h1>
                                Carpetas de proceso
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                            <Button
                                className="btnRegistroVentas"
                                title="Registrar una nueva carpeta de proceso"
                                onClick={() => {
                                    rutaRegistro()
                                }}
                            >
                                <FontAwesomeIcon icon={faCirclePlus} /> Registrar
                            </Button>
                            <Button
                                className="btnRegistroVentas"
                                title="Regresar al menú producción"
                                onClick={() => {
                                    rutaRegreso()
                                }}
                            >
                                <FontAwesomeIcon icon={faArrowCircleLeft} /> Regresar
                            </Button>
                        </Col>
                    </Row>
                </Alert>
        </>
    );
}

export default withRouter(CarpetasProceso);
