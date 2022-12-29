import { useState, useEffect, Suspense } from 'react';
import { withRouter, useHistory } from "react-router-dom";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import RegistroExistenciasAlmacenPT from "../../components/AlmacenPT/RegistroExistenciasAlmacenPT";
import RegistroEntradaSalidaAlmacenPT from "../../components/AlmacenPT/RegistroEntradaSalidaAlmacenPT";
import ListAlmacenPT from "../../components/AlmacenPT/ListAlmacenPT";
import BasicModal from "../../components/Modal/BasicModal";
import { listarAlmacenPT } from "../../api/almacenPT";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { toast } from "react-toastify";
import { getSucursal, getTokenApi, isExpiredToken, logoutApi } from '../../api/auth';

function AlmacenPt(props) {
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

    // Para el registro en el almacen de PT
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

    // Para almacenar el listado de objetos en el almacen de pt
    const [listAlmacenPT, setListAlmacenPT] = useState(null);

    useEffect(() => {
        try {
            listarAlmacenPT(getSucursal()).then(response => {
                const { data } = response;

                if (!listAlmacenPT && data) {
                    setListAlmacenPT(formatModelAlmacenPT(data));
                } else {
                    const datosAlmacen = formatModelAlmacenPT(data);
                    setListAlmacenPT(datosAlmacen);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);

    const rutaRegreso = () => {
        enrutamiento.push("/DashboardAlmacenes")
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8} className="tituloPrincipal">
                        <h1>
                            Existencias de almacén producto terminado
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Registrar una existencia"
                            onClick={() => {
                                nuevoRegistro(
                                    <RegistroExistenciasAlmacenPT
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
                                    <RegistroEntradaSalidaAlmacenPT
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
                listAlmacenPT ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListAlmacenPT
                                    listAlmacenPT={listAlmacenPT}
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

function formatModelAlmacenPT(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folioAlmacen: data.folioAlmacen,
            folioMP: data.folioMP,
            sucursal: data.sucursal,
            nombre: data.nombre,
            descripcion: data.descripcion,
            um: data.um,
            movimientos: data.movimientos,
            existenciasOV: data.existenciasOV,
            existenciasStock: data.existenciasStock,
            existenciasTotales: data.existenciasTotales,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(AlmacenPt);
