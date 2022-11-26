import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import ImagenPanel from "../../../assets/svg/panelPrincipal.svg";

import "./DashboardAlmacenes.scss";
import { Alert, Button, Col, Row, Card, Container, CardGroup, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";

// Importacion de imagenes para los iconos de los menus
import LogoCompras from "../../../assets/png/menus/ordenCompra.png";
import LogoMateriasPrimas from "../../../assets/png/menus/materiasPrimas.png";
import LogoProductoTerminado from "../../../assets/png/menus/productoTerminado.png";
import LogoAlmacenGeneral from "../../../assets/png/menus/almacenGeneral.png";
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../../api/auth";
import { toast } from "react-toastify";
import { obtenerUsuario } from "../../../api/usuarios";
import { LogGeneral } from "../../Logs/LogsSistema/LogsSistema";

function DashboardAlmacenes(props) {
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

    const rutaRegreso = () => {
        enrutamiento.push("/")
    }

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

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Almacen
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            onClick={() => {
                                rutaRegreso()
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowCircleLeft} /> Regresar
                        </Button>
                    </Col>
                </Row>
            </Alert>
            <div className="grid grid-cols-4 gap-3">
                <ItemCard
                    path={'/AlmacenMP'}
                    logo={LogoMateriasPrimas}
                    title={'Almacen de materia prima'}
                />
                <ItemCard
                    path={'/AlmacenPT'}
                    logo={LogoProductoTerminado}
                    title={'Almacen de producto terminado'}
                />
                <ItemCard
                    path={'/AlmacenGeneral'}
                    logo={LogoAlmacenGeneral}
                    title={'Almacen general'}
                />
                <ItemCard
                    path={'/Compras/AlmacenMP'}
                    logo={LogoCompras}
                    title={'Compras MP'}
                />
            </div>
        </>
    );
}

export default DashboardAlmacenes;
