import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory, withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import ListCertificadosCalidad from '../../components/CertificadosCalidad/ListCertificadosCalidad';
import { listarCertificado } from "../../api/certificadosCalidad";
import "./CertificadosCalidad.scss"
import { getTokenApi, isExpiredToken, logoutApi } from "../../api/auth";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function CertificadosCalidad(props) {
    const { setRefreshCheckLogin, history, location } = props;

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegistro = () => {
        enrutamiento.push("/RegistroCertificadoCalidad")
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
    const [listCertificados, setListCertificados] = useState(null);

    useEffect(() => {
        try {
            listarCertificado().then(response => {
                const { data } = response;

                //console.log(data);

                if (!listCertificados && data) {
                    setListCertificados(formatModelCertificadosCalidad(data));
                } else {
                    const datosCertificado = formatModelCertificadosCalidad(data);
                    setListCertificados(datosCertificado);
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
                            Certificados de calidad
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Registrar un nuevo certificado de calidad"
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
                listCertificados ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListCertificadosCalidad
                                    listCertificados={listCertificados}
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

function formatModelCertificadosCalidad(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            fecha: data.fecha,
            noOrdenInterna: data.noOrdenInterna,
            tamañoLote: data.tamañoLote,
            cliente: data.cliente,
            descripcion: data.descripcion,
            numeroParte: data.numeroParte,
            especificacionInforme: data.especificacionInforme,
            revisionAtributos: data.revisionAtributos,
            resultadoDimensional: data.resultadoDimensional,
            observacionesResultados: data.observacionesResultados,
            equipoMedicion: data.equipoMedicion,
            referencia: data.referencia,
            realizo: data.realizo,
            correo: data.correo,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(CertificadosCalidad);
