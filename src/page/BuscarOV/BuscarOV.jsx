import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { withRouter } from "../../utils/withRouter";
import { toast } from "react-toastify";
import BuscarOrdenVenta from "../../components/Busquedas/BuscarOrdenVenta"
import { listarPedidosVentaActiva} from "../../api/pedidoVenta";
import "./BuscarOV.scss"
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import { obtenerUsuario } from "../../api/usuarios";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { LogsInformativosLogout } from "../../components/Logs/LogsSistema/LogsSistema";

function BuscarOV(props) {
    const { setProducto, setFormData, setShowModal, setOrdenVentaPrincipal, setRefreshCheckLogin, location, history } = props;

    const cierreAutomatico = () => {
        if (getTokenApi()) {
            if (isExpiredToken(getTokenApi())) {
                LogsInformativosLogout("Sesión finalizada", setRefreshCheckLogin)
                toast.warning("Sesión expirada");
                toast.success("Sesión cerrada por seguridad");
                logoutApi();
                setRefreshCheckLogin(true);
            }
        }
    }

    // Cerrado de sesión automatico
    useEffect(() => {
        cierreAutomatico();
    }, []);
    // Termina cerrado de sesión automatico

    // Almacena los datos de la orden de venta
    const [listVentas, setListVentas] = useState(null);

    const cargarDatos = () => {
        try {
            listarPedidosVentaActiva(getSucursal()).then(response => {
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
    }

    useEffect(() => {
        cargarDatos();
    }, [location]);

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
                                    setFormData={setFormData}
                                    setOrdenVentaPrincipal={setOrdenVentaPrincipal}
                                    setProducto={setProducto}
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
