import { useState, useEffect, Suspense } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { withRouter } from "../../utils/withRouter";
import "./Sucursales.scss";
import { listarSucursales } from "../../api/sucursales";
import { toast } from "react-toastify";
import ListSucursales from "../../components/Sucursales/ListSucursales";
import RegistroSucursales from "../../components/Sucursales/Registro";
import BasicModal from "../../components/Modal/BasicModal";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { LogsInformativosLogout } from "../../components/Logs/LogsSistema/LogsSistema";

function Sucursales(props) {
    const { setRefreshCheckLogin, location, history } = props;

    const enrutamiento = useNavigate();

    const rutaRegreso = () => {
        enrutamiento("/DashboardConfiguracion")
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

    // Para almacenar los usuarios
    const [listSucursales, setListSucursales] = useState(null);

    const cargarDatos = () => {
        try {
            listarSucursales(getSucursal()).then(response => {
                const { data } = response;

                if (!listSucursales && data) {
                    setListSucursales(formatModelSucursales(data));
                } else {
                    const datosSucursales = formatModelSucursales(data);
                    setListSucursales(datosSucursales);
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
                                            Mis sucursales
                                        </h1>
                                    </Col>
                                    <Col xs={6} md={4}>
                                        <Button
                                            className="btnRegistroVentas"
                                            title="Registrar una nueva sucursal"
                                            onClick={() => {
                                                nuevoRegistro(
                                                    <RegistroSucursales
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
                                            title="Regresar al menú configuración"
                                            onClick={() => {
                                                rutaRegreso()
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faArrowCircleLeft} /> Regresar
                                        </Button>
                                    </Col>
                                </Row>
                            </Alert>

                            {listSucursales ?
                                (
                                    <>
                                        <Suspense fallback={<Spinner />}>
                                            <ListSucursales
                                                listSucursales={listSucursales}
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

function formatModelSucursales(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        const { direccion: { calle, numeroExterior, numeroInterior, municipio, estado, codigoPostal } } = data;
        dataTemp.push({
            id: data._id,
            nombre: data.nombre,
            sucursal: data.sucursal,
            calle: calle,
            numeroExterior: numeroExterior,
            numeroInterior: numeroInterior,
            municipio: municipio,
            estado: estado,
            codigoPostal: codigoPostal,
            estadoSucursal: data.estadoSucursal,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Sucursales);
