import { useState, useEffect, Suspense } from 'react';
import {Alert, Button, Col, Row, Spinner} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { withRouter, useHistory } from "react-router-dom";
import {faCirclePlus, faArrowCircleLeft} from "@fortawesome/free-solid-svg-icons";
import { totalCotizaciones, listarCotizacionPaginacion } from "../../api/cotizaciones";
import LayoutPrincipal from "../../layout/layoutPrincipal";
import ListCotizaciones from "../../components/Cotizaciones/ListCotizaciones";
import { registraCotizacion, obtenerNumeroCotizacion } from "../../api/cotizaciones";
import queryString from "query-string";
import {toast} from "react-toastify";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function Cotizaciones(props) {
    const { setRefreshCheckLogin, location, history } = props;

    const enrutamiento = useHistory()

    const rutaRegreso = () => {
        enrutamiento.push("/")
    }

    // Ruta de acceso
    const rutaRegistroCotizaciones = () => {
        enrutamiento.push("/RegistroCotizaciones")
    }
    
         // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalCotizaciones, setNoTotalCotizaciones] = useState(0);

    // Para almacenar el listado de cotizaciones
    const [listCotizaciones, setListCotizaciones] = useState(null);

    useEffect(() => {
        try {
            totalCotizaciones().then(response =>{
                const { data } = response;
                setNoTotalCotizaciones(data)
            }).catch(e => {
                // console.log(e)
            })

            // listarOrdenesCompraPaginacion(pagina, limite)

            if(page === 0) {
                setPage(1)

                listarCotizacionPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response
                    if(!listCotizaciones && data) {
                        setListCotizaciones(formatModelCotizacion(data));
                    } else {
                        const datosCotizaciones = formatModelCotizacion(data);
                        setListCotizaciones(datosCotizaciones);
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                listarCotizacionPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response
                    if(!listCotizaciones && data) {
                        setListCotizaciones(formatModelCotizacion(data));
                    } else {
                        const datosCotizacion = formatModelCotizacion(data);
                        setListCotizaciones(datosCotizacion);
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
                                Mis cotizaciones
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                            <Button
                                className="btnRegistroVentas"
                                onClick={() => {
                                    rutaRegistroCotizaciones()
                                }}
                            >
                                <FontAwesomeIcon icon={faCirclePlus} /> Crea una nueva cotización
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
                    listCotizaciones ?
                        (
                            <>
                            <Suspense fallback={<Spinner /> }>
                                <ListCotizaciones
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    location={location}
                                    history={history}
                                    listCotizaciones={listCotizaciones}
                                    rowsPerPage={rowsPerPage}
                                    setRowsPerPage={setRowsPerPage}
                                    page={page}
                                    setPage={setPage}
                                    noTotalCotizaciones={noTotalCotizaciones}
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

function formatModelCotizacion(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            cliente: data.cliente,
            vendedor: data.vendedor,
            fechaCreacion: data.fechaCreacion,
            partida: data.partida,
            referencia: data.referencia,
            comentarios: data.comentarios,
            correoAtencion: data.correoAtencion,
            status: data.status,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Cotizaciones);
