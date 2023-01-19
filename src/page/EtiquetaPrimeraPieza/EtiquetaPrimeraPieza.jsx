import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory, withRouter } from "react-router-dom";
import BasicModal from "../../components/Modal/BasicModal";
import RegistroPrimeraPieza from "../../components/EtiquetaPrimeraPieza/RegistraPrimeraPieza";
import { listarEtiquetasPiezas } from "../../api/etiquetaPrimeraPieza";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal} from "../../api/auth";
import { toast } from "react-toastify";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import ListEtiquetasPrimeraPieza from '../../components/EtiquetaPrimeraPieza/ListEtiquetasPrimeraPieza';

function EtiquetaPrimeraPieza(props) {
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

    // Para el registro en el almacen de mp
    const nuevaEtiqueta1eraPieza = (content) => {
        setTitulosModal("Nuevo etiqueta 1ra pieza");
        setContentModal(content);
        setShowModal(true);
    }

    // Para almacenar la lista de las integraciones de ventas y gastos
    const [listEtiquetas, setListEtiquetas] = useState(null);

    useEffect(() => {
        try {
            listarEtiquetasPiezas(getSucursal()).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listEtiquetas && data) {
                    setListEtiquetas(formatModelEtiquetaPrimeraPieza(data));
                } else {
                    const datosEtiquetas = formatModelEtiquetaPrimeraPieza(data);
                    setListEtiquetas(datosEtiquetas);
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
        enrutamiento.push("/DashboardCalidad")
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Registro de primera pieza
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Registrar nueva etiqueta de 1era pieza"
                            onClick={() => {
                                nuevaEtiqueta1eraPieza(
                                    <RegistroPrimeraPieza
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
                            title="Regresar al menu calidad"
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
                                <ListEtiquetasPrimeraPieza
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

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

function formatModelEtiquetaPrimeraPieza(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            sucursal: data.sucursal,
            fecha: data.fecha,
            noMaquina: data.noMaquina,
            descripcionProducto: data.descripcionProducto,
            cliente: data.cliente,
            peso: data.peso,
            noCavidades: data.noCavidades,
            turno: data.turno,
            inspector: data.inspector,
            supervisor: data.supervisor,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(EtiquetaPrimeraPieza);
