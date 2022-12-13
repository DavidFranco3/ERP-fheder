import { useState, useEffect, Suspense } from 'react';
import { withRouter, useHistory } from "react-router-dom";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { listarInsumo } from "../../api/insumos";
import ListInsumos from "../../components/Insumos/ListInsumos";
import RegistroInsumos from '../../components/Insumos/RegistroInsumos';
import BasicModal from "../../components/Modal/BasicModal";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function Insumos(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para almacenar la lista de materiales
    const [listInsumos, setListInsumos] = useState(null);

    useEffect(() => {
        try {
            listarInsumo().then(response => {
                const { data } = response;

                //console.log(data);

                if (!listInsumos && data) {
                    setListInsumos(formatModelInsumos(data));
                } else {
                    const datosInsumos = formatModelInsumos(data);
                    setListInsumos(datosInsumos);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);

    // Para registrar los materiales
    const registraInsumo = (content) => {
        setTitulosModal("Nuevo insumo");
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
                            Lista de insumos
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Registrar un nuevo insumo"
                            onClick={() => {
                                registraInsumo(
                                    <RegistroInsumos
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
                listInsumos ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListInsumos
                                    listInsumos={listInsumos}
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

function formatModelInsumos(data) {
    // console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            descripcion: data.descripcion,
            precio: data.precio,
            um: data.um,
            proveedor: data.proveedor,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Insumos);
