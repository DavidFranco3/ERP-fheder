import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory, withRouter } from "react-router-dom";
import BasicModal from "../../components/Modal/BasicModal";
import RegistrarSemana from "../../components/Semana/RegistraSemana";
import ListSemanas from "../../components/Semana/ListSemanas";
import { listarSemana } from "../../api/semana";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import { toast } from "react-toastify";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function Semana(props) {
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

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para registrar los materiales
    const registraSemana = (content) => {
        setTitulosModal("Nueva semana");
        setContentModal(content);
        setShowModal(true);
    }

    // Para almacenar la lista de las integraciones de ventas y gastos
    const [listSemanas, setListSemanas] = useState(null);

    useEffect(() => {
        try {
            listarSemana(getSucursal()).then(response => {
                const { data } = response;

                if (!listSemanas && data) {
                    setListSemanas(formatModelSemana(data));
                } else {
                    const datosSemanas = formatModelSemana(data);
                    setListSemanas(datosSemanas);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    const rutaRegreso = () => {
        enrutamiento.push("/DashboardPlaneacion")
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Programa de producción
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Registrar un nuevo programa de producción del mes"
                            onClick={() => {
                                registraSemana(
                                    <RegistrarSemana
                                        setShowModal={setShowModal}
                                        showModal={showModal}
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
                listSemanas ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListSemanas
                                    listSemanas={listSemanas}
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

function formatModelSemana(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            fechaInicial: data.fechaInicial,
            fechaFinal: data.fechaFinal,
            sucursal: data.sucursal,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Semana);
