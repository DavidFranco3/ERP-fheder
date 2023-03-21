import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "./DashboardCompras.scss";
import { Alert, Button, Col, Row, Card, Container, CardGroup, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
// Importacion de imagenes para los iconos de los menus
import LogoCompras from "../../../assets/png/menus/ordenCompra.png";
import LogoRequisicion from "../../../assets/png/menus/requisiciones.png";
import LogoRecepciones from "../../../assets/png/menus/recepcion.png"
import LogoProveedores from "../../../assets/png/menus/proveedor.png";
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../../api/auth";
import { toast } from "react-toastify";
import {  LogsInformativosLogout } from "../../Logs/LogsSistema/LogsSistema";

function DashboardCompras(props) {
    const { setRefreshCheckLogin } = props;

    const enrutamiento = useNavigate();

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

    // Define las rutas

    const rutaRegreso = () => {
        enrutamiento("/")
    }

    const goTo = (ruta) => enrutamiento(ruta);

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

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Compras
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
            <div className="grid grid-cols-3 gap-3">
                <ItemCard
                    path={'/Compras'}
                    logo={LogoCompras}
                    title={'Orden de compra'}
                />
                <ItemCard
                    path={'/Requisiciones'}
                    logo={LogoRequisicion}
                    title={'Requisiciones'}
                />
                <ItemCard
                    path={'/RecepcionMaterialInsumos'}
                    logo={LogoRecepciones}
                    title={'Recepcion de materiales e insumos'}
                />
            </div>
        </>
    );
}

export default DashboardCompras;
