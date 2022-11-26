import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory, withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { listarInspeccionPiezaPaginacion, totalInspeccionPieza } from "../../api/inspeccionPieza";
import ListInspeccion from '../../components/InspeccionMaterial/ListInspeccionPieza';
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { getTokenApi, isExpiredToken, logoutApi } from "../../api/auth";

function InspeccionPieza(props) {
    const { setRefreshCheckLogin, location, history } = props;

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

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegistro = () => {
        enrutamiento.push("/RegistraInspeccionPieza")
    }

    const rutaRegreso = () => {
        enrutamiento.push("/DashboardCalidad")
    }

    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalInspeccion, setNoTotalInspeccion] = useState(0);

    // Para almacenar el listado de compras realizadas
    const [listInspeccion, setListInspeccion] = useState(null);

    useEffect(() => {
        try {
            totalInspeccionPieza().then(response => {
                const { data } = response;
                setNoTotalInspeccion(data)
            }).catch(e => {
                console.log(e)
            })

            if (page === 0) {
                setPage(1)

                listarInspeccionPiezaPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response
                    if (!listInspeccion && data) {
                        setListInspeccion(formatModelInspeccion(data));
                    } else {
                        const datosInspeccion = formatModelInspeccion(data);
                        setListInspeccion(datosInspeccion);
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                listarInspeccionPiezaPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response
                    if (!listInspeccion && data) {
                        setListInspeccion(formatModelInspeccion(data));
                    } else {
                        const datosInspeccion = formatModelInspeccion(data);
                        setListInspeccion(datosInspeccion);
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
                            Inspeccion de pieza
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            onClick={() => {
                                rutaRegistro()
                            }}
                        >
                            <FontAwesomeIcon icon={faCirclePlus} /> Nuevo registro de inspeccion
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
                listInspeccion ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListInspeccion
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    listInspeccion={listInspeccion}
                                    history={history}
                                    location={location}
                                    rowsPerPage={rowsPerPage}
                                    setRowsPerPage={setRowsPerPage}
                                    page={page}
                                    setPage={setPage}
                                    noTotalInspeccion={noTotalInspeccion}
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

function formatModelInspeccion(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            fechaElaboracion: data.fechaElaboracion,
            noOP: data.noOP,
            fechaArranqueMaquina: data.fechaArranqueMaquina,
            noMaquina: data.noMaquina,
            cliente: data.cliente,
            descripcionPieza: data.descripcionPieza,
            noParte: data.noParte,
            material: data.material,
            cantidadLote: data.cantidadLote,
            turno1: data.turno1,
            turno2: data.turno2,
            status: data.status,
            motivoCancelacion: data.motivoCancelacion,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(InspeccionPieza);
