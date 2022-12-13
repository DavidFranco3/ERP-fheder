import { useState, useEffect, Suspense } from 'react';
import { withRouter, useHistory } from "react-router-dom";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { listarEmpaque } from "../../api/empaques";
import ListEmpaques from '../../components/Empaques/ListEmpaques';
import RegistroEmpaque from '../../components/Empaques/RegistroEmpaque';
import BasicModal from "../../components/Modal/BasicModal";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function Empaques(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para almacenar la lista de materiales
    const [listEmpaques, setListEmpaques] = useState(null);

    // Para traer la lista de materiales
    useEffect(() => {
        try {
            listarEmpaque().then(response => {
                const { data } = response;

                //console.log(data);

                if (!listEmpaques && data) {
                    setListEmpaques(formatModelEmpaques(data));
                } else {
                    const datosEmpaques = formatModelEmpaques(data);
                    setListEmpaques(datosEmpaques);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);

    // Para registrar los materiales
    const registraEmpaque = (content) => {
        setTitulosModal("Nuevo empaque");
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
                            Lista de empaques
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Registrar un nuevo empaque"
                            onClick={() => {
                                registraEmpaque(
                                    <RegistroEmpaque
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
                listEmpaques ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListEmpaques
                                    listEmpaques={listEmpaques}
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

function formatModelEmpaques(data) {
    // console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            nombre: data.nombre,
            precio: data.precio,
            um: data.um,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Empaques);
