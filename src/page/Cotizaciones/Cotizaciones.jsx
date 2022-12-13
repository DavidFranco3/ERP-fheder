import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withRouter, useHistory } from "react-router-dom";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { listarCotizacion } from "../../api/cotizaciones";
import ListCotizaciones from "../../components/Cotizaciones/ListCotizaciones";
import queryString from "query-string";
import { toast } from "react-toastify";
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
            listarCotizacion().then(response => {
                const { data } = response;

                //console.log(data);

                if (!listCotizaciones && data) {
                    setListCotizaciones(formatModelCotizacion(data));
                } else {
                    const datosCotizacion = formatModelCotizacion(data);
                    setListCotizaciones(datosCotizacion);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);


    return (
        <>
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
                            title="Registrar una nueva cotizacion"
                            onClick={() => {
                                rutaRegistroCotizaciones()
                            }}
                        >
                            <FontAwesomeIcon icon={faCirclePlus} /> Registrar
                        </Button>
                        <Button
                            className="btnRegistroVentas"
                            title="Regresar al menú principal"
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
                            <Suspense fallback={<Spinner />}>
                                <ListCotizaciones
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    location={location}
                                    history={history}
                                    listCotizaciones={listCotizaciones}
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
