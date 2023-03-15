import { useEffect, useState, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import { toast } from "react-toastify";
import { listarInspeccion } from "../../api/inspeccionMaterial";
import { useNavigate } from "react-router-dom";
import { withRouter } from "../../utils/withRouter";
import ListInspeccion from "../../components/Calidad/ListCalidad"
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { LogsInformativosLogout } from "../../components/Logs/LogsSistema/LogsSistema";

function Calidad(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Para definir el enrutamiento
    const enrutamiento = useNavigate()

    // Define la ruta de registro
    const rutaRegistro = () => {
        enrutamiento("/RegistroReporte")
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

    // Para almacenar el listado de compras realizadas
    const [listInspeccion, setListInspeccion] = useState(null);

    const cargarDatos = () => {
        try {
            listarInspeccion(getSucursal()).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listInspeccion && data) {
                    setListInspeccion(formatModelInspeccion(data));
                } else {
                    const datosInspeccion = formatModelInspeccion(data);
                    setListInspeccion(datosInspeccion);
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

    const rutaRegreso = () => {
        enrutamiento("/DashboardCalidad")
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
                                            Inspeccion de calidad de material
                                        </h1>
                                    </Col>
                                    <Col xs={6} md={4}>
                                        <Button
                                            className="btnRegistroVentas"
                                            title="Registrar un nuevo reporte de calidad"
                                            onClick={() => {
                                                rutaRegistro()
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faCirclePlus} /> Registrar
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
                                listInspeccion ?
                                    (
                                        <>
                                            <Suspense fallback={<Spinner />}>
                                                <ListInspeccion
                                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                                    listInspeccion={listInspeccion}
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
        </>
    );
}

function formatModelInspeccion(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            sucursal: data.sucursal,
            ordenVenta: data.ordenVenta,
            fecha: data.fecha,
            lote: data.lote,
            propiedad: data.propiedad,
            tipoMaterial: data.tipoMaterial,
            nombre: data.nombre,
            cantidad: data.cantidad,
            etiqueta: data.etiqueta,
            unidadMedida: data.unidadMedida,
            nombreRecibio: data.nombreRecibio,
            estadoMateriaPrima: data.estadoMateriaPrima,
            contaminacion: data.contaminacion,
            presentaHumedad: data.presentaHumedad,
            certificadoCalidad: data.certificadoCalidad,
            empaqueDañado: data.empaqueDañado,
            resultadoFinalInspeccion: data.resultadoFinalInspeccion,
            observaciones: data.observaciones,
            estado: data.estado,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Calidad);
