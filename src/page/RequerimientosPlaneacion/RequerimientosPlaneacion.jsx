import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner, Form, Tabs, Tab } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { withRouter } from "../../utils/withRouter";
import { toast } from "react-toastify";
import ListRequerimientosPlaneacion from "../../components/RequerimientosPlaneacion/ListProduccion/";
import ListProgramaProduccionMaquinas from '../../components/RequerimientosPlaneacion/ListProgramaProduccionMaquinas';
import Graficas from '../../components/RequerimientosPlaneacion/Graficas';
import { listarRequerimientoPorSemana } from "../../api/requerimientosPlaneacion";
import "./RequerimientosPlaneacion.scss"
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { LogsInformativosLogout } from "../../components/Logs/LogsSistema/LogsSistema";
import { obtenerDatosSemana } from "../../api/semana";
import 'dayjs/locale/es'
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

function RequerimientosPlaneacion(props) {
    const { setRefreshCheckLogin, location, history } = props;
    const [tab, setTab] = useState('general');

    dayjs.locale('es') // use Spanish locale globally
    dayjs.extend(localizedFormat)

    // Para definir el enrutamiento
    const enrutamiento = useNavigate();

    const params = useParams();
    const { semana } = params;

    // Para almacenar la lista de las integraciones de ventas y gastos
    const [folio, setFolio] = useState("");
    const [fechaInicial, setFechaInicial] = useState("");
    const [fechaFinal, setFechaFinal] = useState("");

    const cargarDatosSemana = () => {
        try {
            obtenerDatosSemana(semana).then(response => {
                const { data } = response;
                setFolio(data.folio);
                setFechaInicial(data.fechaInicial);
                setFechaFinal(data.fechaFinal);
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        cargarDatosSemana();
    }, [location]);

    // Define la ruta de registro
    const rutaRegistro = () => {
        enrutamiento(`/RegistraRequerimientosPlaneacion/${semana}`)
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
    const [listRequerimientosPlaneacion, setListRequerimientosPlaneacion] = useState(null);

    const cargarDatos = () => {
        try {
            listarRequerimientoPorSemana(getSucursal(), semana).then(response => {
                const { data } = response;

                if (!listRequerimientosPlaneacion && data) {
                    setListRequerimientosPlaneacion(formatModelRequerimientosPlaneacion(data));
                } else {
                    const datosRequerimiento = formatModelRequerimientosPlaneacion(data);
                    setListRequerimientosPlaneacion(datosRequerimiento);
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
        enrutamiento("/Semana")
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
                                            Planeación
                                        </h1>
                                    </Col>
                                    <Col xs={6} md={4}>
                                        <Button
                                            className="btnRegistroVentas"
                                            title="Registrar un nuevo requerimiento y planeación"
                                            onClick={() => {
                                                rutaRegistro()
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

                            <Row>
                                <Col xs={6} md={4}>

                                </Col>
                                <Col xs={8} md={6}>
                                    <Form.Label>
                                        {folio} [{dayjs(fechaInicial).format("LL")} al {dayjs(fechaFinal).format("LL")}]
                                    </Form.Label>
                                </Col>
                            </Row>

                            {
                                listRequerimientosPlaneacion ?
                                    (
                                        <>
                                            <Tabs
                                                activeKey={tab}
                                                onSelect={(k) => setTab(k)}
                                                className="flex w-full"
                                                id="uncontrolled-tab-estados"
                                            >
                                                <Tab
                                                    key={0}
                                                    tabClassName="font-semibold text-lg"
                                                    eventKey="general"
                                                    title="Vista por programas"
                                                >
                                                    <br />

                                                    <Suspense fallback={<Spinner />}>
                                                        <ListRequerimientosPlaneacion
                                                            listRequerimientosPlaneacion={listRequerimientosPlaneacion}
                                                            location={location}
                                                            history={history}
                                                            setRefreshCheckLogin={setRefreshCheckLogin}
                                                        />
                                                    </Suspense>
                                                </Tab>

                                                <Tab
                                                    key={1}
                                                    tabClassName="font-semibold text-lg"
                                                    eventKey="maquina"
                                                    title="Vista por maquinas"
                                                >
                                                    <br />

                                                    <Suspense fallback={<Spinner />}>
                                                        <ListProgramaProduccionMaquinas
                                                            listProgramaProduccion={listRequerimientosPlaneacion}
                                                            location={location}
                                                            history={history}
                                                            setRefreshCheckLogin={setRefreshCheckLogin}
                                                        />
                                                    </Suspense>
                                                </Tab>

                                                <Tab
                                                    key={2}
                                                    tabClassName="font-semibold text-lg"
                                                    eventKey="graficas"
                                                    title="Graficas"
                                                >
                                                    <br />

                                                    <Suspense fallback={<Spinner />}>
                                                        <Graficas
                                                            listProgramaProduccion={listRequerimientosPlaneacion}
                                                            location={location}
                                                            history={history}
                                                            setRefreshCheckLogin={setRefreshCheckLogin}
                                                        />
                                                    </Suspense>
                                                </Tab>
                                            </Tabs>
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

function formatModelRequerimientosPlaneacion(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            semana: data.semana,
            acumulado: data.acumulado,
            sucursal: data.sucursal,
            requerimiento: data.requerimiento,
            planeacion: data.planeacion,
            bom: data.bom,
            programa: data.programa,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(RequerimientosPlaneacion);
