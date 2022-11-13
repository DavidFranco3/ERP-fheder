import { useState, useEffect, Suspense } from 'react';
import { useHistory, useParams, withRouter } from "react-router-dom";
import { listarMovimientosAlmacenMP, obtenerDatosAlmacenMPFolio } from "../../api/almacenMP";
import LayoutPrincipal from "../../layout/layoutPrincipal";
import { Alert, Badge, Button, Col, Row, Spinner } from "react-bootstrap";
import ListMovimientosMP from "../../components/AlmacenMP/ListMovimientosMP";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";

function MovimientosAlmacenMp(props) {

    // Define el uso del enrutamiento
    const enrutamiento = useHistory();

    // Define la ruta de regreso hacia las existencias de almacen de MP
    const regresaExistenciasAlmacenMP = () => {
        enrutamiento.push("/AlmacenMP")
    }

    // Define le uso de los parametros
    const parametros = useParams()
    const { folioMP } = parametros
    console.log(folioMP)

    // Almacena los movimientos de la materia prima
    const [listMovimientosMP, setListMovimientosMP] = useState(null);

    useEffect(() => {
        try {
            listarMovimientosAlmacenMP(folioMP).then(response => {
                const { data } = response;
                //console.log(response)
                // console.log(data)
                if (!listMovimientosMP && data) {
                    setListMovimientosMP(formatModelMovimientosAlmacenMP(data));
                } else {
                    const datosUsuarios = formatModelMovimientosAlmacenMP(data);
                    setListMovimientosMP(datosUsuarios);
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
            obtenerDatosAlmacenMPFolio(folioMP).then(response => {
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
        enrutamiento.push("/AlmacenMP")
    }

    return (
        <>
            <LayoutPrincipal>
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
                    listMovimientosMP ?
                        (
                            <>
                                <Suspense fallback={<Spinner />}>
                                    <ListMovimientosMP
                                        listMovimientosMP={listMovimientosMP}
                                        infoMPAlmacen={infoMPAlmacen}
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

function formatModelMovimientosAlmacenMP(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            um: data.um,
            fecha: data.fecha,
            tipo: data.tipo,
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

export default withRouter(MovimientosAlmacenMp);
