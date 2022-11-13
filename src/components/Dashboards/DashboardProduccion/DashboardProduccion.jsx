import { useState, useEffect } from 'react';
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import { useHistory } from "react-router-dom";
import ImagenPanel from "../../../assets/svg/panelPrincipal.svg";

import "./DashboardProduccion.scss";
import { Alert, Button, Col, Row, Card, Container, CardGroup, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";

// Importacion de imagenes para los iconos de los menus
import LogoProduccion from "../../../assets/png/menus/produccion.png";
import LogoCarpeta from "../../../assets/png/menus/carpetaProceso.png";
import LogoEtiqueta from "../../../assets/png/menus/etiquetaPT.png";
import LogoIdentificador from "../../../assets/png/menus/identificadorMM.png";
import LogoParametros from "../../../assets/png/menus/parametros.png";
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../../api/auth";
import { toast } from "react-toastify";
import { obtenerUsuario } from "../../../api/usuarios";
import { LogGeneral } from "../../Logs/LogsSistema/LogsSistema";

function DashboardProduccion(props) {
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
            <LayoutPrincipal setRefreshCheckLogin={setRefreshCheckLogin}>
                <Alert>
                    <Row>
                        <Col xs={12} md={8}>
                            <h1>
                                Producción
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
                <div className="grid grid-cols-5 gap-3">
                    <ItemCard
                        path={'/ReporteProduccion'}
                        logo={LogoProduccion}
                        title={'Reporte de producción'}
                    />
                    <ItemCard
                        path={'/CarpetasProceso'}
                        logo={LogoCarpeta}
                        title={'Carpetas de proceso'}
                    />
                    <ItemCard
                        path={'/IdentificacionPT'}
                        logo={LogoEtiqueta}
                        title={'Etiqueta de identificación PT'}
                    />
                    <ItemCard
                        path={'/MaterialMolido'}
                        logo={LogoIdentificador}
                        title={'Id. de material molido'}
                    />
                    <ItemCard
                        path={'/ControlParametrosMaquina'}
                        logo={LogoParametros}
                        title={'Control de parametros de maquina'}
                    />
                </div>
            </LayoutPrincipal>
        </>
    );
}

export default DashboardProduccion;
