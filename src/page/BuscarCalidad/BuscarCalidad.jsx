import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { withRouter } from "../../utils/withRouter";
import { toast } from "react-toastify";
//import BuscarClientes from '../../components/Busquedas/BuscarClientes';
import { listarInspeccionActivo } from "../../api/inspeccionMaterial";
import "./BuscarCalidad.scss"
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import { obtenerUsuario } from "../../api/usuarios";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import BuscarInspeccionCalidad from '../../components/Busquedas/BuscarInspeccionCalidad';

function BuscarCalidad(props) {
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
    const [listCalidad, setListCalidad] = useState(null);

    useEffect(() => {
        try {
            listarInspeccionActivo(getSucursal()).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listCalidad && data) {
                    setListCalidad(formatModelInspeccion(data));
                } else {
                    const datosCalidad = formatModelInspeccion(data);
                    setListCalidad(datosCalidad);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);

    console.log(listCalidad)

    return (
        <>

            {
                listCalidad ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <BuscarInspeccionCalidad
                                    listCalidad={listCalidad}
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

function formatModelInspeccion(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            sucursal: data.sucursal,
            etiqueta: data.etiqueta,
            ordenVenta: data.ordenVenta,
            fecha: data.fecha,
            lote: data.lote,
            propiedad: data.propiedad,
            tipoMaterial: data.tipoMaterial,
            nombre: data.nombre,
            cantidad: data.cantidad,
            unidadMedida: data.unidadMedida,
            nombreRecibio: data.nombreRecibio,
            estadoMateriaPrima: data.estadoMateriaPrima,
            contaminacion: data.contaminacion,
            presentaHumedad: data.presentaHumedad,
            certificadoCalidad: data.certificadoCalidad,
            empaqueDañado: data.empaqueDañado,
            resultadoFinalInspeccion: data.resultadoFinalInspeccion,
            observaciones: data.observaciones,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(BuscarCalidad);
