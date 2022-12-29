import { useState, useEffect, Suspense } from 'react';
import "./Departamentos.scss";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faPlus, faUsers, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { listarDepartamento } from "../../api/departamentos";
import { useHistory, withRouter } from "react-router-dom";
import ListDepartamentos from "../../components/Departamentos/ListDepartamentos";
import BasicModal from "../../components/Modal/BasicModal";
import RegistroDepartamentos from "../../components/Departamentos/Registro";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import { toast } from "react-toastify";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function Departamentos(props) {
    const { setRefreshCheckLogin, location, history } = props;

    const enrutamiento = useHistory();

    const rutaRegreso = () => {
        enrutamiento.push("/DashboardCatalogos")
    }

    // Para almacenar los departamentos
    const [listDepartamentos, setListDepartamentos] = useState(null);

    // Para determinar si hay conexion a internet o al servidor
    const [conexionInternet, setConexionInternet] = useState(true);

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

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
            listarDepartamento(getSucursal()).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listDepartamentos && data) {
                    setListDepartamentos(formatModelDepartamento(data));
                } else {
                    const datosDepartamentos = formatModelDepartamento(data);
                    setListDepartamentos(datosDepartamentos);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);

    // Para guardar un nuevo dato
    const registraDepartamentos = (content) => {
        setTitulosModal("Registrando");
        setContentModal(content);
        setShowModal(true);
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Mis Departamentos
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Registrar un nuevo departamento"
                            onClick={() => {
                                registraDepartamentos(<RegistroDepartamentos setShowModal={setShowModal} history={history} />)
                            }}
                        >
                            <FontAwesomeIcon icon={faCirclePlus} /> Registrar
                        </Button>
                        <Button
                            className="btnRegistroVentas"
                            title="Regresar al menú catalogos"
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
                listDepartamentos ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListDepartamentos
                                    listDepartamentos={listDepartamentos}
                                    history={history}
                                    setRefreshCheckLogin={setRefreshCheckLogin}
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
            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

function formatModelDepartamento(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            nombre: data.nombre,
            sucursal: data.sucursal,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Departamentos);
