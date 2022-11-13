import { useState, useEffect } from 'react';
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import { useHistory } from "react-router-dom";
import ImagenPanel from "../../../assets/svg/panelPrincipal.svg";

import "./DashboardProductos.scss";
import { Alert, Button, Col, Row, Card, Container, CardGroup, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUsers } from "@fortawesome/free-solid-svg-icons";

// Importacion de imagenes para los iconos de los menus
import LogoProductos from "../../../assets/png/menus/catalogoProductos.png";
import LogoMateriales from "../../../assets/png/menus/materiales.png";
import LogoMatriz from "../../../assets/png/menus/matriz.png";
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../../api/auth";
import { toast } from "react-toastify";
import { obtenerUsuario } from "../../../api/usuarios";
import { LogGeneral } from "../../Logs/LogsSistema/LogsSistema";

function DashboardProductos(props) {
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

    const rutaProductos = () => {
        enrutamiento.push("/CatalogoProductos")
    }

    const rutaMateriales = () => {
        enrutamiento.push("/Materiales")
    }

    const rutaMatriz = () => {
        enrutamiento.push("/MatrizProductos")
    }

    return (
        <>
            <LayoutPrincipal className="Dashboard" paginaSeleccionada="Dashboard" setRefreshCheckLogin={setRefreshCheckLogin}>
                <Container className="gruposOpciones">
                    <div className="subeFotoPerfil">
                        <h3 className="textoFotoPerfil">Productos</h3>
                    </div>
                    {/* Primer grupo */}
                    <CardGroup>
                        <Card>
                            <Card.Body>
                                <div className="contenidoCentrado">
                                    <Image
                                        src={LogoMatriz}
                                        width="100px"
                                        onClick={() => {
                                            rutaMatriz()
                                        }}
                                    />
                                    Matriz de productos
                                </div>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Body>
                                <div className="contenidoCentrado">
                                    <Image
                                        src={LogoMateriales}
                                        width="100px"
                                        onClick={() => {
                                            rutaMateriales()
                                        }}
                                    />
                                    Materiales
                                </div>
                            </Card.Body>
                        </Card>
                    </CardGroup>
                </Container>
            </LayoutPrincipal>
        </>
    );
}

export default DashboardProductos;
