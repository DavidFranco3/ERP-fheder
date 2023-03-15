import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { withRouter } from "../../utils/withRouter";
import { toast } from "react-toastify";
import BuscarDepartamentos from '../../components/Busquedas/BuscarDepartamentos';
import { listarDepartamentoActivo } from "../../api/departamentos";
import "./BuscarDepartamento.scss"
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import { obtenerUsuario } from "../../api/usuarios";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { LogsInformativosLogout } from "../../components/Logs/LogsSistema/LogsSistema";

function BuscarDepartamento(props) {
    const { setFormData, formData, setShowModal, setRefreshCheckLogin, location, history } = props;

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
    const [listDepartamentos, setListDepartamentos] = useState(null);

    const cargarDatos = () => {
        try {
            listarDepartamentoActivo(getSucursal()).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listDepartamentos && data) {
                    setListDepartamentos(formatModelDepartamento(data));
                } else {
                    const datosDepartamento = formatModelDepartamento(data);
                    setListDepartamentos(datosDepartamento);
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
                listDepartamentos ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <BuscarDepartamentos
                                    listDepartamentos={listDepartamentos}
                                    setShowModal={setShowModal}
                                    location={location}
                                    history={history}
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    formData={formData}
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

function formatModelDepartamento(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            nombre: data.nombre,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(BuscarDepartamento);
