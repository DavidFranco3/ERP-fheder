import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory, withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import ListRecepciones from "../../components/RecepcionMaterialInsumos/ListRecepciones";
import { listarRecepcion } from "../../api/recepcionMaterialInsumos";
import "./RecepcionMaterialInsumos.scss"
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import { obtenerUsuario } from "../../api/usuarios";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function RecepcionMaterialInsumos(props) {
    const { setRefreshCheckLogin, location, history } = props;

    const enrutamiento = useHistory();

    // Para almacenar la lista de pedidos de venta
    const [listRecepciones, setListRecepciones] = useState(null);

    // Para determinar si hay conexion al servidor o a internet
    const [conexionInternet, setConexionInternet] = useState(true);

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

    useEffect(() => {
        try {
            listarRecepcion(getSucursal()).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listRecepciones && data) {
                    setListRecepciones(formatModelRecepciones(data));
                } else {
                    const datosRecepciones = formatModelRecepciones(data);
                    setListRecepciones(datosRecepciones);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);

    // Para ir hacia la ruta de registro del pedido de venta
    const rutaRegistroPedidoVenta = () => {
        enrutamiento.push("/RegistroRecepcion")
    }

    const rutaRegreso = () => {
        enrutamiento.push("/DashboardCompras")
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Recepción de material e insumos
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Registrar una nueva recepcion"
                            onClick={() => {
                                rutaRegistroPedidoVenta()
                            }}
                        >
                            <FontAwesomeIcon icon={faCirclePlus} /> Registrar
                        </Button>
                        <Button
                            className="btnRegistroVentas"
                            title="Regresar al menú compras"
                            onClick={() => {
                                rutaRegreso()
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowCircleLeft} /> Regresar
                        </Button>
                    </Col>
                </Row>
            </Alert>

            {
                listRecepciones ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListRecepciones
                                    listRecepciones={listRecepciones}
                                    location={location}
                                    history={history}
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                />
                            </Suspense>
                        </>
                    )
                    :
                    (
                        <>
                            <Lottie loop={true} play={true} animationData={AnimacionLoading} />
                        </>
                    )
            }
        </>
    );
}

function formatModelRecepciones(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            ordenCompra: data.ordenCompra,
            sucursal: data.sucursal,
            proveedor: data.proveedor,
            nombreProveedor: data.nombreProveedor,
            folio: data.folio,
            fechaRecepcion: data.fechaRecepcion,
            precio: data.precio,
            cantidad: data.cantidad,
            productos: data.productos,
            valorTotal: data.valorTotal,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(RecepcionMaterialInsumos);
