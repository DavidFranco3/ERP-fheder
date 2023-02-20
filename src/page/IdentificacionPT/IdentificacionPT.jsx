import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { withRouter } from "../../utils/withRouter";
import BasicModal from "../../components/Modal/BasicModal";
import RegistroIdentificacionPT from "../../components/IdentificacionPT/RegistroIdentificacionPT";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { listarEtiquetaPT } from "../../api/etiquetaIdentificacionPT";
import ListEtiquetasPT from '../../components/IdentificacionPT/ListEtiquetasPT';
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import { toast } from "react-toastify";

function IdentificacionPT(props) {
    const { setRefreshCheckLogin, location, history } = props;

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

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para el registro en el almacen de mp
    const nuevaEtiqueta = (content) => {
        setTitulosModal("Nueva etiqueta de Id. PT");
        setContentModal(content);
        setShowModal(true);
    }

    // Para definir el enrutamiento
    const enrutamiento = useNavigate()

    // Define la ruta de registro
    const rutaRegistro = () => {
        enrutamiento("/RegistroReporte")
    }

    const rutaRegreso = () => {
        enrutamiento("/DashboardProduccion")
    }

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

    // Para almacenar el listado de compras realizadas
    const [listEtiquetas, setListEtiquetas] = useState(null);

    useEffect(() => {
        try {
            listarEtiquetaPT(getSucursal()).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listEtiquetas && data) {
                    setListEtiquetas(formatModelEtiquetas(data));
                } else {
                    const datosEtiquetas = formatModelEtiquetas(data);
                    setListEtiquetas(datosEtiquetas);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
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
                                            Etiqueta de identificacion PT
                                        </h1>
                                    </Col>
                                    <Col xs={6} md={4}>
                                        <Button
                                            className="btnRegistroVentas"
                                            title="Registrar una nueva etiqueta de identificación de producto terminado"
                                            onClick={() => {
                                                nuevaEtiqueta(
                                                    <RegistroIdentificacionPT
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
                                            title="Regresar al menú producción"
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
                                                <ListEtiquetasPT
                                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                                    listEtiquetas={listEtiquetas}
                                                    history={history}
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

function formatModelEtiquetas(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            sucursal: data.sucursal,
            fecha: data.fecha,
            descripcion: data.descripcion,
            noParte: data.noParte,
            noOrden: data.noOrden,
            cantidad: data.cantidad,
            turno: data.turno,
            operador: data.operador,
            supervisor: data.supervisor,
            inspector: data.inspector,
            estado: data.estado,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(IdentificacionPT);
