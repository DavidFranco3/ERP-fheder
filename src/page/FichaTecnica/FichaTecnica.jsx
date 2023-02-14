import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { withRouter } from "../../utils/withRouter";
import { toast } from "react-toastify";
import ListFichasTecnicas from '../../components/FichaTecnica/ListFichasTecnicas';
import { listarFichasTecnicas } from "../../api/fichasTecnicas";
import "./FichaTecnica.scss"
import { getSucursal, getTokenApi, isExpiredToken, logoutApi } from '../../api/auth';
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function FichaTecnica(props) {
    const { location, history, setRefreshCheckLogin } = props;

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
    const [listFichasTecnicas, setListFichasTecnicas] = useState(null);

    useEffect(() => {
        try {
            listarFichasTecnicas(getSucursal()).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listFichasTecnicas && data) {
                    setListFichasTecnicas(formatModelFichasTecnicas(data));
                } else {
                    const datosFichas = formatModelFichasTecnicas(data);
                    setListFichasTecnicas(datosFichas);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);

    // Para definir el enrutamiento
    const enrutamiento = useNavigate()

    // Define la ruta de registro
    const rutaRegistro = () => {
        enrutamiento("/RegistroFichaTecnica")
    }

    const rutaRegreso = () => {
        enrutamiento("/DashboardCalidad")
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Fichas tecnicas
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Registrar una nueva ficha"
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
                listFichasTecnicas ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListFichasTecnicas
                                    listFichasTecnicas={listFichasTecnicas}
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

function formatModelFichasTecnicas(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            descripcion: data.descripcion,
            fechaElaboracion: data.fechaElaboracion,
            realizo: data.realizo,
            autorizo: data.autorizo,
            sucursal: data.sucursal,
            fichas: data.fichas,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(FichaTecnica);
