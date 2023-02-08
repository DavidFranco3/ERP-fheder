import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import "./DashboardFinanzas.scss";
import { Alert, Button, Col, Row, Card, Container, CardGroup, Image, Badge } from "react-bootstrap";
// Importacion de imagenes para los iconos de los menus
import LogoCuentasCobrar from "../../../assets/png/menus/cuentasPorCobrar.png";
import { getTokenApi, isExpiredToken, logoutApi } from "../../../api/auth";
import { toast } from "react-toastify";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowCircleLeft} from "@fortawesome/free-solid-svg-icons";

function DashboardFinanzas(props) {
    const { setRefreshCheckLogin } = props;

    const enrutamiento = useHistory();

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

    // Define las rutas

    const goTo = (ruta) => enrutamiento.push(ruta);

    const ItemCard = ({ path, logo, title }) => (
        <Card className="contenidoCentrado" >
            <Card.Body onClick={() => goTo(path)}>
                <div className="flex flex-col items-center justify-center">
                    <Image title={title} alt={title} src={logo} style={{ width: '95px' }} />
                    <span className="inline-block text-lg font-normal">{title}</span>
                </div>
            </Card.Body>
        </Card>
    )

    const rutaRegreso = () => {
        enrutamiento.push("/")
    }

    return (
        <>
            <Alert>
                    <Row>
                        <Col xs={12} md={8}>
                            <h1>
                                Ventas
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                            <Button
                                className="btnRegistroVentas"
                                title="Regresar al menu principal"
                                onClick={() => {
                                    rutaRegreso()
                                }}
                            >
                                <FontAwesomeIcon icon={faArrowCircleLeft} /> Regresar
                            </Button>
                        </Col>
                    </Row>
                </Alert>
                <div className="grid grid-cols-1 gap-1">
                    <ItemCard
                        path={'/CuentasPorCobrar'}
                        logo={LogoCuentasCobrar}
                        title={'Cuentas por cobrar'}
                    />
                </div>
        </>
    );
}

export default DashboardFinanzas;
