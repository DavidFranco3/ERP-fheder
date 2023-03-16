import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner, Tabs, Tab, } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { withRouter } from "../../utils/withRouter";
import { toast } from "react-toastify";
import ListNotasCargo from "../../components/Notas/ListNotasCargo";
import ListNotasCredito from "../../components/Notas/ListNotasCredito";
import ListNotasDevolucion from "../../components/Notas/ListNotasDevolucion";
import { listarNotasPorTipo } from "../../api/notas";
import "./Notas.scss"
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import { obtenerUsuario } from "../../api/usuarios";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { LogsInformativosLogout } from "../../components/Logs/LogsSistema/LogsSistema";

function Notas(props) {
    const { setRefreshCheckLogin, location, history } = props;
    const [tab, setTab] = useState('general')

    const enrutamiento = useNavigate();

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
    const [listNotasCargo, setListNotasCargo] = useState(null);

    const cargarDatosCargo = () => {
        try {
            listarNotasPorTipo("Cargo", getSucursal()).then(response => {
                const { data } = response;

                console.log(data);

                if (!listNotasCargo && data) {
                    setListNotasCargo(formatModelNotas(data));
                } else {
                    const datosNotas = formatModelNotas(data);
                    setListNotasCargo(datosNotas);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        cargarDatosCargo();
    }, [location]);

    // Para almacenar la lista de pedidos de venta
    const [listNotasCredito, setListNotasCredito] = useState(null);

    const cargarDatosCredito = () => {
        try {
            listarNotasPorTipo("Credito", getSucursal()).then(response => {
                const { data } = response;

                console.log(data);

                if (!listNotasCredito && data) {
                    setListNotasCredito(formatModelNotas(data));
                } else {
                    const datosNotas = formatModelNotas(data);
                    setListNotasCredito(datosNotas);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        cargarDatosCredito();
    }, [location]);

    // Para almacenar la lista de pedidos de venta
    const [listNotasDevolucion, setListNotasDevolucion] = useState(null);

    const cargarDatosDevolucion = () => {
        try {
            listarNotasPorTipo("Devolución", getSucursal()).then(response => {
                const { data } = response;

                console.log(data);

                if (!listNotasDevolucion && data) {
                    setListNotasDevolucion(formatModelNotas(data));
                } else {
                    const datosNotas = formatModelNotas(data);
                    setListNotasDevolucion(datosNotas);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        cargarDatosDevolucion();
    }, [location]);

    // Para ir hacia la ruta de registro del pedido de venta
    const rutaRegistroNota = () => {
        enrutamiento("/RegistroNota")
    }

    const rutaRegreso = () => {
        enrutamiento("/DashboardCuentasPorCobrar")
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
                                            Notas
                                        </h1>
                                    </Col>
                                    <Col xs={6} md={4}>
                                        <Button
                                            className="btnRegistroVentas"
                                            title="Registrar una nueva nota"
                                            onClick={() => {
                                                rutaRegistroNota()
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faCirclePlus} /> Registrar
                                        </Button>
                                        <Button
                                            className="btnRegistroVentas"
                                            title="Regresar al menú ventas"
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
                                listNotasCargo && listNotasCredito && listNotasDevolucion ?
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
                                                    title="Cargo"
                                                >
                                                    <br />

                                                    <Suspense fallback={<Spinner />}>
                                                        <ListNotasCargo
                                                            listNotas={listNotasCargo}
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
                                                    title="Credito"
                                                >
                                                    <br />

                                                    <Suspense fallback={<Spinner />}>
                                                        <ListNotasCredito
                                                            listNotas={listNotasCredito}
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
                                                    title="Devolución"
                                                >
                                                    <br />

                                                    <Suspense fallback={<Spinner />}>
                                                        <ListNotasDevolucion
                                                            listNotas={listNotasDevolucion}
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

function formatModelNotas(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            factura: data.factura,
            tipo: data.tipo,
            concepto: data.concepto,
            totalSinIva: data.totalSinIva,
            iva: data.iva,
            total: data.total,
            sucursal: data.sucursal,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Notas);
