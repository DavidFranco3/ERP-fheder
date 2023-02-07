import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory, withRouter, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ListCuentasCobrar from "../../components/CuentasPorCobrar/ListCuentasCobrar";
import { listarCuentasCobrarPorCliente } from "../../api/cuentasPorCobrar";
import "./CuentasPorCobrar.scss"
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function CuentasPorCobrar(props) {
    const { setRefreshCheckLogin, location, history } = props;

    const params = useParams();
    const { cliente } = params

    const enrutamiento = useHistory();

    // Para almacenar la lista de pedidos de venta
    const [listCuentasCobrar, setListCuentasCobrar] = useState(null);

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
            listarCuentasCobrarPorCliente(getSucursal(), cliente).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listCuentasCobrar && data) {
                    setListCuentasCobrar(formatModelCuentasCobrar(data));
                } else {
                    const datosCuentas = formatModelCuentasCobrar(data);
                    setListCuentasCobrar(datosCuentas);
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
        enrutamiento.push("/Pedido-de-Venta")
    }

    const rutaRegreso = () => {
        enrutamiento.push("/Clientes")
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Cuentas por cobrar
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Regresar al menú ventas"
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
                listCuentasCobrar ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListCuentasCobrar
                                    listCuentasCobrar={listCuentasCobrar}
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

function formatModelCuentasCobrar(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            ordenVenta: data.ordenVenta,
            cliente: data.cliente,
            nombreCliente: data.nombreCliente,
            sucursal: data.sucursal,
            fechaEmision: data.fechaEmision,
            fechaVencimiento: data.fechaVencimiento,
            nombreContacto: data.nombreContacto,
            telefono: data.telefono,
            correo: data.correo,
            productos: data.productos,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(CuentasPorCobrar);
