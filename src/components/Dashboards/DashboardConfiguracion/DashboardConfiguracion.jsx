import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import "./DashboardConfiguracion.scss";
import { Alert, Button, Col, Row, Card, Container, CardGroup, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
// Importacion de imagenes para los iconos de los menus
import LogoSucursales from "../../../assets/png/menus/sucursales.png";
import LogoAlmacen from "../../../assets/png/menus/almacenGeneral.png";
import LogoRazonSocial from "../../../assets/png/menus/razonSocial.png";
import LogoUnidadesMedida from "../../../assets/png/menus/unidadesMedida.png";
import LogoClasificacionMateriales from "../../../assets/png/menus/clasificacionMateriales.png";
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../../api/auth";
import { toast } from "react-toastify";

function DashboardConfiguracion(props) {
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
                            Configuración
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
            <div className="grid grid-cols-5 gap-5">
            <ItemCard
                    path={'/RazonesSociales'}
                    logo={LogoRazonSocial}
                    title={'Razones sociales'}
                />
                <ItemCard
                    path={'/Sucursales'}
                    logo={LogoSucursales}
                    title={'Sucursales'}
                />
                <ItemCard
                    path={'/GestionAlmacen'}
                    logo={LogoAlmacen}
                    title={'Gestión de almacenes'}
                />
                <ItemCard
                    path={'/UnidadesMedida'}
                    logo={LogoUnidadesMedida}
                    title={'Unidades de medida'}
                />
                <ItemCard
                    path={'/ClasificacionMateriales'}
                    logo={LogoClasificacionMateriales}
                    title={'Clasificacion de materiales'}
                />
            </div>
        </>
    );
}

export default DashboardConfiguracion;
