import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { withRouter } from "../../utils/withRouter";
import { toast } from "react-toastify";
import BuscarProductosOrdenVenta from '../../components/Busquedas/BuscarProductosOrdenVenta';
import { listarProductosOV } from "../../api/pedidoVenta";
import "./BuscarProductosOV.scss"
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import { obtenerUsuario } from "../../api/usuarios";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { LogsInformativosLogout } from "../../components/Logs/LogsSistema/LogsSistema";

function BuscarProductosOV(props) {
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
    const [listProductos, setListProductos] = useState(null);

    const cargarDatos = () => {
        try {
            listarProductosOV(getSucursal()).then(response => {
                const { data } = response;

                console.log(data);

                if (!listProductos && data) {
                    setListProductos(formatModelProductos(data));
                } else {
                    const datosProductos = formatModelProductos(data);
                    setListProductos(datosProductos);
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
                listProductos ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <BuscarProductosOrdenVenta
                                    listProductos={listProductos}
                                    setShowModal={setShowModal}
                                    location={location}
                                    history={history}
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    setFormData={setFormData}
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

function formatModelProductos(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            ordenVenta: data.ordenVenta, 
            item: data.item, 
            ID: data.ID,
            cantidad: data.cantidad, 
            total: data.total
        });
    });
    return dataTemp;
}

export default withRouter(BuscarProductosOV);
