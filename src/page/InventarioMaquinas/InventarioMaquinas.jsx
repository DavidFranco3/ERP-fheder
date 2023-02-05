import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory, withRouter } from "react-router-dom";
import BasicModal from "../../components/Modal/BasicModal";
import RegistraInventarioMaquinas from "../../components/InventarioMaquinas/RegistraInventarioMaquinas";
import { getSucursal, getTokenApi, isExpiredToken, logoutApi } from '../../api/auth';
import { toast } from "react-toastify";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { listarInventarioMaquina } from "../../api/inventarioMaquinas";
import ListInventarioMaquina from '../../components/InventarioMaquinas/ListInventarioMaquina';

function InventarioMaquinas(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para el registro en el almacen de PT
    const nuevoRegistro = (content) => {
        setTitulosModal("Nueva maquina");
        setContentModal(content);
        setShowModal(true);
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

    const rutaRegreso = () => {
        enrutamiento.push("/DashboardMantenimiento")
    }

    // Para almacenar la lista de pedidos de venta
    const [listInventarios, setListInventarios] = useState(null);

    useEffect(() => {
        try {
            listarInventarioMaquina(getSucursal()).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listInventarios && data) {
                    setListInventarios(formatModelInventariosMaquina(data));
                } else {
                    const datosInventario = formatModelInventariosMaquina(data);
                    setListInventarios(datosInventario);
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
                            Inventarios de maquinas
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Registrar una nueva maquina"
                            onClick={() => {
                                nuevoRegistro(
                                    <RegistraInventarioMaquinas
                                        setShowModal={setShowModal}
                                        history={history}
                                    />
                                )
                            }}
                        >
                            <FontAwesomeIcon icon={faCirclePlus} /> Registrar
                        </Button>
                        <Button
                            className="btnRegistroVentas"
                            title="Regresar el menú mantenimiento"
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
                listInventarios ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListInventarioMaquina
                                    listInventarios={listInventarios}
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

function formatModelInventariosMaquina(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            tipo: data.tipo,
            codigo: data.codigo,
            noMaquina: data.noMaquina,
            descripcion: data.descripcion,
            capacidad: data.capacidad,
            unidades: data.unidades,
            marca: data.marca,
            modelo: data.modelo,
            noSerie: data.noSerie,
            sucursal: data.sucursal,
            fechaAdquisicion: data.fechaAdquisicion,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(InventarioMaquinas);
