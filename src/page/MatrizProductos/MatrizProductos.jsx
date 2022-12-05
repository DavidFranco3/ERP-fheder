import { useState, useEffect, Suspense } from 'react';
import { useHistory, withRouter } from "react-router-dom";
import { getTokenApi, isExpiredToken, logoutApi } from "../../api/auth";
import { toast } from "react-toastify";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { Switch } from "@headlessui/react";
import { totalMatrizProductos, listarMatrizProductosPaginacion } from "../../api/matrizProductos";
import ListMatrizProductos from "../../components/MatrizProductos/ListMatrizProductos";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function MatrizProductos(props) {
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

    // Para definir la ruta de registro de los productos
    const rutaRegistraProductos = () => {
        enrutamiento.push("/Registra-Matriz-Productos")
    }

    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalProductos, setNoTotalProductos] = useState(0);

    // Para almacenar el listado de productos
    const [listProductos, setListProductos] = useState(null);

    useEffect(() => {
        try {
            totalMatrizProductos().then(response => {
                const { data } = response;
                setNoTotalProductos(data)
            }).catch(e => {
                // console.log(e)
                if (e.message === 'Network Error') {
                    toast.error("Conexión al servidor no disponible");
                }
            })

            if (page === 0) {
                setPage(1)
                listarMatrizProductosPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response;
                    //console.log(data)
                    if (!listProductos && data) {
                        setListProductos(formatModelMatrizProductos(data));
                    } else {
                        const datosProductos = formatModelMatrizProductos(data);
                        setListProductos(datosProductos)
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                listarMatrizProductosPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response;
                    //console.log(data)
                    if (!listProductos && data) {
                        setListProductos(formatModelMatrizProductos(data));
                    } else {
                        const datosProductos = formatModelMatrizProductos(data);
                        setListProductos(datosProductos)
                    }
                }).catch(e => {
                    console.log(e)
                })
            }
        } catch (e) {
            console.log(e)
        }
    }, [location, page, rowsPerPage]);

    const rutaRegreso = () => {
        enrutamiento.push("/DashboardCatalogos")
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Catálogo de productos
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            onClick={() => {
                                rutaRegistraProductos()
                            }}
                        >
                            <FontAwesomeIcon icon={faCirclePlus} /> Registrar un nuevo producto
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
                listProductos ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListMatrizProductos
                                    listProductos={listProductos}
                                    location={location}
                                    history={history}
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    rowsPerPage={rowsPerPage}
                                    setRowsPerPage={setRowsPerPage}
                                    page={page}
                                    setPage={setPage}
                                    noTotalProductos={noTotalProductos}
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

function formatModelMatrizProductos(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            noInterno: data.noInterno,
            cliente: data.cliente,
            datosMolde: data.datosMolde,
            noParte: data.noParte,
            descripcion: data.descripcion,
            datosPieza: data.datosPieza,
            materiaPrima: data.materiaPrima,
            pigmentoMasterBach: data.pigmentoMasterBach,
            tiempoCiclo: data.tiempoCiclo,
            noOperadores: data.noOperadores,
            piezasxHora: data.piezasxHora,
            piezasxTurno: data.piezasxTurno,
            materialEmpaque: data.materialEmpaque,
            opcionMaquinaria: data.opcionMaquinaria,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(MatrizProductos);
