import { useState, useEffect, Suspense } from 'react';
import { withRouter, useHistory } from "react-router-dom";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { totalEmpaque, listarEmpaquePaginacion } from "../../api/empaques";
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

    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalEmpaques, setNoTotalEmpaques] = useState(0);

    // Para almacenar la lista de materiales
    const [listEmpaques, setListEmpaques] = useState(null);

    // Para traer la lista de materiales
    useEffect(() => {
        try {
            totalEmpaque().then(response => {
                const { data } = response;
                setNoTotalEmpaques(data)
            }).catch(e => {
                // console.log(e)
            })

            if (page === 0) {
                setPage(1)

                listarEmpaquePaginacion(page, rowsPerPage).then(response => {
                    const { data } = response
                    if (!listEmpaques && data) {
                        setListEmpaques(formatModelEmpaques(data));
                    } else {
                        const datosEmpaques = formatModelEmpaques(data);
                        setListEmpaques(datosEmpaques);
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                listarEmpaquePaginacion(page, rowsPerPage).then(response => {
                    const { data } = response
                    if (!listEmpaques && data) {
                        setListEmpaques(formatModelEmpaques(data));
                    } else {
                        const datosEmpaques = formatModelEmpaques(data);
                        setListEmpaques(datosEmpaques);
                    }
                }).catch(e => {
                    console.log(e)
                })
            }

        } catch (e) {
            console.log(e)
        }
    }, [location, page, rowsPerPage]);

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
                            <FontAwesomeIcon icon={faCirclePlus} /> Registrar empaque
                        </Button>
                        <Button
                            className="btnRegistroVentas"
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
                                    rowsPerPage={rowsPerPage}
                                    setRowsPerPage={setRowsPerPage}
                                    page={page}
                                    setPage={setPage}
                                    noTotalEmpaques={noTotalEmpaques}
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
