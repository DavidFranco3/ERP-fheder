import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory, withRouter } from "react-router-dom";
import BasicModal from "../../components/Modal/BasicModal";
import RegistroVentasGastos from "../../components/VentasGastos/RegistraVentasGastos";
import ListIntegracionVentasGastos from '../../components/VentasGastos/ListIntegracionVentasGastos';
import { listarIntegracionesPaginacion, totalIntegraciones } from "../../api/integracionVentasGastos";
import { getTokenApi, isExpiredToken, logoutApi } from "../../api/auth";
import { toast } from "react-toastify";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function VentasGastos(props) {
    const { setRefreshCheckLogin, location, history } = props;

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

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegistro = () => {
        enrutamiento.push("/RegistroReporte")
    }

    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalIntegraciones, setNoTotalIntegraciones] = useState(0);

    // Para almacenar la lista de las integraciones de ventas y gastos
    const [listIntegraciones, setListIntegraciones] = useState(null);

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    useEffect(() => {
        try {
            totalIntegraciones().then(response => {
                const { data } = response;
                setNoTotalIntegraciones(data)
            })

            // listarOrdenesCompraPaginacion(page, rowsPerPage)
            if (page === 0) {
                setPage(1)
                listarIntegracionesPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response;
                    if (!listIntegraciones && data) {
                        setListIntegraciones(formatModelIntegracionesVentasGastos(data));
                    } else {
                        const datosVentas = formatModelIntegracionesVentasGastos(data);
                        setListIntegraciones(datosVentas);
                    }
                }).catch(e => {
                    // console.log(e)
                })
            } else {
                listarIntegracionesPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response;
                    if (!listIntegraciones && data) {
                        setListIntegraciones(formatModelIntegracionesVentasGastos(data));
                    } else {
                        const datosVentas = formatModelIntegracionesVentasGastos(data);
                        setListIntegraciones(datosVentas);
                    }
                }).catch(e => {
                    // console.log(e)
                })
            }

        } catch (e) {
            console.log(e)
        }
    }, [location, page, rowsPerPage]);

    // Para el registro en el almacen de mp
    const nuevoRegistro = (content) => {
        setTitulosModal("Nuevo registro");
        setContentModal(content);
        setShowModal(true);
    }

    const rutaRegreso = () => {
        enrutamiento.push("/DashboardVentas")
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Integración de ventas/gastos
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            onClick={() => {
                                nuevoRegistro(
                                    <RegistroVentasGastos
                                        setShowModal={setShowModal}
                                        location={location}
                                        history={history}
                                    />
                                )
                            }}
                        >
                            <FontAwesomeIcon icon={faCirclePlus} /> Nuevo registro
                        </Button>
                        <Button
                            className="btnRegistroVentas"

                        >
                            <FontAwesomeIcon icon={faCirclePlus} /> Ver reporte
                        </Button>
                        <Button
                            className="btnRegistroVentas"
                            onClick={() => {
                                rutaRegreso()
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowCircleLeft} /> Regresar
                        </Button>
                    </Col>
                </Row>
            </Alert>

            {
                listIntegraciones ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListIntegracionVentasGastos
                                    listIntegraciones={listIntegraciones}
                                    location={location}
                                    history={history}
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    rowsPerPage={rowsPerPage}
                                    setRowsPerPage={setRowsPerPage}
                                    page={page}
                                    setPage={setPage}
                                    noTotalIntegraciones={noTotalIntegraciones}
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

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

function formatModelIntegracionesVentasGastos(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            fechaFactura: data.fechaFactura,
            cliente: data.cliente,
            importe: data.importe,
            iva: data.iva,
            total: data.total,
            observaciones: data.observaciones,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(VentasGastos);
