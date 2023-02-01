import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory, withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import BuscarArticulosAlmacenes from '../../components/Busquedas/BuscarArticulosAlmacenes';
import { listarRegistrosGeneralesAlmacen } from "../../api/almacenes";
import "./BuscarArticuloAlmacen.scss"
import { getTokenApi, isExpiredToken, logoutApi, getSucursal, getAlmacen } from "../../api/auth";
import { obtenerUsuario } from "../../api/usuarios";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function BuscarArticuloAlmacen(props) {
    const { setFormData, formData, setShowModal, setRefreshCheckLogin, location, history, setRegistroAnterior, registroAnterior, setCantidadExistencia } = props;

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
    const [listArticulos, setListArticulos] = useState(null);

    useEffect(() => {
        try {
            listarRegistrosGeneralesAlmacen(getSucursal()).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listArticulos && data) {
                    setListArticulos(formatModelArticulos(data));
                } else {
                    const datosArticulos = formatModelArticulos(data);
                    setListArticulos(datosArticulos);
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
                listArticulos ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <BuscarArticulosAlmacenes
                                    listArticulos={listArticulos}
                                    setShowModal={setShowModal}
                                    location={location}
                                    history={history}
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    formData={formData}
                                    setFormData={setFormData}
                                    setRegistroAnterior={setRegistroAnterior}
                                    registroAnterior={registroAnterior}
                                    setCantidadExistencia={setCantidadExistencia}
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

function formatModelArticulos(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            idArticulo: data.idArticulo,
            folioArticulo: data.folioArticulo,
            nombreArticulo: data.nombreArticulo,
            sucursal: data.sucursal,
            almacen: data.almacen,
            um: data.um,
            movimientos: data.movimientos,
            cantidadExistencia: data.cantidadExistencia,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(BuscarArticuloAlmacen);
