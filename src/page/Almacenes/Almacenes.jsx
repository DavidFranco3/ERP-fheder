import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { listarRegistrosAlmacen } from "../../api/almacenes";
import ListAlmacenes from "../../components/Almacenes/ListAlmacenes";
import { withRouter, useHistory } from "react-router-dom";
import BasicModal from "../../components/Modal/BasicModal";
import RegistroExistenciasAlmacenes from "../../components/Almacenes/RegistroExistenciasAlmacenes";
import RegistroEntradaSalida from "../../components/Almacenes/RegistroEntradaSalida";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { toast } from "react-toastify";
import { getSucursal, getTokenApi, isExpiredToken, logoutApi } from '../../api/auth';

function Almacenes(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Para definir el enrutamiento
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

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para el registro en el almacen de mp
    const nuevoRegistro = (content) => {
        setTitulosModal("Nuevo registro");
        setContentModal(content);
        setShowModal(true);
    }

    // Para el registro de entradas o salidas
    const nuevaEntradaSalida = (content) => {
        setTitulosModal("Nueva Entrada / Salida");
        setContentModal(content);
        setShowModal(true);
    }

    // Almacenar el listado de materias primas registradas
    const [listAlmacenes, setListAlmacenes] = useState(null);

    useEffect(() => {
        try {
            listarRegistrosAlmacen(getSucursal()).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listAlmacenes && data) {
                    setListAlmacenes(formatModelAlmacenes(data));
                } else {
                    const datosAlmacenes = formatModelAlmacenes(data);
                    setListAlmacenes(datosAlmacenes);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);

    const rutaRegreso = () => {
        enrutamiento.push("/")
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8} className="tituloPrincipal">
                        <h1>
                            Existencias de almacenes
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Registrar una existencia"
                            onClick={() => {
                                nuevoRegistro(
                                    <RegistroExistenciasAlmacenes
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
                            title="Registrar una entrada/salida"
                            onClick={() => {
                                nuevaEntradaSalida(
                                    <RegistroEntradaSalida
                                        setShowModal={setShowModal}
                                        location={location}
                                        history={history}
                                    />
                                )
                            }}
                        >
                            <FontAwesomeIcon icon={faCirclePlus} /> Nueva E / S
                        </Button>

                        <Button
                            className="btnRegistroVentas"
                            title="Regresar al menú almacenes"
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
                listAlmacenes ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListAlmacenes
                                    listAlmacenes={listAlmacenes}
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

function formatModelAlmacenes(data) {
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

export default withRouter(Almacenes);
