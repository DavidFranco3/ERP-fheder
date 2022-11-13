import {useEffect} from 'react';
import LayoutPrincipal from "../../layout/layoutPrincipal";
import {Alert, Button, Col, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus, faPlus, faUsers} from "@fortawesome/free-solid-svg-icons";
import {getTokenApi, isExpiredToken, logoutApi} from "../../api/auth";
import {toast} from "react-toastify";
import { withRouter, useHistory } from "react-router-dom";

function Logistica(props) {
    const { setRefreshCheckLogin } = props;
    
    const enrutamiento = useHistory();
    
    // Para definir la ruta de registro de los productos
    const rutaRegistraLogistica = () => {
        enrutamiento.push("/RegistroLogistica")
    }

    // Cerrado de sesión automatico
    useEffect(() => {
        if(getTokenApi()) {
            if(isExpiredToken(getTokenApi())) {
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
            <LayoutPrincipal setRefreshCheckLogin={setRefreshCheckLogin}>
                <Alert>
                    <Row>
                        <Col xs={12} md={8}>
                            <h1>
                                Logística
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                            <Button
                                className="btnRegistroVentas"
                                onClick={() => {
                                    rutaRegistraLogistica()
                                }}
                            >
                                <FontAwesomeIcon icon={faCirclePlus} /> Nuevo registro
                            </Button>
                        </Col>
                    </Row>
                </Alert>
            </LayoutPrincipal>
        </>
    );
}

export default withRouter(Logistica);
