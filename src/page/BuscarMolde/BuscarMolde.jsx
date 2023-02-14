import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { withRouter } from "../../utils/withRouter";
import { toast } from "react-toastify";
import BuscarMoldes from '../../components/Busquedas/BuscarMoldes';
import { listarEtiquetaMoldeActiva } from "../../api/etiquetasMoldes";
import "./BuscarMolde.scss"
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function BuscarMolde(props) {
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
    const [listMoldes, setListMoldes] = useState(null);

    useEffect(() => {
        try {
            listarEtiquetaMoldeActiva(getSucursal()).then(response => {
                const { data } = response;

                if (!listMoldes && data) {
                    setListMoldes(formatModelMoldes(data));
                } else {
                    const datosMoldes = formatModelMoldes(data);
                    setListMoldes(datosMoldes);
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
                listMoldes ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <BuscarMoldes
                                    listMoldes={listMoldes}
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

function formatModelMoldes(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            idInterno: data.idInterno,
            noInterno: data.noInterno,
            noParte: data.noParte,
            sucursal: data.sucursal,
            cavidad: data.cavidad,
            descripcion: data.descripcion,
            cliente: data.cliente,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(BuscarMolde);
