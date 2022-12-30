import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory, withRouter } from "react-router-dom";
import { listarLogs } from "../../api/logsGenerales";
import ListLogs from "../../components/Logs/ListLogs";
import moment from "moment";
import "./Logs.scss";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import { toast } from "react-toastify";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function Logs(props) {
    const { setRefreshCheckLogin, location, history } = props;

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

    const rutaRegreso = () => {
        enrutamiento.push("/")
    }

    // Para almacenar todos los log del sistema
    const [listLog, setListLog] = useState(null);

    moment.locale("es");

    useEffect(() => {
        try {
            listarLogs(getSucursal()).then(response => {
                const { data } = response;

                if (!listLog && data) {
                    setListLog(formatModelLogs(data));
                } else {
                    const datosLog = formatModelLogs(data);
                    setListLog(datosLog);
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
                            Logs del sistema
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
                    listLog ?
                        (
                            <>
                                <Suspense fallback={<Spinner />}>
                                    <ListLogs
                                        listLogs={listLog}
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

function formatModelLogs(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            usuario: data.usuario,
            sucursal: data.sucursal,
            correo: data.correo,
            ip: data.ip,
            dispositivo: data.dispositivo,
            descripcion: data.descripcion,
            detalles: data.detalles,
            mensaje: data.detalles.mensaje,
            fechaCreacion: moment(data.createdAt).format('LL'),
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Logs);
