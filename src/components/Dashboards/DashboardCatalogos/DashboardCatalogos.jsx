import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "./DashboardCatalogos.scss";
import { Alert, Button, Col, Row, Card, Container, CardGroup, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
// Importacion de imagenes para los iconos de los menus
import LogoMaquinas from "../../../assets/png/menus/maquinas.png";
import LogoProveedores from "../../../assets/png/menus/proveedor.png";
import LogoProductos from "../../../assets/png/menus/catalogoProductos.png";
import LogoClientes from "../../../assets/png/menus/clientes.png";
import LogoMateriales from "../../../assets/png/menus/materiales.png";
import LogoDepartamentos from "../../../assets/png/menus/departamentos.png";
import LogoUsuarios from "../../../assets/png/menus/usuarios.png";
import LogoMoldes from "../../../assets/png/menus/moldes.png";
import { getTokenApi, isExpiredToken, logoutApi } from "../../../api/auth";
import { toast } from "react-toastify";

function DashboardCatalogos(props) {
    const { setRefreshCheckLogin } = props;

    const enrutamiento = useNavigate();

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
                            Catálogos
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
            <div className="grid grid-cols-4 gap-4">
                <ItemCard
                    path={'/Maquinas'}
                    logo={LogoMaquinas}
                    title={'Maquinaria'}
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
                    path={'/Proveedores'}
                    logo={LogoProveedores}
                    title={'Proveedores'}
                />
                <ItemCard
                    path={'/EtiquetasMoldes'}
                    logo={LogoMoldes}
                    title={'Moldes'}
                />
            </div>
        </>
    );
}

export default DashboardCatalogos;
