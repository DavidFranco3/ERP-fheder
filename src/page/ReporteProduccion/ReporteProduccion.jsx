import { useEffect, useState, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { getTokenApi, isExpiredToken, logoutApi } from "../../api/auth";
import { toast } from "react-toastify";
import { useHistory, withRouter } from "react-router-dom";
import { listarReportesProduccionPaginacion, totalReportesProduccion } from "../../api/reporteProduccion";
import "./ReporteProduccion.scss";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import ListReporteProduccion from '../../components/ReporteProduccion/ListReporteProduccion';

function ReporteProduccion(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegistro = () => {
        enrutamiento.push("/RegistroReporteProduccion")
    }

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

    const rutaRegreso = () => {
        enrutamiento.push("/DashboardProduccion")
    }

    // Para almacenar la lista de pedidos de venta
    const [listProduccion, setListProduccion] = useState(null);

    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalProduccion, setNoTotalProduccion] = useState(0);

    useEffect(() => {
        try {
            totalReportesProduccion().then(response => {
                const { data } = response;
                setNoTotalProduccion(data)
            })

            // listarOrdenesCompraPaginacion(page, rowsPerPage)
            if (page === 0) {
                setPage(1)
                listarReportesProduccionPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response;
                    if (!listProduccion && data) {
                        setListProduccion(formatModelProduccion(data));
                    } else {
                        const datosProduccion = formatModelProduccion(data);
                        setListProduccion(datosProduccion);
                    }
                }).catch(e => {
                    // console.log(e)
                })
            } else {
                listarReportesProduccionPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response;
                    if (!listProduccion && data) {
                        setListProduccion(formatModelProduccion(data));
                    } else {
                        const datosProduccion = formatModelProduccion(data);
                        setListProduccion(datosProduccion);
                    }
                }).catch(e => {
                    console.log(e)
                })
            }

        } catch (e) {
            console.log(e)
        }
    }, [location, page, rowsPerPage]);

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Reporte de producción
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            onClick={() => {
                                rutaRegistro()
                            }}
                        >
                            <FontAwesomeIcon icon={faCirclePlus} /> Nuevo reporte
                        </Button>
                        <Button
                            className="btnRegistroVentas"
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
                listProduccion ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListReporteProduccion
                                    listProduccion={listProduccion}
                                    location={location}
                                    history={history}
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    rowsPerPage={rowsPerPage}
                                    setRowsPerPage={setRowsPerPage}
                                    page={page}
                                    setPage={setPage}
                                    noTotalProduccion={noTotalProduccion}
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

function formatModelProduccion(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            fecha: data.fecha,
            asistencias: data.asistencias,
            faltas: data.faltas,
            supervisor: data.supervisor,
            turno: data.turno,
            registros: data.registros,
            eficienciaGeneralMaquinas: data.eficienciaGeneralMaquinas,
            observacionesTurno: data.observacionesTurno,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(ReporteProduccion);
