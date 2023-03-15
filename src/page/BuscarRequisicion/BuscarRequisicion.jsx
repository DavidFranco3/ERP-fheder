import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { withRouter } from "../../utils/withRouter";
import { toast } from "react-toastify";
//import BuscarClientes from '../../components/Busquedas/BuscarClientes';
import { listarRequisicionesActivas } from "../../api/requisicion";
import "./BuscarRequisicion.scss"
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import { obtenerUsuario } from "../../api/usuarios";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import BuscarRequisiciones from '../../components/Busquedas/BuscarRequisiciones';
import { LogsInformativosLogout } from "../../components/Logs/LogsSistema/LogsSistema";

function BuscarRequisicion(props) {
    const { setFormData, formData, productosRequisicion, setProductosRequisicion, setShowModal, setRefreshCheckLogin, location, history } = props;

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
    const [listRequisiciones, setListRequisiciones] = useState(null);

    const cargarDatos = () => {
        try {
            listarRequisicionesActivas(getSucursal()).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listRequisiciones && data) {
                    setListRequisiciones(formatModelRequisiciones(data));
                } else {
                    const datosRequisiciones = formatModelRequisiciones(data);
                    setListRequisiciones(datosRequisiciones);
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
                listRequisiciones ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <BuscarRequisiciones
                                    listRequisiciones={listRequisiciones}
                                    setShowModal={setShowModal}
                                    location={location}
                                    history={history}
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    formData={formData}
                                    setFormData={setFormData}
                                    productosRequisicion={productosRequisicion}
                                    setProductosRequisicion={setProductosRequisicion}
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

function formatModelRequisiciones(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            fechaElaboracion: data.fechaElaboracion,
            solicitante: data.solicitante,
            aprobo: data.aprobo,
            comentarios: data.comentarios,
            tipoRequisicion: data.tipoRequisicion,
            tipoAplicacion: data.tipoAplicacion,
            departamento: data.departamento,
            productosSolicitados: data.productosSolicitados,
            status: data.status,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(BuscarRequisicion);
