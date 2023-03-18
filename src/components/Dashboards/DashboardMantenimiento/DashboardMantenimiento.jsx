import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import ImagenPanel from "../../../assets/svg/panelPrincipal.svg";
import "./DashboardMantenimiento.scss";
import { Alert, Button, Col, Row, Card, Container, CardGroup, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
// Importacion de imagenes para los iconos de los menus
import LogoMantenimiento from "../../../assets/png/menus/mantenimiento.png";
import LogoEtiqueta from "../../../assets/png/menus/etiquetaPT.png";
import LogoLayout from "../../../assets/png/menus/maquinaria.png";
import LogoInventario from "../../../assets/png/menus/requisiciones.png";
import LogoMoldes from "../../../assets/png/menus/primeraPieza.png";
import LogoPreventivo from "../../../assets/png/menus/produccion.png";
import LogoES from "../../../assets/png/menus/entradaSalida.png";
import LogoLista from "../../../assets/png/menus/hojaLiberacion.png";
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../../api/auth";
import { toast } from "react-toastify";
import { obtenerUsuario } from "../../../api/usuarios";
import { LogGeneral, LogsInformativosLogout } from "../../Logs/LogsSistema/LogsSistema";

function DashboardMantenimiento(props) {
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
                                Mantenimiento
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
                <div className="grid grid-cols-4 gap-3">
                    <ItemCard
                        path={'/Mantenimiento'}
                        logo={LogoMantenimiento}
                        title={'Orden de mantenimiento'}
                    />
                    <ItemCard
                        //path={'/'}
                        logo={LogoLayout}
                        title={'Layout de maquinas'}
                    />
                    <ItemCard
                        path={'/InventarioMaquinas'}
                        logo={LogoInventario}
                        title={'Inventario de maquinas'}
                    />
                    <ItemCard
                        path={'/InventarioMoldes'}
                        logo={LogoMoldes}
                        title={'Inventario de moldes'}
                    />
                    <ItemCard
                        path={'/MantenimientoPreventivo'}
                        logo={LogoPreventivo}
                        title={'Programa de mantenimiento preventivo'}
                    />
                    <ItemCard
                        path={'/EntradaSalidaMoldes'}
                        logo={LogoES}
                        title={'Entradas y salidas de moldes'}
                    />
                    <ItemCard
                        path={'/VerificacionMantenimientos'}
                        logo={LogoLista}
                        title={'Lista de verificacion de mantenimientos preventivos'}
                    />
                </div>
        </>
    );
}

export default DashboardMantenimiento;
