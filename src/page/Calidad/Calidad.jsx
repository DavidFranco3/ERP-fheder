import { useEffect, useState, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { getTokenApi, isExpiredToken, logoutApi } from "../../api/auth";
import { toast } from "react-toastify";
import LayoutPrincipal from "../../layout/layoutPrincipal";
import { listarInspeccionPaginacion, totalInspeccion } from "../../api/inspeccionMaterial";
import { withRouter, useHistory } from "react-router-dom";
import ListInspeccion from "../../components/Calidad/ListCalidad"
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function Calidad(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegistro = () => {
        enrutamiento.push("/RegistroReporte")
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

    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalInspeccion, setNoTotalInspeccion] = useState(0);

    // Para almacenar el listado de compras realizadas
    const [listInspeccion, setListInspeccion] = useState(null);

    useEffect(() => {
        try {
            totalInspeccion().then(response => {
                const { data } = response;
                setNoTotalInspeccion(data)
            }).catch(e => {
                console.log(e)
            })

            if (page === 0) {
                setPage(1)

                listarInspeccionPaginacion(page, rowsPerPage).then(response => {
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
                listarInspeccionPaginacion(page, rowsPerPage).then(response => {
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

    const rutaRegreso = () => {
        enrutamiento.push("/DashboardCalidad")
    }

    return (
        <>
            <LayoutPrincipal setRefreshCheckLogin={setRefreshCheckLogin}>
                <Alert>
                    <Row>
                        <Col xs={12} md={8}>
                            <h1>
                                Inspeccion de calidad de material
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                            <Button
                                className="btnRegistroVentas"
                                onClick={() => {
                                    rutaRegistro()
                                }}
                            >
                                <FontAwesomeIcon icon={faCirclePlus} /> Nuevo reporte de calidad
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
            </LayoutPrincipal>
        </>
    );
}

function formatModelInspeccion(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            ordenVenta: data.ordenVenta,
            fecha: data.fecha,
            lote: data.lote,
            propiedad: data.propiedad,
            tipoMaterial: data.tipoMaterial,
            nombre: data.nombre,
            cantidad: data.cantidad,
            unidadMedida: data.unidadMedida,
            nombreRecibio: data.nombreRecibio,
            estadoMateriaPrima: data.estadoMateriaPrima,
            contaminacion: data.contaminacion,
            presentaHumedad: data.presentaHumedad,
            certificadoCalidad: data.certificadoCalidad,
            empaqueDañado: data.empaqueDañado,
            resultadoFinalInspeccion: data.resultadoFinalInspeccion,
            observaciones: data.observaciones,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Calidad);
