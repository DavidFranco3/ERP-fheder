import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { withRouter } from "../../utils/withRouter";
import BasicModal from "../../components/Modal/BasicModal";
import RegistraMantenimientoPreventivo from "../../components/MantenimientoPreventivo/RegistraMantenimientoPreventivo";
import { getSucursal, getTokenApi, isExpiredToken, logoutApi } from '../../api/auth';
import { toast } from "react-toastify";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { listarMantenimientoPreventivo } from "../../api/programaMantenimientoPreventivo";
import ListMantenimientoPreventivo from '../../components/MantenimientoPreventivo/ListMantenimientoPreventivo';
import { LogsInformativosLogout } from "../../components/Logs/LogsSistema/LogsSistema";

function MantenimientoPreventivo(props) {
    const { setRefreshCheckLogin, history, location } = props;

    // Para definir el enrutamiento
    const enrutamiento = useNavigate()

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para el registro en el almacen de PT
    const nuevoRegistro = (content) => {
        setTitulosModal("Nuevo registro de mantenimiento");
        setContentModal(content);
        setShowModal(true);
    }

    const cierreAutomatico = () => {
        if (getTokenApi()) {
            if (isExpiredToken(getTokenApi())) {
                LogsInformativosLogout("Sesión finalizada", setRefreshCheckLogin)
                toast.warning("Sesión expirada");
                toast.success("Sesión cerrada por seguridad");
                logoutApi();
                setRefreshCheckLogin(true);
            }
        }
    }

    // Cerrado de sesión automatico
    useEffect(() => {
        cierreAutomatico();
    }, []);
    // Termina cerrado de sesión automatico

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento("/DashboardMantenimiento")
    }

    const [listMantenimientos, setListMantenimientos] = useState(null);

    const cargarDatos = () => {
        try {
            listarMantenimientoPreventivo(getSucursal()).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listMantenimientos && data) {
                    setListMantenimientos(formatModelMantenimientosPreventivos(data));
                } else {
                    const datosMantenimientos = formatModelMantenimientosPreventivos(data);
                    setListMantenimientos(datosMantenimientos);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        cargarDatos();
    }, [location]);

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Programa de mantenimiento preventivo
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Registrar un nuevo programa de mantenimiento preventivo"
                            onClick={() => {
                                nuevoRegistro(
                                    <RegistraMantenimientoPreventivo
                                        setShowModal={setShowModal}
                                        history={history}
                                    />
                                )
                            }}
                        >
                            <FontAwesomeIcon icon={faCirclePlus} /> Registrar
                        </Button>

                        <Button
                            className="btnRegistroVentas"
                            title="Vista completa"
                        >
                            <FontAwesomeIcon icon={faCirclePlus} /> Vista completa
                        </Button>

                        <Button
                            className="btnRegistroVentas"
                            title="Regresar al menú mantimiento"
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
                listMantenimientos ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListMantenimientoPreventivo
                                    listMantenimientos={listMantenimientos}
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

function formatModelMantenimientosPreventivos(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            ident: data.ident,
            descripcion: data.descripcion,
            sucursal: data.sucursal,
            fechasProgramadas: data.fechasProgramadas,
            fechasReales: data.fechasReales,
            comentarios: data.comentarios,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(MantenimientoPreventivo);
