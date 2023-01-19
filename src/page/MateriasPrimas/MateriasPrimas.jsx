import { useState, useEffect, Suspense } from 'react';
import { withRouter, useHistory } from "react-router-dom";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { listarMateriaPrima } from "../../api/materiaPrima";
import ListMateriasPrimas from "../../components/MateriasPrimas/ListMateriasPrimas";
import RegistroMateriasPrimas from '../../components/MateriasPrimas/RegistroMateriasPrimas';
import BasicModal from "../../components/Modal/BasicModal";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import { toast } from "react-toastify";

function MateriasPrimas(props) {
    const { setRefreshCheckLogin, location, history } = props;

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

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para almacenar la lista de materiales
    const [listMateriales, setListMateriales] = useState(null);

    useEffect(() => {
        try {
            listarMateriaPrima(getSucursal()).then(response => {
                const { data } = response;

                if (!listMateriales && data) {
                    setListMateriales(formatModelMateriales(data));
                } else {
                    const datosMateriales = formatModelMateriales(data);
                    setListMateriales(datosMateriales);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);

    // Para registrar los materiales
    const registraMaterial = (content) => {
        setTitulosModal("Nuevo material");
        setContentModal(content);
        setShowModal(true);
    }

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    const rutaRegreso = () => {
        enrutamiento.push("/DashboardCatalogos")
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Lista de materiales
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Registrar un nuevo material"
                            onClick={() => {
                                registraMaterial(
                                    <RegistroMateriasPrimas
                                        setShowModal={setShowModal}
                                        showModal={showModal}
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
                listMateriales ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListMateriasPrimas
                                    listMateriales={listMateriales}
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

function formatModelMateriales(data) {
    // console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            sucursal: data.sucursal,
            descripcion: data.descripcion,
            tipoMaterial: data.tipoMaterial,
            precio: data.precio,
            um: data.um,
            proveedor: data.proveedor,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(MateriasPrimas);
