import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory, withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import ListRequerimientosPlaneacion from "../../components/RequerimientosPlaneacion/ListProduccion/";
import { listarRequerimientoPaginacion, totalRequerimiento } from "../../api/requerimientosPlaneacion";
import "./RequerimientosPlaneacion.scss"
import { getTokenApi, isExpiredToken, logoutApi } from "../../api/auth";
import LayoutPrincipal from "../../layout/layoutPrincipal";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function RequerimientosPlaneacion(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegistro = () => {
        enrutamiento.push("RegistraRequerimientosPlaneacion")
    }

    // Para almacenar la lista de pedidos de venta
    const [listRequerimientosPlaneacion, setListRequerimientosPlaneacion] = useState(null);

    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalRequerimientos, setNoTotalRequerimientos] = useState(0);

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
            totalRequerimiento().then(response => {
                const { data } = response;
                setNoTotalRequerimientos(data)
            })

            // listarOrdenesCompraPaginacion(page, rowsPerPage)
            if (page === 0) {
                setPage(1)
                listarRequerimientoPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response;
                    if (!listRequerimientosPlaneacion && data) {
                        setListRequerimientosPlaneacion(formatModelRequerimientosPlaneacion(data));
                    } else {
                        const datosVentas = formatModelRequerimientosPlaneacion(data);
                        setListRequerimientosPlaneacion(datosVentas);
                    }
                }).catch(e => {
                    // console.log(e)
                })
            } else {
                listarRequerimientoPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response;
                    if (!listRequerimientosPlaneacion && data) {
                        setListRequerimientosPlaneacion(formatModelRequerimientosPlaneacion(data));
                    } else {
                        const datosVentas = formatModelRequerimientosPlaneacion(data);
                        setListRequerimientosPlaneacion(datosVentas);
                    }
                }).catch(e => {
                    // console.log(e)
                })
            }

        } catch (e) {
            console.log(e)
        }
    }, [location, page, rowsPerPage]);

    const rutaRegreso = () => {
        enrutamiento.push("/DashboardPlaneacion")
    }

    return (
        <>
            <LayoutPrincipal setRefreshCheckLogin={setRefreshCheckLogin}>
                <Alert>
                    <Row>
                        <Col xs={12} md={8}>
                            <h1>
                                Requerimientos y planeación
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                            <Button
                                className="btnRegistroVentas"
                                onClick={() => {
                                    rutaRegistro()
                                }}
                            >
                                <FontAwesomeIcon icon={faCirclePlus} /> Nuevo requerimiento
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
                    listRequerimientosPlaneacion ?
                        (
                            <>
                                <Suspense fallback={<Spinner />}>
                                    <ListRequerimientosPlaneacion
                                        listRequerimientosPlaneacion={listRequerimientosPlaneacion}
                                        location={location}
                                        history={history}
                                        setRefreshCheckLogin={setRefreshCheckLogin}
                                        rowsPerPage={rowsPerPage}
                                        setRowsPerPage={setRowsPerPage}
                                        page={page}
                                        setPage={setPage}
                                        noTotalRequerimientos={noTotalRequerimientos}
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

            </LayoutPrincipal>
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
            requerimiento: data.requerimiento,
            planeacion: data.planeacion,
            bom: data.bom,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(RequerimientosPlaneacion);
