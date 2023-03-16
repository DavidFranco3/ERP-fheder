import { useState, useEffect, Suspense } from 'react';
import { useNavigate } from "react-router-dom";
import { withRouter } from "../../utils/withRouter";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faPlus, faUsers } from "@fortawesome/free-solid-svg-icons";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import { toast } from "react-toastify";
import { listarPlaneaciones } from "../../api/planeacion";
import ListPlaneacion from "../../components/Planeacion/ListPlaneacion";
import "./Planeacion.scss";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { LogsInformativosLogout } from "../../components/Logs/LogsSistema/LogsSistema";

function Planeacion(props) {
    const { setRefreshCheckLogin, location, history } = props;

    const enrutamiento = useNavigate();

    const cierreAutomatico = () => {
        if (getTokenApi()) {
            if (isExpiredToken(getTokenApi())) {
                LogsInformativosLogout("Sesión finalizada", setRefreshCheckLogin)
                toast.warning("Sesión expirada");
                toast.success("Sesión cerrada por seguridad");
                logoutApi();
                setRefreshCheckLogin(true);
            }
        }
    }

    // Cerrado de sesión automatico
    useEffect(() => {
        cierreAutomatico();
    }, []);
    // Termina cerrado de sesión automatico

    // Para ir hacia la ruta de registro del pedido de venta
    const rutaRegistroPlaneacion = () => {
        enrutamiento("/RegistroPlaneacion")
    }

    // Para almacenar el listado de planeaciones
    const [listPlaneaciones, setListPlaneaciones] = useState(null);

    const cargarDatos = () => {
        try {
            listarPlaneaciones(getSucursal()).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listPlaneaciones && data) {
                    setListPlaneaciones(formatModelPlaneacion(data));
                } else {
                    const datosPlaneacion = formatModelPlaneacion(data);
                    setListPlaneaciones(datosPlaneacion);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        cargarDatos();
    }, [location]);


    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8} className="tituloAlertPanel">
                        <h1>
                            Planeación
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Registrar una nueva planeación"
                            onClick={() => {
                                rutaRegistroPlaneacion()
                            }}
                        >
                            <FontAwesomeIcon icon={faCirclePlus} /> Registrar
                        </Button>
                    </Col>
                </Row>
            </Alert>

            {
                listPlaneaciones ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListPlaneacion
                                    listPlaneaciones={listPlaneaciones}
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

function formatModelPlaneacion(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            sucursal: data.sucursal,
            ordenVenta: data.ordenVenta,
            productos: data.productos,
            detalles: data.detalles,
            estado: data.estado,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}


export default withRouter(Planeacion);
