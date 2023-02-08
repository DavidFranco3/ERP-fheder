import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory, withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import ListFacturas from "../../components/Facturas/ListFacturas";
import { listarFactura } from "../../api/facturas";
import "./Facturas.scss"
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function Facturas(props) {
    const { setRefreshCheckLogin, location, history } = props;

    const enrutamiento = useHistory();

    // Para almacenar la lista de pedidos de venta
    const [listFacturas, setListFacturas] = useState(null);

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
            listarFactura(getSucursal()).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listFacturas && data) {
                    setListFacturas(formatModelFacturas(data));
                } else {
                    const datosFacturas = formatModelFacturas(data);
                    setListFacturas(datosFacturas);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);

    // Para ir hacia la ruta de registro del pedido de venta
    const rutaRegistroFacturas = () => {
        enrutamiento.push("/RegistroFacturas")
    }

    const rutaRegreso = () => {
        enrutamiento.push("/DashboardFinanzas")
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Facturas
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                    <Button
                            className="btnRegistroVentas"
                            title="Registrar una nueva factura"
                            onClick={() => {
                                rutaRegistroFacturas()
                            }}
                        >
                            <FontAwesomeIcon icon={faCirclePlus} /> Registrar
                        </Button>
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
                listFacturas?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListFacturas
                                    listFacturas={listFacturas}
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

function formatModelFacturas(data) {
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

export default withRouter(Facturas);
