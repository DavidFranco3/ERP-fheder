import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { withRouter } from "../../utils/withRouter";
import { toast } from "react-toastify";
import BuscarFacturas from "../../components/Busquedas/BuscarFacturas"
import { listarFacturaActiva } from "../../api/facturas";
import "./BuscarFactura.scss"
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import { obtenerUsuario } from "../../api/usuarios";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function BuscarFactura(props) {
    const { setFormData, setShowModal, setRefreshCheckLogin, location, history } = props;

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
    const [listFacturas, setListFacturas] = useState(null);

    useEffect(() => {
        try {
            listarFacturaActiva(getSucursal()).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listFacturas && data) {
                    setListFacturas(formatModelFacturas(data));
                } else {
                    const datosFacturas = formatModelFacturas(data);
                    setListFacturas(datosFacturas);
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
                listFacturas ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <BuscarFacturas
                                    listFacturas={listFacturas}
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

function formatModelFacturas(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            ordenVenta: data.ordenVenta,
            cliente: data.cliente,
            nombreCliente: data.nombreCliente,
            sucursal: data.sucursal,
            fechaEmision: data.fechaEmision,
            fechaVencimiento: data.fechaVencimiento,
            nombreContacto: data.nombreContacto,
            telefono: data.telefono,
            correo: data.correo,
            productos: data.productos,
            iva: data.iva,
            ivaElegido: data.ivaElegido,
            subtotal: data.subtotal,
            total: data.total,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(BuscarFactura);
