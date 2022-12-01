import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { withRouter, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../api/auth";
import { obtenerUsuario } from "../../api/usuarios";
import { listarRequisicionesPaginacion, totalRequision } from "../../api/requisicion";
import ListRequisiciones from '../../components/Requisiciones/ListRequisiciones';

function Requisiciones(props) {
    const { setRefreshCheckLogin, location, history } = props;

    const [departamentoUsuario, setDepartamentoUsuario] = useState("");

    useEffect(() => {
        try {
            obtenerUsuario(obtenidusuarioLogueado(getTokenApi())).then(response => {
                const { data } = response;
                const { departamento } = data;
                //console.log(data)
                setDepartamentoUsuario(departamento);
            }).catch((e) => {
                if (e.message === "Request failed with status code 400") {
                }
                if (e.message === 'Network Error') {
                    //console.log("No hay internet")
                    toast.error("Conexión al servidor no disponible");
                }
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    const enrutamiento = useHistory();

    // Para definir la ruta de registro de los productos
    const rutaRegistraRequisiciones = () => {
        enrutamiento.push("/RegistroRequisicion")
    }

    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalRequisiciones, setNoTotalRequisiciones] = useState(0);

    // Para almacenar el listado de compras realizadas
    const [listRequisiciones, setListRequisiciones] = useState(null);

    useEffect(() => {
        try {
            totalRequision().then(response => {
                const { data } = response;
                setNoTotalRequisiciones(data)
            }).catch(e => {
                console.log(e)
            })

            if (page === 0) {
                setPage(1)

                listarRequisicionesPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response
                    if (!listRequisiciones && data) {
                        setListRequisiciones(formatModelRequisiciones(data));
                    } else {
                        const datosCompras = formatModelRequisiciones(data);
                        setListRequisiciones(datosCompras);
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                listarRequisicionesPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response
                    if (!listRequisiciones && data) {
                        setListRequisiciones(formatModelRequisiciones(data));
                    } else {
                        const datosCompras = formatModelRequisiciones(data);
                        setListRequisiciones(datosCompras);
                    }
                }).catch(e => {
                    console.log(e)
                })
            }
        } catch (e) {
            console.log(e)
        }
    }, [location, page, rowsPerPage]);

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
        enrutamiento.push("/DashboardCompras")
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Mis requisiciones
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            onClick={() => {
                                rutaRegistraRequisiciones()
                            }}
                        >
                            <FontAwesomeIcon icon={faCirclePlus} /> Levanta una requisición
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
                listRequisiciones ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListRequisiciones
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    listRequisiciones={listRequisiciones}
                                    history={history}
                                    location={location}
                                    rowsPerPage={rowsPerPage}
                                    setRowsPerPage={setRowsPerPage}
                                    page={page}
                                    setPage={setPage}
                                    noTotalRequisiciones={noTotalRequisiciones}
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

function formatModelRequisiciones(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            fechaElaboracion: data.fechaElaboracion,
            solicitante: data.solicitante,
            aprobo: data.aprobo,
            comentarios: data.comentarios,
            departamento: data.departamento,
            productosSolicitados: data.productosSolicitados,
            status: data.status,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Requisiciones);
