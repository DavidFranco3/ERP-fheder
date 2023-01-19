import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory, withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import ListRequerimientosPlaneacion from "../../components/RequerimientosPlaneacion/ListProduccion/";
import { listarRequerimiento } from "../../api/requerimientosPlaneacion";
import "./RequerimientosPlaneacion.scss"
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function RequerimientosPlaneacion(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegistro = () => {
        enrutamiento.push("RegistraRequerimientosPlaneacion")
    }

    // Para almacenar la lista de pedidos de venta
    const [listRequerimientosPlaneacion, setListRequerimientosPlaneacion] = useState(null);

    // Para determinar si hay conexion al servidor o a internet
    const [conexionInternet, setConexionInternet] = useState(true);

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

    useEffect(() => {
        try {
            listarRequerimiento(getSucursal()).then(response => {
                const { data } = response;

                if (!listRequerimientosPlaneacion && data) {
                    setListRequerimientosPlaneacion(formatModelRequerimientosPlaneacion(data));
                } else {
                    const datosRequerimiento = formatModelRequerimientosPlaneacion(data);
                    setListRequerimientosPlaneacion(datosRequerimiento);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);

    const rutaRegreso = () => {
        enrutamiento.push("/DashboardPlaneacion")
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Planeación
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Registrar un nuevo requerimiento y planeación"
                            onClick={() => {
                                rutaRegistro()
                            }}
                        >
                            <FontAwesomeIcon icon={faCirclePlus} /> Registrar
                        </Button>
                        <Button
                            className="btnRegistroVentas"
                            title="Regresar al menú planeación"
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
                listRequerimientosPlaneacion ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListRequerimientosPlaneacion
                                    listRequerimientosPlaneacion={listRequerimientosPlaneacion}
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

function formatModelRequerimientosPlaneacion(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            sucursal: data.sucursal,
            requerimiento: data.requerimiento,
            planeacion: data.planeacion,
            bom: data.bom,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(RequerimientosPlaneacion);
