import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory, withRouter } from "react-router-dom";
import LayoutPrincipal from "../../layout/layoutPrincipal";
import { listarStatusMaterialPaginacion, totalStatusMaterial } from "../../api/statusMaterial";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../api/auth";
import { toast } from "react-toastify";
import ListCalidad from '../../components/StatusMaterial/ListStatusCalidad';

function StatusMaterial(props) {
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

    const rutaRegreso = () => {
        enrutamiento.push("/DashboardCalidad")
    }

    const rutaRegistro = () => {
        enrutamiento.push("/RegistroStatusMaterial")
    }

    // Para almacenar la lista de pedidos de venta
    const [listStatus, setListStatus] = useState(null);

    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalStatus, setNoTotalStatus] = useState(0);

    useEffect(() => {
        try {
            totalStatusMaterial().then(response => {
                const { data } = response;
                setNoTotalStatus(data)
            })

            // listarOrdenesCompraPaginacion(page, rowsPerPage)
            if (page === 0) {
                setPage(1)
                listarStatusMaterialPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response;
                    if (!listStatus && data) {
                        setListStatus(formatModelStatusMaterial(data));
                    } else {
                        const datosStatus = formatModelStatusMaterial(data);
                        setListStatus(datosStatus);
                    }
                }).catch(e => {
                    // console.log(e)
                })
            } else {
                listarStatusMaterialPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response;
                    if (!listStatus && data) {
                        setListStatus(formatModelStatusMaterial(data));
                    } else {
                        const datosStatus = formatModelStatusMaterial(data);
                        setListStatus(datosStatus);
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
                                Identificación de status del material
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                            <Button
                                className="btnRegistroVentas"
                                onClick={() => {
                                    rutaRegistro()
                                }}
                            >
                                <FontAwesomeIcon icon={faCirclePlus} /> Nueva etiqueta
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
                    listStatus ?
                        (
                            <>
                                <Suspense fallback={<Spinner />}>
                                    <ListCalidad
                                        listStatus={listStatus}
                                        location={location}
                                        history={history}
                                        setRefreshCheckLogin={setRefreshCheckLogin}
                                        rowsPerPage={rowsPerPage}
                                        setRowsPerPage={setRowsPerPage}
                                        page={page}
                                        setPage={setPage}
                                        noTotalStatus={noTotalStatus}
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

function formatModelStatusMaterial(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            folioInspeccion: data.folioInspeccion,
            propiedadInspeccion: data.propiedadInspeccion,
            cantidadInspeccion: data.cantidadInspeccion,
            fechaInspeccion: data.fechaInspeccion,
            tipoMaterialInspeccion: data.tipoMaterialInspeccion,
            recibioInspeccion: data.recibioInspeccion,
            loteInspeccion: data.loteInspeccion,
            nombreInspeccion: data.nombreInspeccion,
            resultadoInspeccion: data.resultadoInspeccion,
            etiqueta: data.etiqueta,
            fecha: data.fecha,
            descripcionMaterial: data.descripcionMaterial,
            rechazo: data.rechazo,
            nombre: data.nombre,
            auditor: data.auditor,
            supervisor: data.supervisor,
            descripcionDefecto: data.descripcionDefecto,
            cantidad: data.cantidad,
            tipoRechazo: data.tipoRechazo,
            correccion: data.correccion,
            clienteProveedor: data.clienteProveedor,
            lote: data.lote,
            recibio: data.recibio,
            turno: data.turno,
            propiedad: data.propiedad,
            liberacion: data.liberacion,
            descripcion: data.descripcion,
            comentarios: data.comentarios,
            condicion: data.condicion,
            observaciones: data.observaciones,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(StatusMaterial);
