import { useState, useEffect, Suspense } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { withRouter } from "../../utils/withRouter";
import "./GestionAlmacen.scss";
import { listarAlmacenes } from "../../api/gestionAlmacen";
import { toast } from "react-toastify";
import ListGestionAlmacen from "../../components/GestionAlmacen/ListGestionAlmacen";
import RegistroGestionAlmacen from "../../components/GestionAlmacen/Registro";
import BasicModal from "../../components/Modal/BasicModal";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function GestionAlmacen(props) {
    const { setRefreshCheckLogin, location, history } = props;

    const enrutamiento = useNavigate();

    const rutaRegreso = () => {
        enrutamiento("/DashboardConfiguracion")
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

    // Para almacenar los usuarios
    const [listGestionAlmacen, setListGestionAlmacen] = useState(null);

    // Para determinar el estado de la conexion
    const [conexionInternet, setConexionInternet] = useState(true);

    useEffect(() => {
        try {
            listarAlmacenes(getSucursal()).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listGestionAlmacen && data) {
                    setListGestionAlmacen(formatModelGestionAlmacen(data));
                } else {
                    const datosAlmacen = formatModelGestionAlmacen(data);
                    setListGestionAlmacen(datosAlmacen);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para el registro en el almacen de mp
    const nuevoRegistro = (content) => {
        setTitulosModal("Nuevo registro");
        setContentModal(content);
        setShowModal(true);
    }


    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Mis almacenes
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Registrar un nuevo almacen"
                            onClick={() => {
                                nuevoRegistro(
                                    <RegistroGestionAlmacen
                                        setShowModal={setShowModal}
                                        location={location}
                                        history={history}
                                    />
                                )
                            }}
                        >
                            <FontAwesomeIcon icon={faCirclePlus} /> Registrar
                        </Button>
                        <Button
                            className="btnRegistroVentas"
                            title="Regresar al menú configuración"
                            onClick={() => {
                                rutaRegreso()
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowCircleLeft} /> Regresar
                        </Button>
                    </Col>
                </Row>
            </Alert>

            {listGestionAlmacen ?
                (
                    <>
                        <Suspense fallback={<Spinner />}>
                            <ListGestionAlmacen
                                listGestionAlmacen={listGestionAlmacen}
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
            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

function formatModelGestionAlmacen(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            nombre: data.nombre,
            descripcion: data.descripcion,
            sucursal: data.sucursal,
            status: data.status,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(GestionAlmacen);
