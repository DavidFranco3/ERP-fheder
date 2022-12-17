import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory, withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import BuscarCompras from '../../components/Busquedas/BuscarCompras';
import { listarDeptoCompras, listarProductosCompras } from "../../api/compras";
import "./BuscarOC.scss"
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../api/auth";
import { obtenerUsuario } from "../../api/usuarios";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
const { map } = require("lodash");

function BuscarOC(props) {
    const { setFormData, formData, setShowModal, setRefreshCheckLogin, location, history } = props;

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

    const [listProductosCompras, setListProductosCompras] = useState(null);

    useEffect(() => {
        try {
            listarProductosCompras().then(response => {
                const { data } = response;

                ///console.log(data);

                if (!listProductosCompras && data) {
                    setListProductosCompras(formatModelProductosCompras(data));
                } else {
                    const datosProductosCompras = formatModelProductosCompras(data);
                    setListProductosCompras(datosProductosCompras);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);

    console.log(listProductosCompras)

    return (
        <>

            {
                listProductosCompras ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <BuscarCompras
                                    listProductosCompras={listProductosCompras}
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

function formatModelCompras(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            proveedor: data.proveedor,
            fechaSolicitud: data.fechaSolicitud,
            fechaEntrega: data.fechaEntrega,
            tipo: data.tipo,
            ordenVenta: data.ordenVenta ? data.ordenVenta : "No aplica",
            diasCredito: data.diasCredito,
            autoriza: data.autoriza,
            productos: data.productos,
            subtotal: data.subtotal,
            iva: data.iva,
            total: data.total,
            estado: data.estado,
            departamento: data.departamento,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

function formatModelProductosCompras(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data.id,
            folio: data.folio,
            cantidad: data.cantidad,
            um: data.um,
            descripcion: data.descripcion,
            precio: data.precio,
            subtotal: data.subtotal,
        });
    });
    return dataTemp;
}

export default withRouter(BuscarOC);
