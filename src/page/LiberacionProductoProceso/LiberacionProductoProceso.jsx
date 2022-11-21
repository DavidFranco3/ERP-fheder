import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory, withRouter } from "react-router-dom";
import LayoutPrincipal from "../../layout/layoutPrincipal";
import { listarLiberacionProductoPaginacion, totalLiberacionProducto } from "../../api/liberacionProductoProceso";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../api/auth";
import { toast } from "react-toastify";
import ListLiberacionProducto from '../../components/LiberacionProductoProceso/ListLiberacionProducto';

function LiberacionProductoProceso(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegistro = () => {
        enrutamiento.push("/RegistroLiberacionProductoProceso")
    }

    const rutaRegreso = () => {
        enrutamiento.push("/DashboardCalidad")
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
    const [listLiberacion, setListLiberacion] = useState(null);

    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalLiberacion, setNoTotalLiberacion] = useState(0);

    useEffect(() => {
        try {
            totalLiberacionProducto().then(response => {
                const { data } = response;
                setNoTotalLiberacion(data)
            })

            // listarOrdenesCompraPaginacion(page, rowsPerPage)
            if (page === 0) {
                setPage(1)
                listarLiberacionProductoPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response;
                    if (!listLiberacion && data) {
                        setListLiberacion(formatModelLiberacionProducto(data));
                    } else {
                        const datosLiberacion = formatModelLiberacionProducto(data);
                        setListLiberacion(datosLiberacion);
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                listarLiberacionProductoPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response;
                    if (!listLiberacion && data) {
                        setListLiberacion(formatModelLiberacionProducto(data));
                    } else {
                        const datosLiberacion = formatModelLiberacionProducto(data);
                        setListLiberacion(datosLiberacion);
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
            <LayoutPrincipal setRefreshCheckLogin={setRefreshCheckLogin}>
                <Alert>
                    <Row>
                        <Col xs={12} md={8}>
                            <h1>
                                Hoja de liberación de Producto y Proceso
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                            <Button
                                className="btnRegistroVentas"
                                onClick={() => {
                                    rutaRegistro()
                                }}
                            >
                                <FontAwesomeIcon icon={faCirclePlus} /> Nueva hoja
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
                    listLiberacion ?
                        (
                            <>
                                <Suspense fallback={<Spinner />}>
                                    <ListLiberacionProducto
                                        listLiberacion={listLiberacion}
                                        location={location}
                                        history={history}
                                        setRefreshCheckLogin={setRefreshCheckLogin}
                                        rowsPerPage={rowsPerPage}
                                        setRowsPerPage={setRowsPerPage}
                                        page={page}
                                        setPage={setPage}
                                        noTotalLiberacion={noTotalLiberacion}
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

function formatModelLiberacionProducto(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            cliente: data.cliente,
            descripcionPieza: data.descripcionPieza,
            noParteMolde: data.noParteMolde,
            procesoRealizado: data.procesoRealizado,
            fechaElaboracion: data.fechaElaboracion,
            fechaArranqueMolde: data.fechaArranqueMolde,
            noMaquina: data.noMaquina,
            hojaLiberacion: data.hojaLiberacion,
            elaboro: data.elaboro,
            turno: data.turno,
            proceso: data.proceso,
            producto: data.producto,
            observaciones: data.observaciones,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(LiberacionProductoProceso);
