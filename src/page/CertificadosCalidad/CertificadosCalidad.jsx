import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory, withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import ListCertificadosCalidad from '../../components/CertificadosCalidad/ListCertificadosCalidad';
import { listarCertificadoPaginacion, totalCertificado } from "../../api/certificadosCalidad";
import "./CertificadosCalidad.scss"
import { getTokenApi, isExpiredToken, logoutApi } from "../../api/auth";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function CertificadosCalidad(props) {
    const { setRefreshCheckLogin, history, location } = props;

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegistro = () => {
        enrutamiento.push("/RegistroCertificadoCalidad")
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
    const [listCertificados, setListCertificados] = useState(null);

    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalCertificado, setNoTotalCertificado] = useState(0);

    useEffect(() => {
        try {
            totalCertificado().then(response => {
                const { data } = response;
                setNoTotalCertificado(data)
            })

            // listarOrdenesCompraPaginacion(page, rowsPerPage)
            if (page === 0) {
                setPage(1)
                listarCertificadoPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response;
                    if (!listCertificados && data) {
                        setListCertificados(formatModelCertificadosCalidad(data));
                    } else {
                        const datosCertificados = formatModelCertificadosCalidad(data);
                        setListCertificados(datosCertificados);
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                listarCertificadoPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response;
                    if (!listCertificados && data) {
                        setListCertificados(formatModelCertificadosCalidad(data));
                    } else {
                        const datosCertificados = formatModelCertificadosCalidad(data);
                        setListCertificados(datosCertificados);
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
                                Certificados de calidad
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                            <Button
                                className="btnRegistroVentas"
                                onClick={() => {
                                    rutaRegistro()
                                }}
                            >
                                <FontAwesomeIcon icon={faCirclePlus} /> Nuevo certificado
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
                    listCertificados ?
                        (
                            <>
                                <Suspense fallback={<Spinner />}>
                                    <ListCertificadosCalidad
                                        listCertificados={listCertificados}
                                        location={location}
                                        history={history}
                                        setRefreshCheckLogin={setRefreshCheckLogin}
                                        rowsPerPage={rowsPerPage}
                                        setRowsPerPage={setRowsPerPage}
                                        page={page}
                                        setPage={setPage}
                                        noTotalCertificado={noTotalCertificado}
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

function formatModelCertificadosCalidad(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            fecha: data.fecha,
            noOrdenInterna: data.noOrdenInterna,
            tamañoLote: data.tamañoLote,
            cliente: data.cliente,
            descripcion: data.descripcion,
            numeroParte: data.numeroParte,
            especificacionInforme: data.especificacionInforme,
            revisionAtributos: data.revisionAtributos,
            resultadoDimensional: data.resultadoDimensional,
            observacionesResultados: data.observacionesResultados,
            equipoMedicion: data.equipoMedicion,
            referencia: data.referencia,
            realizo: data.realizo,
            correo: data.correo,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(CertificadosCalidad);
