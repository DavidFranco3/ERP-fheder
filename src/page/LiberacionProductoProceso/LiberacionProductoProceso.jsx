import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory, withRouter } from "react-router-dom";
import { listarLiberacionProducto } from "../../api/liberacionProductoProceso";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../api/auth";
import { toast } from "react-toastify";
import ListLiberacionProducto from '../../components/LiberacionProductoProceso/ListLiberacionProducto';

function LiberacionProductoProceso(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegistro = () => {
        enrutamiento.push("/RegistroLiberacionProductoProceso")
    }

    const rutaRegreso = () => {
        enrutamiento.push("/DashboardCalidad")
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

    // Para almacenar la lista de pedidos de venta
    const [listLiberacion, setListLiberacion] = useState(null);

    useEffect(() => {
        try {
            listarLiberacionProducto().then(response => {
                const { data } = response;

                //console.log(data);

                if (!listLiberacion && data) {
                    setListLiberacion(formatModelLiberacionProducto(data));
                } else {
                    const datosLiberacion = formatModelLiberacionProducto(data);
                    setListLiberacion(datosLiberacion);
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
                            Hoja de liberación de Producto y Proceso
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Registrar una nueva hoja de liberación de producto y proceso"
                            onClick={() => {
                                rutaRegistro()
                            }}
                        >
                            <FontAwesomeIcon icon={faCirclePlus} /> Registrar
                        </Button>
                        <Button
                            className="btnRegistroVentas"
                            title="Regresar al menú calidad"
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
                listLiberacion ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListLiberacionProducto
                                    listLiberacion={listLiberacion}
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

function formatModelLiberacionProducto(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            cliente: data.cliente,
            descripcionPieza: data.descripcionPieza,
            noParteMolde: data.noParteMolde,
            procesoRealizado: data.procesoRealizado,
            fechaElaboracion: data.fechaElaboracion,
            fechaArranqueMolde: data.fechaArranqueMolde,
            noMaquina: data.noMaquina,
            hojaLiberacion: data.hojaLiberacion,
            elaboro: data.elaboro,
            turno: data.turno,
            proceso: data.proceso,
            producto: data.producto,
            observaciones: data.observaciones,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(LiberacionProductoProceso);
