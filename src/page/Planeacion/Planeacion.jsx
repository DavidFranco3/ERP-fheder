import { useState, useEffect, Suspense } from 'react';
import { withRouter, useHistory } from "react-router-dom";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faPlus, faUsers } from "@fortawesome/free-solid-svg-icons";
import { getTokenApi, isExpiredToken, logoutApi } from "../../api/auth";
import { toast } from "react-toastify";
import { totalPlaneacion, listarPaginacionPlaneaciones } from "../../api/planeacion";
import ListPlaneacion from "../../components/Planeacion/ListPlaneacion";
import "./Planeacion.scss";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function Planeacion(props) {
    const { setRefreshCheckLogin, location, history } = props;

    const enrutamiento = useHistory();

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

    // Para ir hacia la ruta de registro del pedido de venta
    const rutaRegistroPlaneacion = () => {
        enrutamiento.push("/RegistroPlaneacion")
    }

    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalPlaneaciones, setNoTotalPlaneaciones] = useState(0);

    // Para almacenar el listado de planeaciones
    const [listPlaneaciones, setListPlaneaciones] = useState(null);

    useEffect(() => {
        try {
            totalPlaneacion().then(response => {
                const { data } = response;
                setNoTotalPlaneaciones(data)
            }).catch(e => {
                // console.log(e)
                if (e.message === 'Network Error') {
                    toast.error("Conexión al servidor no disponible");
                }
            })

            if (page === 0) {
                setPage(1)
                listarPaginacionPlaneaciones(page, rowsPerPage).then(response => {
                    const { data } = response;
                    //console.log(data)
                    if (!listPlaneaciones && data) {
                        setListPlaneaciones(formatModelPlaneacion(data));
                    } else {
                        const datosPlaneaciones = formatModelPlaneacion(data);
                        setListPlaneaciones(datosPlaneaciones)
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                listarPaginacionPlaneaciones(page, rowsPerPage).then(response => {
                    const { data } = response;
                    //console.log(data)
                    if (!listPlaneaciones && data) {
                        setListPlaneaciones(formatModelPlaneacion(data));
                    } else {
                        const datosPlaneaciones = formatModelPlaneacion(data);
                        setListPlaneaciones(datosPlaneaciones)
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
                    <Col xs={12} md={8} className="tituloAlertPanel">
                        <h1>
                            Planeación
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            onClick={() => {
                                rutaRegistroPlaneacion()
                            }}
                        >
                            <FontAwesomeIcon icon={faCirclePlus} /> Registrar una nueva planeación
                        </Button>
                    </Col>
                </Row>
            </Alert>

            {
                listPlaneaciones ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListPlaneacion
                                    listPlaneaciones={listPlaneaciones}
                                    location={location}
                                    history={history}
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    rowsPerPage={rowsPerPage}
                                    setRowsPerPage={setRowsPerPage}
                                    page={page}
                                    setPage={setPage}
                                    noTotalPlaneaciones={noTotalPlaneaciones}
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

function formatModelPlaneacion(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            ordenVenta: data.ordenVenta,
            productos: data.productos,
            detalles: data.detalles,
            estado: data.estado,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}


export default withRouter(Planeacion);
