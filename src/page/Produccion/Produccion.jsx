import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { getTokenApi, isExpiredToken, logoutApi } from "../../api/auth";
import LayoutPrincipal from "../../layout/layoutPrincipal";
import { useHistory, withRouter } from "react-router-dom";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { toast } from "react-toastify";
import "./Produccion.scss";
import { listarProduccionPaginacion, totalProduccion } from "../../api/produccion";
import ListProduccion from '../../components/Produccion/ListProduccion';

function Produccion(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegistro = () => {
        enrutamiento.push("/RegistroProduccion")
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

     // Para almacenar la lista de pedidos de venta
     const [listProduccion, setListProduccion] = useState(null);
    
     // Para controlar la paginación
     const [rowsPerPage, setRowsPerPage] = useState(10);
     const [page, setPage] = useState(1);
     const [noTotalProduccion, setNoTotalProduccion] = useState(0);

     useEffect(() => {
        try {
            totalProduccion().then(response => {
                const { data } = response;
                setNoTotalProduccion(data)
            })

            // listarOrdenesCompraPaginacion(page, rowsPerPage)
            if (page === 0) {
                setPage(1)
                listarProduccionPaginacion(page, rowsPerPage).then(response => {
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
                listarProduccionPaginacion(page, rowsPerPage).then(response => {
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
                                Ordenes de producción
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                            <Button
                                className="btnRegistroVentas"
                                onClick={() => {
                                    rutaRegistro()
                                }}
                            >
                                <FontAwesomeIcon icon={faCirclePlus} /> Nueva orden
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
                                    <ListProduccion
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
            </LayoutPrincipal>
        </>
    );
}

function formatModelProduccion(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            generalidades: data.generalidades,
            planeacion: data.planeacion,
            bom: data.bom,
            resultados: data.resultados,
            materiaPrima: data.materiaPrima,
            observaciones: data.observaciones,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Produccion);
