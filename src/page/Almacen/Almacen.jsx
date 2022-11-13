import { useState, useEffect } from 'react';
import LayoutPrincipal from "../../layout/layoutPrincipal";
import {Alert, Button, Col, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus, faPlus, faUsers} from "@fortawesome/free-solid-svg-icons";
import { useHistory, withRouter } from "react-router-dom";
import {toast} from "react-toastify";
import ListAlmacen from "../../components/Almacen/ListAlmacen";
import {listarArticuloAlmacen} from "../../api/almacen";
import {getTokenApi, isExpiredToken, logoutApi} from "../../api/auth";

function Almacen(props) {
    const { setRefreshCheckLogin, history, location } = props;

    const enrutamiento = useHistory();

    // Cerrado de sesión automatico
    useEffect(() => {
        if(getTokenApi()) {
            if(isExpiredToken(getTokenApi())) {
                toast.warning("Sesión expirada");
                toast.success("Sesión cerrada por seguridad");
                logoutApi();
                setRefreshCheckLogin(true);
            }
        }
    }, []);
    // Termina cerrado de sesión automatico

    // Para almacenar los articulos del almacen
    const [listArticulosAlmacen, setListArticulosAlmacen] = useState(null);

    // Para determinar la conexion a internet y al servidor
    const [conexionInternet, setConexionInternet] = useState(null);

    // Para ir hacia la ruta de registro de articulo en el almacen
    const irRutaRegistro = () => {
        enrutamiento.push("/RegistroAlmacen");
    }

    useEffect(() => {
        try {
            listarArticuloAlmacen().then(response => {
                const { data } = response;

                //console.log(data);
                if(!listArticulosAlmacen &&data) {
                    setListArticulosAlmacen(formatModelArticulosAlmacen(data));
                } else {
                    const datosUsuarios = formatModelArticulosAlmacen(data);
                    setListArticulosAlmacen(datosUsuarios);
                }

            }).catch((e) => {
                //console.log(e)
                if(e.message == 'Network Error') {
                    //console.log("No hay internet")
                    toast.error("Conexión a Internet no Disponible");
                    setConexionInternet(false);
                }
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);


    return (
        <>
            <LayoutPrincipal setRefreshCheckLogin={setRefreshCheckLogin}>
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
                                    irRutaRegistro()
                                }}
                            >
                                <FontAwesomeIcon icon={faCirclePlus} /> Registrar un nuevo artículo
                            </Button>
                        </Col>
                    </Row>
                </Alert>

                {listArticulosAlmacen ?
                    (
                        <>
                            <ListAlmacen listArticulosAlmacen={listArticulosAlmacen} history={history} />
                        </>
                    )
                    :
                    (
                        <>
                        </>
                    )
                }

            </LayoutPrincipal>
        </>
    );
}

function formatModelArticulosAlmacen(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            nombre: data.nombre,
            descripcion: data.descripcion,
            tipo: data.tipo,
            ordenProduccion: data.ordenProduccion,
            precio: data.precio,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Almacen);
