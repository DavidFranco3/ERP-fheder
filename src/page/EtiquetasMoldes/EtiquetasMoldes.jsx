import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { withRouter } from "../../utils/withRouter";
import BasicModal from "../../components/Modal/BasicModal";
import RegistroEtiquetasMoldes from "../../components/EtiquetasMoldes/RegistraEtiquetasMoldes";
import ListEtiquetasMoldes from '../../components/EtiquetasMoldes/ListEtiquetasMoldes';
import { getSucursal, getTokenApi, isExpiredToken, logoutApi } from '../../api/auth';
import { toast } from "react-toastify";
import { listarEtiquetaMolde } from "../../api/etiquetasMoldes";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { LogsInformativosLogout } from "../../components/Logs/LogsSistema/LogsSistema";

function EtiquetasMoldes(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Para definir el enrutamiento
    const enrutamiento = useNavigate()

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para el registro en el almacen de PT
    const nuevoRegistro = (content) => {
        setTitulosModal("Nueva etiqueta de molde");
        setContentModal(content);
        setShowModal(true);
    }

    // Recuperación de la razón social seleccionada
    const [razonSocialElegida, setRazonSocialElegida] = useState("Sin Selección");

    const cargarRazonSocial = () => {
        if (getSucursal()) {
            setRazonSocialElegida(getSucursal)
        } else {
            setRazonSocialElegida("Sin Selección")
        }
    }

    useEffect(() => {
        cargarRazonSocial();
    }, []);
    // Termina recuperación de la razón social recuperada

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

    const rutaRegreso = () => {
        enrutamiento("/DashboardCatalogos")
    }

    // Para almacenar la lista de las integraciones de ventas y gastos
    const [listEtiquetas, setListEtiquetas] = useState(null);

    const cargarDatos = () => {
        try {
            listarEtiquetaMolde(getSucursal()).then(response => {
                const { data } = response;

                if (!listEtiquetas && data) {
                    setListEtiquetas(formatModelEtiquetaMolde(data));
                } else {
                    const datosEtiquetas = formatModelEtiquetaMolde(data);
                    setListEtiquetas(datosEtiquetas);
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
            {
                razonSocialElegida === "Sin Selección" ?
                    (
                        <>
                            <Lottie
                                loop={true}
                                play={true}
                                animationData={AnimacionLoading}
                            />
                        </>
                    )
                    :
                    (
                        <>
                            <Alert>
                                <Row>
                                    <Col xs={12} md={8}>
                                        <h1>
                                            Moldes
                                        </h1>
                                    </Col>
                                    <Col xs={6} md={4}>
                                        <Button
                                            className="btnRegistroVentas"
                                            title="Registrar una nueva etiqueta de moldes"
                                            onClick={() => {
                                                nuevoRegistro(
                                                    <RegistroEtiquetasMoldes
                                                        setShowModal={setShowModal}
                                                        history={history}
                                                    />
                                                )
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faCirclePlus} /> Registro
                                        </Button>
                                        <Button
                                            className="btnRegistroVentas"
                                            title="Regresar al menú mantenimiento"
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
                                listEtiquetas ?
                                    (
                                        <>
                                            <Suspense fallback={<Spinner />}>
                                                <ListEtiquetasMoldes
                                                    listEtiquetas={listEtiquetas}
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
                        </>
                    )}

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

function formatModelEtiquetaMolde(data) {
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

export default withRouter(EtiquetasMoldes);
