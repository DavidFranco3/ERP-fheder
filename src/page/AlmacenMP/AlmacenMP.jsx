import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { listarAlmacenMP } from "../../api/almacenMP";
import ListAlmacenMP from "../../components/AlmacenMP/ListAlmacenMP";
import { withRouter, useHistory } from "react-router-dom";
import BasicModal from "../../components/Modal/BasicModal";
import RegistroExistenciasAlmacenMP from "../../components/AlmacenMP/RegistroExistenciasAlmacenMP";
import RegistroEntradaSalida from "../../components/AlmacenMP/RegistroEntradaSalida";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function AlmacenMp(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Para definir el enrutamiento
    const enrutamiento = useHistory();

    // Para definir la ruta hacia la vista de gestión de compras realizadas por almacen
    const rutaHaciaComprasAlmacen = () => {
        enrutamiento.push("/Compras/AlmacenMP")
    }

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

    // Para el registro de entradas o salidas
    const nuevaEntradaSalida = (content) => {
        setTitulosModal("Nueva Entrada / Salida");
        setContentModal(content);
        setShowModal(true);
    }

    // Almacenar el listado de materias primas registradas
    const [listAlmacenMP, setListAlmacenMP] = useState(null);

    useEffect(() => {
        try {
            listarAlmacenMP().then(response => {
                const { data } = response;

                //console.log(data);

                if (!listAlmacenMP && data) {
                    setListAlmacenMP(formatModelAlmacenMP(data));
                } else {
                    const datosAlmacen = formatModelAlmacenMP(data);
                    setListAlmacenMP(datosAlmacen);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);

    const rutaRegreso = () => {
        enrutamiento.push("/DashboardAlmacenes")
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8} className="tituloPrincipal">
                        <h1>
                            Existencias de almacén Materia Prima
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Registrar una existencia"
                            onClick={() => {
                                nuevoRegistro(
                                    <RegistroExistenciasAlmacenMP
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
                            title="Registrar una entrada/salida"
                            onClick={() => {
                                nuevaEntradaSalida(
                                    <RegistroEntradaSalida
                                        setShowModal={setShowModal}
                                        location={location}
                                        history={history}
                                    />
                                )
                            }}
                        >
                            <FontAwesomeIcon icon={faCirclePlus} /> Nueva E / S
                        </Button>

                        <Button
                            className="btnRegistroVentas"
                            title="Regresar al menú almacenes"
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
                listAlmacenMP ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListAlmacenMP
                                    listAlmacenMP={listAlmacenMP}
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

function formatModelAlmacenMP(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folioAlmacen: data.folioAlmacen,
            nombreMP: data.nombreMP,
            um: data.um,
            fecha: data.fecha,
            movimientos: data.movimientos,
            cantidadExistencia: data.cantidadExistencia,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(AlmacenMp);
