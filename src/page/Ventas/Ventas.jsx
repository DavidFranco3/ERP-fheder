import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory, withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import ListVentas from "../../components/Ventas/ListVentas";
import { listarPedidosVentaPaginacion, totalPedidoVenta } from "../../api/pedidoVenta";
import "./Ventas.scss"
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../api/auth";
import LayoutPrincipal from "../../layout/layoutPrincipal";
import { obtenerUsuario } from "../../api/usuarios";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function Ventas(props) {
    const { setRefreshCheckLogin, location, history } = props;

    const enrutamiento = useHistory();

    // Para almacenar la lista de pedidos de venta
    const [listPedidosVenta, setListPedidosVenta] = useState(null);

    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalVentas, setNoTotalVentas] = useState(0);

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
            totalPedidoVenta().then(response => {
                const { data } = response;
                setNoTotalVentas(data)
            })

            // listarOrdenesCompraPaginacion(page, rowsPerPage)
            if (page === 0) {
                setPage(1)
                listarPedidosVentaPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response;
                    if (!listPedidosVenta && data) {
                        setListPedidosVenta(formatModelPedidosventa(data));
                    } else {
                        const datosVentas = formatModelPedidosventa(data);
                        setListPedidosVenta(datosVentas);
                    }
                }).catch(e => {
                    // console.log(e)
                })
            } else {
                listarPedidosVentaPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response;
                    if (!listPedidosVenta && data) {
                        setListPedidosVenta(formatModelPedidosventa(data));
                    } else {
                        const datosVentas = formatModelPedidosventa(data);
                        setListPedidosVenta(datosVentas);
                    }
                }).catch(e => {
                    // console.log(e)
                })
            }

        } catch (e) {
            console.log(e)
        }
    }, [location, page, rowsPerPage]);

    // Para ir hacia la ruta de registro del pedido de venta
    const rutaRegistroPedidoVenta = () => {
        enrutamiento.push("/Pedido-de-Venta")
    }

    const rutaRegreso = () => {
        enrutamiento.push("/DashboardVentas")
    }

    // Validar el tipo de usuario que accede a la vista
    const [tipoUsuario, setTipoUsuario] = useState("");

    useEffect(() => {
        try {
            obtenerUsuario(obtenidusuarioLogueado(getTokenApi())).then(response => {
                const { data } = response;
                // console.log(data)
                setTipoUsuario(data.departamento);
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);


    return (
        <>
            <LayoutPrincipal setRefreshCheckLogin={setRefreshCheckLogin}>
                <Alert>
                    <Row>
                        <Col xs={12} md={8}>
                            <h1>
                                Mis pedidos de venta
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                            <Button
                                className="btnRegistroVentas"
                                onClick={() => {
                                    rutaRegistroPedidoVenta()
                                }}
                            >
                                <FontAwesomeIcon icon={faCirclePlus} /> Crear un nuevo pedido
                            </Button>
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

                {
                    listPedidosVenta ?
                        (
                            <>
                                <Suspense fallback={<Spinner />}>
                                    <ListVentas
                                        listPedidosVenta={listPedidosVenta}
                                        location={location}
                                        history={history}
                                        setRefreshCheckLogin={setRefreshCheckLogin}
                                        rowsPerPage={rowsPerPage}
                                        setRowsPerPage={setRowsPerPage}
                                        page={page}
                                        setPage={setPage}
                                        noTotalVentas={noTotalVentas}
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

            </LayoutPrincipal>
        </>
    );
}

function formatModelPedidosventa(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            fechaPedido: data.fechaElaboracion,
            fechaEntrega: data.fechaEntrega,
            cliente: data.cliente,
            condicionesPago: data.condicionesPago,
            especificaciones: data.especificaciones,
            incoterms: data.incoterms,
            moneda: data.moneda,
            numeroPedido: data.numeroPedido,
            lugarEntrega: data.lugarEntrega,
            cotizacion: data.cotizacion,
            ordenCompra: data.ordenCompra,
            total: data.total,
            productos: data.productos,
            totalProductos: data.productos.length,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Ventas);
