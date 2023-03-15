import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { withRouter } from "../../utils/withRouter";
import { toast } from "react-toastify";
import BuscarCuentasPagar from "../../components/Busquedas/BuscarCuentasPagar"
import { listarCuentasPagarActiva } from "../../api/cuentasPorPagar";
import "./BuscarCXP.scss";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import { obtenerUsuario } from "../../api/usuarios";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { LogsInformativosLogout } from "../../components/Logs/LogsSistema/LogsSistema";

function BuscarCXP(props) {
    const { setFormData, setShowModal, setRefreshCheckLogin, location, history } = props;

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
    const [listCuentasPagar, setListCuentasPagar] = useState(null);

    const cargarDatos = () => {
        try {
            listarCuentasPagarActiva(getSucursal()).then(response => {
                const { data } = response;

                if (!listCuentasPagar && data) {
                    setListCuentasPagar(formatModelCuentasPagar(data));
                } else {
                    const datosCuentas = formatModelCuentasPagar(data);
                    setListCuentasPagar(datosCuentas);
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
                listCuentasPagar ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <BuscarCuentasPagar
                                    listCuentasPagar={listCuentasPagar}
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

function formatModelCuentasPagar(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            ordenCompra: data.ordenCompra,
            proveedor: data.proveedor,
            nombreProveedor: data.nombreProveedor,
            sucursal: data.sucursal,
            fechaEmision: data.fechaEmision,
            fechaVencimiento: data.fechaVencimiento,
            nombreContacto: data.nombreContacto,
            telefono: data.telefono,
            correo: data.correo,
            iva: data.iva,
            ivaElegido: data.ivaElegido,
            subtotal: data.subtotal,
            total: data.total,
            productos: data.productos,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(BuscarCXP);
