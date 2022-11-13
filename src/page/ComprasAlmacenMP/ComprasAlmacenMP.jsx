import { useState, useEffect, Suspense } from 'react';
import { getTokenApi, isExpiredToken, logoutApi } from "../../api/auth";
import { toast } from "react-toastify";
import { useHistory, withRouter } from "react-router-dom";
import {
    listarDeptoCompras,
    listarOrdenesCompraPaginacion, listarPaginacionDeptoCompras,
    obtenerNumeroOrdenCompra,
    registraOrdenCompra,
    totalDeptoCompras, totalOVCompras
} from "../../api/compras";
import { LogsInformativos } from "../../components/Logs/LogsSistema/LogsSistema";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import ListCompras from "../../components/Compras/ListCompras";
import LayoutPrincipal from "../../layout/layoutPrincipal";
import "./ComprasAlmacenMP.scss";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function ComprasAlmacenMp(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalComprasDepto, setNoTotalComprasDepto] = useState(0);

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

    // Para definir el salto entre rutas
    const enrutamiento = useHistory();

    // Para almacenar el listado de compras realizadas
    const [listCompras, setListCompras] = useState(null);

    useEffect(() => {
        try {
            totalDeptoCompras("Almacen").then(response => {
                const { data } = response;
                // console.log(data)
                setNoTotalComprasDepto(data)
            }).catch(e => {
                // console.log(e)
            })

            // listarPaginacionDeptoCompras(pagina, limite, depto)

            if (page === 0) {
                setPage(1)

                listarPaginacionDeptoCompras(page, rowsPerPage, "Almacen").then(response => {
                    const { data } = response
                    if (!listCompras && data) {
                        setListCompras(formatModelCompras(data));
                    } else {
                        const datosCompras = formatModelCompras(data);
                        setListCompras(datosCompras);
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                listarPaginacionDeptoCompras(page, rowsPerPage, "Almacen").then(response => {
                    const { data } = response
                    if (!listCompras && data) {
                        setListCompras(formatModelCompras(data));
                    } else {
                        const datosCompras = formatModelCompras(data);
                        setListCompras(datosCompras);
                    }
                }).catch(e => {
                    console.log(e)
                })
            }

        } catch (e) {
            console.log(e)
        }
    }, [location]);

    // Define el registro de una nueva compra y enruta hacia la vista de registro
    const registraCompra = () => {
        enrutamiento.push("/Compras/AlmacenMP/Registro")
    }

    const rutaRegreso = () => {
        enrutamiento.push("/DashboardAlmacenes")
    }

    return (
        <>
            <LayoutPrincipal setRefreshCheckLogin={setRefreshCheckLogin}>
                <Alert>
                    <Row>
                        <Col xs={12} md={8} className="tituloPrincipal">
                            <h1>
                                Mis compras de MP
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                            <Button
                                className="btnRegistroVentas"
                                onClick={() => {
                                    registraCompra()
                                }}
                            >
                                <FontAwesomeIcon icon={faCirclePlus} /> Registrar una nueva compra
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
                    listCompras ?
                        (
                            <>
                                <Suspense fallback={<Spinner />}>
                                    <ListCompras
                                        setRefreshCheckLogin={setRefreshCheckLogin}
                                        listCompras={listCompras}
                                        history={history}
                                        location={location}
                                        rowsPerPage={rowsPerPage}
                                        setRowsPerPage={setRowsPerPage}
                                        page={page}
                                        setPage={setPage}
                                        noTotalComprasDepto={noTotalComprasDepto}
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

function formatModelCompras(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            proveedor: data.proveedor,
            fechaSolicitud: data.fechaSolicitud,
            fechaEntrega: data.fechaEntrega,
            tipo: data.tipo,
            ordenVenta: data.ordenVenta ? data.ordenVenta : "No aplica",
            diasCredito: data.diasCredito,
            autoriza: data.autoriza,
            productos: data.productos,
            subtotal: data.subtotal,
            iva: data.iva,
            total: data.total,
            estado: data.estado,
            departamento: data.departamento,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(ComprasAlmacenMp);
