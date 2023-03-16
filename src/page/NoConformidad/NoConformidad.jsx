import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { withRouter } from "../../utils/withRouter";
import { getSucursal, getTokenApi, isExpiredToken, logoutApi } from '../../api/auth';
import { toast } from "react-toastify";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import "./NoConformidad.scss";
import { listarNoConformidad } from "../../api/noConformidad";
import ListNoConformidad from '../../components/NoConformidad/ListNoConformidad';
import { LogsInformativosLogout } from "../../components/Logs/LogsSistema/LogsSistema";

function NoConformidad(props) {
    const { location, history, setRefreshCheckLogin } = props;

    // Para definir el enrutamiento
    const enrutamiento = useNavigate()

    // Define la ruta de registro
    const rutaRegistro = () => {
        enrutamiento("/RegistroNoConformidad")
    }

    const rutaRegreso = () => {
        enrutamiento("/DashboardCalidad")
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

    // Para almacenar la lista de pedidos de venta
    const [listNoConformidad, setListNoConformidad] = useState(null);

    const cargarDatos = () => {
        try {
            listarNoConformidad(getSucursal()).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listNoConformidad && data) {
                    setListNoConformidad(formatModelNoConformidad(data));
                } else {
                    const datosConformidad = formatModelNoConformidad(data);
                    setListNoConformidad(datosConformidad);
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
                                            Control de No Conformidad
                                        </h1>
                                    </Col>
                                    <Col xs={6} md={4}>
                                        <Button
                                            className="btnRegistroVentas"
                                            title="Registrar una nueva no conformidad"
                                            onClick={() => {
                                                rutaRegistro()
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faCirclePlus} /> Registrar
                                        </Button>
                                        <Button
                                            className="btnRegistroVentas"
                                            title="Nuevo reporte"
                                            onClick={() => {

                                            }}
                                        >
                                            <FontAwesomeIcon icon={faCirclePlus} /> Nuevo reporte
                                        </Button>
                                        <Button
                                            className="btnRegistroVentas"
                                            title="Regresar al menú calidad"
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
                                listNoConformidad ?
                                    (
                                        <>
                                            <Suspense fallback={<Spinner />}>
                                                <ListNoConformidad
                                                    listNoConformidad={listNoConformidad}
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

function formatModelNoConformidad(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            descripcionNoConformidad: data.descripcionNoConformidad,
            correccion: data.correccion,
            analisisCausaRaiz: data.analisisCausaRaiz,
            diagrama: data.diagrama,
            causaRaiz: data.causaRaiz,
            accionCorrectiva: data.accionCorrectiva,
            fecha: data.fecha,
            status: data.status,
            responsables: data.responsables,
            fechaCierre: data.fechaCierre,
            statusFinal: data.statusFinal,
            sucursal: data.sucursal,
            evidencia: data.evidencia,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(NoConformidad);
