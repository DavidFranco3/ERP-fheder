import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { withRouter } from "../../utils/withRouter";
import BasicModal from "../../components/Modal/BasicModal";
import RegistraInventarioMoldes from "../../components/InventarioMoldes/RegistraInventarioMoldes";
import { getSucursal, getTokenApi, isExpiredToken, logoutApi } from '../../api/auth';
import { toast } from "react-toastify";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { listarInventarioMolde } from "../../api/inventarioMoldes";
import ListInventarioMolde from '../../components/InventarioMoldes/ListInventarioMolde';
import { LogsInformativosLogout } from "../../components/Logs/LogsSistema/LogsSistema";

function InventarioMoldes(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Para definir el enrutamiento
    const enrutamiento = useNavigate()

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para el registro en el almacen de PT
    const nuevoRegistro = (content) => {
        setTitulosModal("Nuevo molde");
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

    const rutaRegreso = () => {
        enrutamiento("/DashboardMantenimiento")
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

    // Para almacenar la lista de pedidos de venta
    const [listInventarios, setListInventarios] = useState(null);

    const cargarDatos = () => {
        try {
            listarInventarioMolde(getSucursal()).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listInventarios && data) {
                    setListInventarios(formatModelInventariosMolde(data));
                } else {
                    const datosInventario = formatModelInventariosMolde(data);
                    setListInventarios(datosInventario);
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
                                            Inventarios de moldes
                                        </h1>
                                    </Col>
                                    <Col xs={6} md={4}>
                                        <Button
                                            className="btnRegistroVentas"
                                            title="Registrar un nuevo molde"
                                            onClick={() => {
                                                nuevoRegistro(
                                                    <RegistraInventarioMoldes
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
                                listInventarios ?
                                    (
                                        <>
                                            <Suspense fallback={<Spinner />}>
                                                <ListInventarioMolde
                                                    listInventarios={listInventarios}
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

function formatModelInventariosMolde(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            noInterno: data.noInterno,
            cliente: data.cliente,
            noMolde: data.noMolde,
            cavMolde: data.cavMolde,
            noParte: data.noParte,
            descripcion: data.descripcion,
            sucursal: data.sucursal,
            statusMolde: data.statusMolde,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(InventarioMoldes);
