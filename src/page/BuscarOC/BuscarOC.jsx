import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { withRouter } from "../../utils/withRouter";
import { toast } from "react-toastify";
import BuscarCompras from '../../components/Busquedas/BuscarCompras';
import { listarOrdenesCompraActivas } from "../../api/compras";
import "./BuscarOC.scss"
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import { obtenerUsuario } from "../../api/usuarios";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { map } from "lodash";

function BuscarOC(props) {
    const { setFormData, productosOC, setProductosOC, formData, setShowModal, setRefreshCheckLogin, location, history } = props;

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

    const [listCompras, setListCompras] = useState(null);

    useEffect(() => {
        try {
            listarOrdenesCompraActivas(getSucursal()).then(response => {
                const { data } = response;

                ///console.log(data);

                if (!listCompras && data) {
                    setListCompras(formatModelCompras(data));
                } else {
                    const datosCompras = formatModelCompras(data);
                    setListCompras(datosCompras);
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
                listCompras ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <BuscarCompras
                                    listCompras={listCompras}
                                    setShowModal={setShowModal}
                                    location={location}
                                    history={history}
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    formData={formData}
                                    setFormData={setFormData}
                                    productosOC={productosOC}
                                    setProductosOC={setProductosOC}
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
            nombreProveedor: data.nombreProveedor,
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
