import { useState, useEffect, Suspense } from 'react';
import { useHistory, useParams, withRouter } from "react-router-dom";
import { listarMovimientosAlmacenPT, obtenerDatosAlmacenPT } from "../../api/almacenPT";
import { Alert, Badge, Button, Col, Row, Spinner } from "react-bootstrap";
import ListMovimientosPT from "../../components/AlmacenPT/ListMovimientosPT";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { getTokenApi, isExpiredToken, logoutApi } from "../../api/auth";
import { toast } from "react-toastify";

function MovimientosAlmacenPt(props) {
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

    // Define la ruta de regreso hacia las existencias de almacen de MP
    const regresaExistenciasAlmacenMP = () => {
        enrutamiento.push("/AlmacenPT")
    }

    // Define le uso de los parametros
    const parametros = useParams()
    const { folioMP } = parametros
    console.log(folioMP)

    // Almacena los movimientos de la materia prima
    const [listMovimientosPT, setListMovimientosPT] = useState(null);

    useEffect(() => {
        try {
            listarMovimientosAlmacenPT(folioMP).then(response => {
                const { data } = response;
                //console.log(response)
                // console.log(data)
                if (!listMovimientosPT && data) {
                    setListMovimientosPT(formatModelMovimientosAlmacenPT(data));
                } else {
                    const datosUsuarios = formatModelMovimientosAlmacenPT(data);
                    setListMovimientosPT(datosUsuarios);
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

    // Almacena la informacion de la materia prima en el almacen
    const [infoMPAlmacen, setInfoMPAlmacen] = useState(null);

    useEffect(() => {
        try {
            obtenerDatosAlmacenPT(folioMP).then(response => {
                const { data } = response;
                // console.log(data)
                if (!infoMPAlmacen && data) {
                    setInfoMPAlmacen(formatModelAlmacenMateriasPrimas(data));
                } else {
                    setInfoMPAlmacen(formatModelAlmacenMateriasPrimas(data));
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    const rutaRegreso = () => {
        enrutamiento.push("/AlmacenPT")
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Movimientos de los productos terminados
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Regresar al menú almacen de producto terminado"
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
                listMovimientosPT ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListMovimientosPT
                                    listMovimientosPT={listMovimientosPT}
                                    infoMPAlmacen={infoMPAlmacen}
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
                            <Lottie loop={true} play={true} animationData={AnimacionLoading} />s
                        </>
                    )
            }
        </>
    );
}

function formatModelMovimientosAlmacenPT(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            um: data.um,
            fecha: data.fecha,
            tipo: data.tipo,
            sucursal: data.sucursal,
            descripcion: data.descripcion,
            referencia: data.referencia,
            cantidad: data.cantidad,
            existenciasOV: data.existenciasOV,
            existenciasStock: data.existenciasStock,
            existenciasTotales: data.existenciasTotales
        });
    });
    return dataTemp;
}

function formatModelAlmacenMateriasPrimas(data) {
    // console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folioAlmacen: data.folioAlmacen,
            folioMP: data.folioMP,
            sucursal: data.sucursal,
            nombre: data.nombre,
            descripcion: data.descripcion,
            um: data.um,
            existenciasOV: data.existenciasOV,
            existenciasStock: data.existenciasStock,
            existenciasTotales: data.existenciasTotales,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(MovimientosAlmacenPt);
