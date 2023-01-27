import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory, withRouter, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ListProgramaProduccion from "../../components/ProgramaProduccion/ListProgramaProduccion";
import { listarProgramaPorSemana } from "../../api/programaProduccion";
import { obtenerDatosSemana } from "../../api/semana";
import "./ProgramaProduccion.scss"
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import 'dayjs/locale/es'
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

function ProgramaProduccion(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Para definir el enrutamiento
    const enrutamiento = useHistory();

    dayjs.locale('es') // use Spanish locale globally
    dayjs.extend(localizedFormat)

    const params = useParams();
    const { semana } = params;

    // Para almacenar la lista de las integraciones de ventas y gastos
    const [folio, setFolio] = useState("");
    const [fechaInicial, setFechaInicial] = useState("");
    const [fechaFinal, setFechaFinal] = useState("");

    useEffect(() => {
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
    }, [location]);

    // Define la ruta de registro
    const rutaRegistro = () => {
        enrutamiento.push(`/RegistroProgramaProduccion/${semana}`);
    }

    // Para almacenar la lista de pedidos de venta
    const [listProgramaProduccion, setListProgramaProduccion] = useState(null);

    // Para determinar si hay conexion al servidor o a internet
    const [conexionInternet, setConexionInternet] = useState(true);

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

    useEffect(() => {
        try {
            listarProgramaPorSemana(getSucursal(), semana).then(response => {
                const { data } = response;

                if (!listProgramaProduccion && data) {
                    setListProgramaProduccion(formatModelProgramaProduccion(data));
                } else {
                    const datosPrograma = formatModelProgramaProduccion(data);
                    setListProgramaProduccion(datosPrograma);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);

    const rutaRegreso = () => {
        enrutamiento.push("/Semana")
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Programa producción
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Registrar un nuevo programa de produccion"
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
                listProgramaProduccion ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListProgramaProduccion
                                    listProgramaProduccion={listProgramaProduccion}
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
    );
}

function formatModelProgramaProduccion(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            folioOP: data.folioOP,
            ordenProduccion: data.ordenProduccion,
            programa: data.programa,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
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

export default withRouter(ProgramaProduccion);
