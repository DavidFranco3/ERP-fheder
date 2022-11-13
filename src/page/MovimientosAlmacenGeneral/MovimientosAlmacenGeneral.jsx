import { useState, useEffect, Suspense } from 'react';
import { useHistory, useParams, withRouter } from "react-router-dom";
import LayoutPrincipal from "../../layout/layoutPrincipal";
import { Alert, Col, Row, Spinner, Button } from "react-bootstrap";
import ListMovimientosAG from "../../components/AlmacenGeneral/ListMovimientosAG";
import { obtenerDatosAlmacenGeneral, obtenerDatosxFolioAlmacenGeneral } from "../../api/almacenGeneral";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";

function MovimientosAlmacenGeneral(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Define el uso del enrutamiento
    const enrutamiento = useHistory()

    // Define el uso de los parametros recibidos
    const parametros = useParams()

    const { folioAlmacen } = parametros

    // console.log(parametros)

    // Para almacenar el listado de movimientos
    const [listMovimientos, setListMovimientos] = useState(null);

    useEffect(() => {
        try {
            obtenerDatosAlmacenGeneral(folioAlmacen).then(response => {
                const { data } = response;
                //console.log(response)
                // console.log(data)
                if (!listMovimientos && data) {
                    setListMovimientos(formatModelMovimientosAG(data));
                } else {
                    const datosUsuarios = formatModelMovimientosAG(data);
                    setListMovimientos(datosUsuarios);
                }
            }).catch(e => {
                console.log(e)
            })

            // Lista datos del alamcen
            // Termina listado de datos del almacen
        } catch (e) {
            console.log(e)
        }
    }, []);

    const rutaRegreso = () => {
        enrutamiento.push("/AlmacenGeneral")
    }

    return (
        <>
            <LayoutPrincipal setRefreshCheckLogin={setRefreshCheckLogin}>
                <Alert>
                    <Row>
                        <Col xs={12} md={8} className="tituloPrincipal">
                            <h1>
                                Movimientos del artículo
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
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
                    listMovimientos ?
                        (
                            <>
                                <Suspense fallback={<Spinner />}>
                                    <ListMovimientosAG
                                        listMovimientos={listMovimientos}
                                        location={location}
                                        history={history}
                                        setRefreshCheckLogin={setRefreshCheckLogin}
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

function formatModelMovimientosAG(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            folioAG: data.folioAG,
            um: data.um,
            tipo: data.tipo,
            descripcion: data.descripcion,
            referencia: data.referencia,
            cantidad: data.cantidad,
            existenciasOV: data.existenciasOV,
            existenciasStock: data.existenciasStock,
            existenciasTotales: data.existenciasTotales,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(MovimientosAlmacenGeneral);
