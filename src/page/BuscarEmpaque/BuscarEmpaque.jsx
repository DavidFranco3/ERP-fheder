import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { withRouter } from "../../utils/withRouter";
import { toast } from "react-toastify";
//import BuscarClientes from '../../components/Busquedas/BuscarClientes';
import { listarEmpaque, totalPedidoVenta } from "../../api/empaques";
import "./BuscarEmpaque.scss"
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import { obtenerUsuario } from "../../api/usuarios";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import BuscarEmpaques from '../../components/Busquedas/BuscarEmpaques';

function BuscarEmpaque(props) {
    const { setFormData, formData, setShowModal, setRefreshCheckLogin, location, history } = props;

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
    const [listEmpaque, setListEmpaque] = useState(null);

    useEffect(() => {
        try {
            listarEmpaque(getSucursal()).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listEmpaque && data) {
                    setListEmpaque(formatModelEmpaque(data));
                } else {
                    const datosEmpaque = formatModelEmpaque(data);
                    setListEmpaque(datosEmpaque);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);

    return (
        <>

            {
                listEmpaque ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <BuscarEmpaques
                                    listEmpaque={listEmpaque}
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

function formatModelEmpaque(data) {
    // console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            nombre: data.nombre,
            precio: data.precio,
            um: data.um,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(BuscarEmpaque);
