import { useState, useEffect } from 'react';
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import { useHistory } from "react-router-dom";

import "./DashboardCalidad.scss";
import { Alert, Button, Col, Row, Card, Container, CardGroup, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
// Importacion de imagenes para los iconos de los menus
import LogoCalidad from "../../../assets/png/menus/calidad.png";
import LogoIdentificacion from "../../../assets/png/menus/identificadorMM.png";
import LogoInspeccionPieza from "../../../assets/png/menus/inspeccionPieza.png";
import LogoPrimeraPieza from "../../../assets/png/menus/primeraPieza.png";
import LogoAlertas from "../../../assets/png/menus/alertasCalidad.png";
import LogoNoConformidad from "../../../assets/png/menus/noConformidad.png";
import LogoLiberacion from "../../../assets/png/menus/hojaLiberacion.png";
import LogoFichasTecnicas from "../../../assets/png/menus/fichasTecnicas.png";
import LogoCertificados from "../../../assets/png/menus/certificadosCalidad.png";
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../../api/auth";
import { toast } from "react-toastify";
import { obtenerUsuario } from "../../../api/usuarios";
import { LogGeneral } from "../../Logs/LogsSistema/LogsSistema";

function DashboardCalidad(props) {
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
                                Calidad
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
                <div className="grid grid-cols-3 gap-3">
                    <ItemCard
                        path={'/Calidad'}
                        logo={LogoCalidad}
                        title={'Inspeccion de calidad de material'}
                    />
                    <ItemCard
                        path={'/StatusMaterial'}
                        logo={LogoIdentificacion}
                        title={'Identificación de estatus de material'}
                    />
                    <ItemCard
                        path={'/InspeccionPieza'}
                        logo={LogoInspeccionPieza}
                        title={'Registro de inspección de pieza'}
                    />
                    <ItemCard
                        path={'/EtiquetaPrimeraPieza'}
                        logo={LogoPrimeraPieza}
                        title={'Registro de primera pieza'}
                    />
                    <ItemCard
                        path={'/AlertasCalidad'}
                        logo={LogoAlertas}
                        title={'Alertas de calidad'}
                    />
                    <ItemCard
                        path={'/NoConformidad'}
                        logo={LogoNoConformidad}
                        title={'Control de no conformidad'}
                    />
                    <ItemCard
                        path={'/LiberacionProductoProceso'}
                        logo={LogoLiberacion}
                        title={'Hoja de liberación de producto y proceso'}
                    />
                    <ItemCard
                        path={'/FichaTecnica'}
                        logo={LogoFichasTecnicas}
                        title={'Fichas tecnicas'}
                    />
                    <ItemCard
                        path={'/CertificadosCalidad'}
                        logo={LogoCertificados}
                        title={'Certificados de calidad'}
                    />
                </div>
            </LayoutPrincipal>
        </>
    );
}

export default DashboardCalidad;
