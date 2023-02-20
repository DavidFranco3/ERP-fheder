import { useState, useEffect, Suspense } from 'react';
import "./UnidadesMedida.scss";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faPlus, faUsers, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { listarUM } from "../../api/unidadesMedida";
import { useNavigate } from "react-router-dom";
import { withRouter } from "../../utils/withRouter";
import ListUnidadesMedida from "../../components/UnidadesMedida/ListUnidadesMedida";
import BasicModal from "../../components/Modal/BasicModal";
import RegistroUnidadesMedida from "../../components/UnidadesMedida/Registro";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import { toast } from "react-toastify";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function UnidadesMedida(props) {
    const { setRefreshCheckLogin, location, history } = props;

    const enrutamiento = useNavigate();

    const rutaRegreso = () => {
        enrutamiento("/DashboardConfiguracion")
    }

    // Para almacenar los departamentos
    const [listUM, setListUM] = useState(null);

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Cerrado de sesión automatico
    useEffect(() => {
        if (getTokenApi()) {
            if (isExpiredToken(getTokenApi())) {
                toast.warning("Sesión expirada");
                toast.success("Sesión cerrada por seguridad");
                logoutApi();
                enrutamiento("");
                setRefreshCheckLogin(true);
            }
        }
    }, []);
    // Termina cerrado de sesión automatico

    // Recuperación de la razón social seleccionada
    const [razonSocialElegida, setRazonSocialElegida] = useState("Sin Selección");

    useEffect(() => {
        if (getSucursal()) {
            setRazonSocialElegida(getSucursal)
        } else {
            setRazonSocialElegida("Sin Selección")
        }
    }, []);
    // Termina recuperación de la razón social recuperada

    useEffect(() => {
        try {
            listarUM(getSucursal()).then(response => {
                const { data } = response;

                if (!listUM && data) {
                    setListUM(formatModelUM(data));
                } else {
                    const datosUM = formatModelUM(data);
                    setListUM(datosUM);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);

    // Para guardar un nuevo dato
    const registraUM = (content) => {
        setTitulosModal("Registrando");
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
                                            Mis unidades de medida
                                        </h1>
                                    </Col>
                                    <Col xs={6} md={4}>
                                        <Button
                                            className="btnRegistroVentas"
                                            title="Registrar una nueva unidad de medida"
                                            onClick={() => {
                                                registraUM(
                                                    <RegistroUnidadesMedida
                                                        setShowModal={setShowModal}
                                                        history={history} />
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

                            {
                                listUM ?
                                    (
                                        <>
                                            <Suspense fallback={<Spinner />}>
                                                <ListUnidadesMedida
                                                    listUM={listUM}
                                                    history={history}
                                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                                    location={location}
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

function formatModelUM(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            nombre: data.nombre,
            sucursal: data.sucursal,
            estadoUM: data.estadoUM,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(UnidadesMedida);
