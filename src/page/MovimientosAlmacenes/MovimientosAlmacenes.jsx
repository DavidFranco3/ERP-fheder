import { useState, useEffect, Suspense } from 'react';
import { useHistory, useParams, withRouter } from "react-router-dom";
import { listarMovimientosGeneral, obtenerDatosAlmacenesFolio } from "../../api/almacenes";
import { Alert, Badge, Button, Col, Row, Spinner } from "react-bootstrap";
import ListMovimientosAlmacenes from "../../components/Almacenes/ListMovimientosAlmacenes";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { getTokenApi, isExpiredToken, logoutApi, getAlmacen, getSucursal } from "../../api/auth";
import { toast } from "react-toastify";

function MovimientosAlmacenes(props) {
    const { setRefreshCheckLogin, location, history } = props;
    // Define el uso del enrutamiento
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

    // Define le uso de los parametros
    const parametros = useParams()
    const { folio } = parametros

    // Almacena los movimientos de la materia prima
    const [listMovimientosAlmacenes, setListMovimientosAlmacenes] = useState(null);

    useEffect(() => {
        try {
            listarMovimientosGeneral(getSucursal(), getAlmacen()).then(response => {
                const { data } = response;
                // console.log(response)
                // console.log(data)
                if (!listMovimientosAlmacenes && data) {
                    setListMovimientosAlmacenes(formatModelMovimientosAlmacenes(data));
                } else {
                    const datosAlmacenes = formatModelMovimientosAlmacenes(data);
                    setListMovimientosAlmacenes(datosAlmacenes);
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

    console.log(listMovimientosAlmacenes)

    const rutaRegreso = () => {
        enrutamiento.push("/Almacenes")
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Movimientos de la Materia Prima
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Regresar a la pagina anterior"
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
                listMovimientosAlmacenes ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListMovimientosAlmacenes
                                    listMovimientosAlmacenes={listMovimientosAlmacenes}
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
        </>
    );
}

function formatModelMovimientosAlmacenes(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            fecha: data.fecha,
            articulo: data.articulo,
            sucursal: data.sucursal,
            um: data.um,
            tipo: data.tipo,
            almacen: data.almacen,
            referencia: data.referencia,
            ordenProduccion: data.ordenProduccion,
            lote: data.lote,
            descripcion: data.descripcion,
            cantidadExistencia: data.cantidadExistencia,
        });
    });
    return dataTemp;
}

function formatModelAlmacenes(data) {
    // console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            idArticulo: data.idArticulo,
            folioArticulo: data.folioArticulo,
            nombreArticulo: data.nombreArticulo,
            sucursal: data.sucursal,
            almacen: data.almacen,
            um: data.um,
            movimientos: data.movimientos,
            cantidadExistencia: data.cantidadExistencia,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(MovimientosAlmacenes);
