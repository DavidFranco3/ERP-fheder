import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import "./DashboardCatalogos.scss";
import { Alert, Button, Col, Row, Card, Container, CardGroup, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
// Importacion de imagenes para los iconos de los menus
import LogoMaquinas from "../../../assets/png/menus/maquinas.png";
import LogoProveedores from "../../../assets/png/menus/proveedor.png";
import LogoInsumos from "../../../assets/png/menus/insumos.png";
import LogoProductos from "../../../assets/png/menus/catalogoProductos.png";
import LogoClientes from "../../../assets/png/menus/clientes.png";
import LogoMateriales from "../../../assets/png/menus/materiales.png";
import LogoDepartamentos from "../../../assets/png/menus/departamentos.png";
import LogoUsuarios from "../../../assets/png/menus/usuarios.png";
import LogoPigmento from "../../../assets/png/menus/pigmento.png";
import LogoEmpaques from "../../../assets/png/menus/empaques.png";
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../../api/auth";
import { toast } from "react-toastify";
import { obtenerUsuario } from "../../../api/usuarios";
import { LogGeneral } from "../../Logs/LogsSistema/LogsSistema";

function DashboardCatalogos(props) {
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
                            Catálogos
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
            <div className="grid grid-cols-5 gap-5">
                <ItemCard
                    path={'/Maquinas'}
                    logo={LogoMaquinas}
                    title={'Maquinas'}
                />
                <ItemCard
                    path={'/Proveedores'}
                    logo={LogoProveedores}
                    title={'Proveedores'}
                />
                <ItemCard
                    path={'/Insumos'}
                    logo={LogoInsumos}
                    title={'Insumos'}
                />
                <ItemCard
                    path={'/MatrizProductos'}
                    logo={LogoProductos}
                    title={'Productos'}
                />
                <ItemCard
                    path={'/Materiales'}
                    logo={LogoMateriales}
                    title={'Materiales'}
                />
                <ItemCard
                    path={'/Clientes'}
                    logo={LogoClientes}
                    title={'Clientes'}
                />
                <ItemCard
                    path={'/Departamentos'}
                    logo={LogoDepartamentos}
                    title={'Departamentos'}
                />
                <ItemCard
                    path={'/Usuarios'}
                    logo={LogoUsuarios}
                    title={'Usuarios'}
                />
                <ItemCard
                    path={'/Pigmento'}
                    logo={LogoPigmento}
                    title={'Pigmento'}
                />
                <ItemCard
                    path={'/Empaques'}
                    logo={LogoEmpaques}
                    title={'Empaques'}
                />
            </div>
        </>
    );
}

export default DashboardCatalogos;
