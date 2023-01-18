import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory, withRouter } from "react-router-dom";
import BasicModal from "../../components/Modal/BasicModal";
import RegistroVentasGastos from "../../components/VentasGastos/RegistraVentasGastos";
import ListIntegracionVentasGastos from '../../components/VentasGastos/ListIntegracionVentasGastos';
import { listarIntegraciones } from "../../api/integracionVentasGastos";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
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

    // Para almacenar la lista de las integraciones de ventas y gastos
    const [listIntegraciones, setListIntegraciones] = useState(null);

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    useEffect(() => {
        try {
            listarIntegraciones(getSucursal()).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listIntegraciones && data) {
                    setListIntegraciones(formatModelIntegracionesVentasGastos(data));
                } else {
                    const datosIntegraciones = formatModelIntegracionesVentasGastos(data);
                    setListIntegraciones(datosIntegraciones);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);

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
                            title="Registrar una nueva integración de ventas/gastos"
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
                            <FontAwesomeIcon icon={faCirclePlus} /> Registrar
                        </Button>
                        <Button
                            className="btnRegistroVentas"
                            title="Ver reporte"
                        >
                            <FontAwesomeIcon icon={faCirclePlus} /> Ver reporte
                        </Button>
                        <Button
                            className="btnRegistroVentas"
                            title="Regresar al menú ventas"
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
            sucursal: data.sucursal,
            fechaFactura: data.fechaFactura,
            cliente: data.cliente,
            importe: data.importe,
            iva: data.iva,
            total: data.total,
            estado: data.estado,
            observaciones: data.observaciones,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(VentasGastos);
