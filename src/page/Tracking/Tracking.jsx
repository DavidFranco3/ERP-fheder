import { useState, useEffect, Suspense } from 'react';
import { useNavigate } from "react-router-dom";
import { withRouter } from "../../utils/withRouter";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import { toast } from "react-toastify";
import { listarTracking } from "../../api/tracking";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftRotate, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import ListTracking from "../../components/Tracking/ListTracking";
import "./Tracking.scss";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function Tracking(props) {
    const { setRefreshCheckLogin, location, history } = props;

    const enrutamiento = useNavigate();

    const rutaRegreso = () => {
        enrutamiento("/")
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

    // Para almacenar los datos del tracking
    const [listTracking, setListTracking] = useState(null);

    useEffect(() => {
        try {
            listarTracking(getSucursal()).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listTracking && data) {
                    setListTracking(formatModelTracking(data));
                } else {
                    const datosTracking = formatModelTracking(data);
                    setListTracking(datosTracking);
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
                            Tracking
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
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
                listTracking ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListTracking
                                    listTracking={listTracking}
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    history={history}
                                    location={location}
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

function formatModelTracking(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            ordenVenta: data.ordenVenta,
            sucursal: data.sucursal,
            cliente: data.cliente,
            fechaElaboracion: data.fechaElaboracion,
            fechaEntrega: data.fechaEntrega,
            indicador: data.indicador,
            status: data.status,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Tracking);
