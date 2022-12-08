import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory, withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import BuscarOrdenVenta from "../../components/Busquedas/BuscarOrdenVenta"
import { listarPedidosVenta, totalPedidoVenta } from "../../api/pedidoVenta";
import "./BuscarOV.scss"
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../api/auth";
import { obtenerUsuario } from "../../api/usuarios";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function BuscarOV(props) {
    const { setProducto, setOrdenVentaPrincipal, setOrdenVenta, setClienteOV, setCantidadRequeridaOV, setIdCliente, setNombreCliente, setFechaPedido, setFechaEntrega, setShowModal, setRefreshCheckLogin, location, history } = props;

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

    // Almacena los datos de la orden de venta
    const [listVentas, setListVentas] = useState(null);

    useEffect(() => {
        try {
            listarPedidosVenta().then(response => {
                const { data } = response;

                //console.log(data);

                if (!listVentas && data) {
                    setListVentas(formatModelPedidosventa(data));
                } else {
                    const datosVentas = formatModelPedidosventa(data);
                    setListVentas(datosVentas);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);

    console.log(listVentas)


    return (
        <>

            {
                listVentas ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <BuscarOrdenVenta
                                    listVentas={listVentas}
                                    setShowModal={setShowModal}
                                    location={location}
                                    history={history}
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    setOrdenVenta={setOrdenVenta}
                                    setClienteOV={setClienteOV}
                                    setCantidadRequeridaOV={setCantidadRequeridaOV}
                                    setIdCliente={setIdCliente}
                                    setNombreCliente={setNombreCliente}
                                    setFechaPedido={setFechaPedido}
                                    setFechaEntrega={setFechaEntrega}
                                    setProducto={setProducto}
                                    setOrdenVentaPrincipal={setOrdenVentaPrincipal}
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

function formatModelPedidosventa(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            fechaElaboracion: data.fechaElaboracion,
            fechaEntrega: data.fechaEntrega,
            cliente: data.cliente,
            nombreCliente: data.nombreCliente,
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

export default withRouter(BuscarOV);
