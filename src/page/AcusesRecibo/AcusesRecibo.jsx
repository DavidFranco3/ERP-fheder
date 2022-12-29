import { useEffect } from 'react';
import { Alert, Button, Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { withRouter, useHistory } from "react-router-dom";
import { getSucursal, getTokenApi, isExpiredToken, logoutApi } from '../../api/auth';
import { toast } from "react-toastify";

function AcusesRecibo(props) {
    const { setRefreshCheckLogin } = props;

    // Cerrado de sesión automatico
    useEffect(() => {
        if (getTokenApi()) {
            if (isExpiredToken(getTokenApi())) {
                toast.warning("Sesión expirada");
                toast.success("Sesión cerrada por seguridad");
                logoutApi();
                setRefreshCheckLogin(true);
            }
        }
    }, []);
    // Termina cerrado de sesión automatico

    const enrutamiento = useHistory();

    // Para definir la ruta de registro de los productos
    const rutaRegistraAcusesRecibo = () => {
        enrutamiento.push("/RegistraAcusesRecibo")
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Acuses de recibo
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            onClick={() => {
                                rutaRegistraAcusesRecibo()
                            }}
                        >
                            <FontAwesomeIcon icon={faCirclePlus} /> Registrar nuevo acuse
                        </Button>
                    </Col>
                </Row>
            </Alert>
        </>
    );
}

export default withRouter(AcusesRecibo);
