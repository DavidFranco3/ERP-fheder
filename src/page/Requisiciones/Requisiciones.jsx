import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { withRouter, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import { obtenerUsuario } from "../../api/usuarios";
import { listarRequisiciones } from "../../api/requisicion";
import ListRequisiciones from '../../components/Requisiciones/ListRequisiciones';

function Requisiciones(props) {
    const { setRefreshCheckLogin, location, history } = props;

    const enrutamiento = useHistory();

    // Para definir la ruta de registro de los productos
    const rutaRegistraRequisiciones = () => {
        enrutamiento.push("/RegistroRequisicion")
    }

    // Para almacenar el listado de compras realizadas
    const [listRequisiciones, setListRequisiciones] = useState(null);

    useEffect(() => {
        try {
            listarRequisiciones(getSucursal()).then(response => {
                const { data } = response;

                if (!listRequisiciones && data) {
                    setListRequisiciones(formatModelRequisiciones(data));
                } else {
                    const datosRequisiciones = formatModelRequisiciones(data);
                    setListRequisiciones(datosRequisiciones);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);

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
        enrutamiento.push("/DashboardCompras")
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Mis requisiciones
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Registrar una requisición"
                            onClick={() => {
                                rutaRegistraRequisiciones()
                            }}
                        >
                            <FontAwesomeIcon icon={faCirclePlus} /> Registrar
                        </Button>
                        <Button
                            className="btnRegistroVentas"
                            title="Regresar al menú compras"
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
                listRequisiciones ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListRequisiciones
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    listRequisiciones={listRequisiciones}
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

function formatModelRequisiciones(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            sucursal: data.sucursal,
            fechaElaboracion: data.fechaElaboracion,
            solicitante: data.solicitante,
            aprobo: data.aprobo,
            comentarios: data.comentarios,
            tipoRequisicion: data.tipoRequisicion,
            tipoAplicacion: data.tipoAplicacion,
            departamento: data.departamento,
            productosSolicitados: data.productosSolicitados,
            estado: data.estado,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Requisiciones);
