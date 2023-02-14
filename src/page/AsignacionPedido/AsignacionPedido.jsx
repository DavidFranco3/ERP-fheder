import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { withRouter } from "../../utils/withRouter";
import BasicModal from "../../components/Modal/BasicModal";
import AgregarOrdenes from "../../components/AsignacionesPedido/RegistraAsignacionPedido";
import { listarAsignacionPedidos } from "../../api/asignacionPedido";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import ListAsignacionPedido from "../../components/AsignacionesPedido/ListAsignacionPedido";
import { toast } from "react-toastify";
import { getSucursal, getTokenApi, isExpiredToken, logoutApi } from '../../api/auth';

function AsignacionPedido(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para el registro en el almacen de mp
    const nuevaOrden = (content) => {
        setTitulosModal("Agregar ordenes");
        setContentModal(content);
        setShowModal(true);
    }

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

    // Para almacenar el listado de objetos en el almacen de pt
    const [listAsignacionPedido, setListAsignacionPedido] = useState(null);

    useEffect(() => {
        try {
            listarAsignacionPedidos(getSucursal()).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listAsignacionPedido && data) {
                    setListAsignacionPedido(formatModelAsignacionPedido(data));
                } else {
                    const datosAsignacion = formatModelAsignacionPedido(data);
                    setListAsignacionPedido(datosAsignacion);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);

    // Para definir el enrutamiento
    const enrutamiento = useNavigate()

    const rutaRegreso = () => {
        enrutamiento("/DashboardPlaneacion")
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Asignaciones de pedido
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Registrar una nueva asignacion de pedido"
                            onClick={() => {
                                nuevaOrden(
                                    <AgregarOrdenes
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
                            title="Regresar al menú planeación"
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
                listAsignacionPedido ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListAsignacionPedido
                                    listAsignacionPedido={listAsignacionPedido}
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

function formatModelAsignacionPedido(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            sucursal: data.sucursal,
            cliente: data.cliente,
            fechaPedido: data.fechaPedido,
            fechaEntrega: data.fechaEntrega,
            producto: data.producto,
            um: data.um,
            cantidadPedida: data.cantidadPedida,
            plantaAsignada: data.plantaAsignada,
            cantidadAsignada: data.cantidadAsignada,
            estado: data.estado,
        });
    });
    return dataTemp;
}

export default withRouter(AsignacionPedido);
