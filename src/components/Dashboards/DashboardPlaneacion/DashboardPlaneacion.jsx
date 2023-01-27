import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import ImagenPanel from "../../../assets/svg/panelPrincipal.svg";
import "./DashboardPlaneacion.scss";
import { Alert, Button, Col, Row, Card, Container, CardGroup, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
// Importacion de imagenes para los iconos de los menus
import LogoPlaneacion from "../../../assets/png/menus/planeacion.png";
import LogoMatriz from "../../../assets/png/menus/catalogoProductos.png";
import LogoPedido from "../../../assets/png/menus/asignacionPedido.png";
import LogoMateriales from "../../../assets/png/menus/materiales.png";
import LogoProduccion from "../../../assets/png/menus/produccion.png";
import LogoMes from "../../../assets/png/menus/mes.png";
import LogoMaquina from "../../../assets/png/menus/maquinaria.png";
import LogoRequerimientos from "../../../assets/png/menus/requerimiento.png";
import LogoProgramaProduccion from "../../../assets/png/menus/programaProduccion.png";
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../../api/auth";
import { toast } from "react-toastify";
import { obtenerUsuario } from "../../../api/usuarios";
import { LogGeneral } from "../../Logs/LogsSistema/LogsSistema";

function DashboardPlaneacion(props) {
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
                            Planeacion
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
                    path={'/RequerimientosPlaneacion'}
                    logo={LogoRequerimientos}
                    title={'Planeación'}
                />
                <ItemCard
                    path={'/Produccion'}
                    logo={LogoProduccion}
                    title={'Ordenes de producción'}
                />
                <ItemCard
                    path={'/Semana'}
                    logo={LogoMes}
                    title={'Programa de producción'}
                />
                <ItemCard
                    path={'/Maquinaria'}
                    logo={LogoMaquina}
                    title={'Programa de producción maquina'}
                />
                <ItemCard
                    path={'/AsignacionPedido'}
                    logo={LogoPedido}
                    title={'Asignaciones de pedido'}
                />
                <ItemCard
                    path={'/ProgramaProduccion'}
                    logo={LogoProgramaProduccion}
                    title={'Programa de producción'}
                />
            </div>
        </>
    );
}

export default DashboardPlaneacion;
