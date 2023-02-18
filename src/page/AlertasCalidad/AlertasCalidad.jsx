import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { getSucursal, getTokenApi, isExpiredToken, logoutApi } from '../../api/auth';
import { toast } from "react-toastify";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import "./AlertasCalidad.scss";
import { listarAlertasCalidad } from "../../api/alertasCalidad";
import ListAlertasCalidad from '../../components/AlertasCalidad/ListAlertasCalidad';
import { withRouter } from "../../utils/withRouter";

function AlertasCalidad(props) {
    const { location, history, setRefreshCheckLogin } = props;

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

    // Para definir el enrutamiento
    const enrutamiento = useNavigate();

    // Define la ruta de registro
    const rutaRegistro = () => {
        enrutamiento("/RegistroAlertasCalidad")
    }

    const rutaRegreso = () => {
        enrutamiento("/DashboardCalidad")
    }

    // Para almacenar la lista de pedidos de venta
    const [listAlertasCalidad, setListAlertasCalidad] = useState(null);

    useEffect(() => {
        try {
            listarAlertasCalidad(getSucursal()).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listAlertasCalidad && data) {
                    setListAlertasCalidad(formatModelAlertasCalidad(data));
                } else {
                    const datosAlertas = formatModelAlertasCalidad(data);
                    setListAlertasCalidad(datosAlertas);
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
                                            Alertas de calidad
                                        </h1>
                                    </Col>
                                    <Col xs={6} md={4}>
                                        <Button
                                            className="btnRegistroVentas"
                                            title="Registrar una nueva alerta de calidad"
                                            onClick={() => {
                                                rutaRegistro()
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faCirclePlus} /> Registrar
                                        </Button>
                                        <Button
                                            className="btnRegistroVentas"
                                            title="Regresar a la pagina anterior"
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
                                listAlertasCalidad ?
                                    (
                                        <>
                                            <Suspense fallback={<Spinner />}>
                                                <ListAlertasCalidad
                                                    listAlertasCalidad={listAlertasCalidad}
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
        </>
    );
}

function formatModelAlertasCalidad(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            fecha: data.fecha,
            cliente: data.cliente,
            sucursal: data.sucursal,
            descripcionPieza: data.descripcionPieza,
            descripcionNoConformidad: data.descripcionNoConformidad,
            cantidadPiezasCondicion: data.cantidadPiezasCondicion,
            referencia: data.referencia,
            accionContencion: data.accionContencion,
            accionCorrectiva: data.accionCorrectiva,
            autorizo: data.autorizo,
            elaboro: data.elaboro,
            observaciones: data.observaciones,
            listaFirmas: data.listaFirmas,
            referenciaNoConformidad: data.referenciaNoConformidad,
            condicionIncorrecta: data.condicionIncorrecta,
            condicionCorrecta: data.condicionIncorrecta,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(AlertasCalidad);
