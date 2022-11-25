import { useState, useEffect, Suspense } from 'react';
import LayoutPrincipal from "../../layout/layoutPrincipal";
import { useHistory, withRouter } from "react-router-dom";
import { getTokenApi, isExpiredToken, logoutApi } from "../../api/auth";
import { toast } from "react-toastify";
import {listarTracking, listarTrackingPaginado, totalTracking} from "../../api/tracking";
import {Alert, Button, Col, Row, Spinner} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeftRotate, faArrowCircleLeft} from "@fortawesome/free-solid-svg-icons";
import ListTracking from "../../components/Tracking/ListTracking";
import "./Tracking.scss";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function Tracking(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalTrackings, setNoTotalTrackings] = useState(0);

    const enrutamiento = useHistory();

    const rutaRegreso = () => {
        enrutamiento.push("/")
    }

    // Cerrado de sesión automatico
    useEffect(() => {
        if(getTokenApi()) {
            if(isExpiredToken(getTokenApi())) {
                toast.warning("Sesión expirada");
                toast.success("Sesión cerrada por seguridad");
                logoutApi();
                setRefreshCheckLogin(true);
            }
        }
    }, []);
    // Termina cerrado de sesión automatico

    // Para almacenar los datos del tracking
    const [listTracking, setListTracking] = useState(null);

    useEffect(() => {
        try {
            totalTracking().then(response => {
                const { data } = response;
                setNoTotalTrackings(data)
            })

            // listarOrdenesCompraPaginacion(page, rowsPerPage)
            if(page === 0) {
                setPage(1)
                listarTrackingPaginado(page, rowsPerPage).then(response => {
                    const { data } = response;
                    if(!listTracking &&data) {
                        setListTracking(formatModelTracking(data));
                    } else {
                        const datosTracking = formatModelTracking(data);
                        setListTracking(datosTracking);
                    }
                }).catch(e => {
                    // console.log(e)
                })
            } else {
                listarTrackingPaginado(page, rowsPerPage).then(response => {
                    const { data } = response;
                    if(!listTracking &&data) {
                        setListTracking(formatModelTracking(data));
                    } else {
                        const datosTracking = formatModelTracking(data);
                        setListTracking(datosTracking);
                    }
                }).catch(e => {
                    // console.log(e)
                })
            }

        } catch (e) {
            console.log(e)
        }
    }, [location, page, rowsPerPage]);


    return (
        <>
            <LayoutPrincipal setRefreshCheckLogin={setRefreshCheckLogin}>
                <Alert>
                    <Row>
                        <Col xs={12} md={8}>
                            <h1>
                                Tracking
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
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
                    listTracking ?
                        (
                            <>
                                <Suspense fallback={<Spinner />}>
                                    <ListTracking
                                        listTracking={listTracking}
                                        setRefreshCheckLogin={setRefreshCheckLogin}
                                        history={history}
                                        location={location}
                                        rowsPerPage={rowsPerPage}
                                        setRowsPerPage={setRowsPerPage}
                                        page={page}
                                        setPage={setPage}
                                        noTotalTrackings={noTotalTrackings}
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

function formatModelTracking(data){
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            ordenVenta: data.ordenVenta,
            cliente: data.cliente,
            fechaElaboracion: data. fechaElaboracion,
            fechaEntrega: data.fechaEntrega,
            indicador: data.indicador,
            status: data.status,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Tracking);
