import { useState, useEffect, Suspense } from 'react';
import { withRouter, useHistory } from "react-router-dom";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { totalMateriaPrima, listarMateriaPrimaPaginacion } from "../../api/materiaPrima";
import ListMateriasPrimas from "../../components/MateriasPrimas/ListMateriasPrimas";
import RegistroMateriasPrimas from '../../components/MateriasPrimas/RegistroMateriasPrimas';
import BasicModal from "../../components/Modal/BasicModal";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function MateriasPrimas(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalMateriales, setNoTotalMateriales] = useState(0);

    // Para almacenar la lista de materiales
    const [listMateriales, setListMateriales] = useState(null);

    // Para traer la lista de materiales
    useEffect(() => {
        try {
            totalMateriaPrima().then(response => {
                const { data } = response;
                setNoTotalMateriales(data)
            }).catch(e => {
                // console.log(e)
            })

            if (page === 0) {
                setPage(1)

                listarMateriaPrimaPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response
                    if (!listMateriales && data) {
                        setListMateriales(formatModelMateriales(data));
                    } else {
                        const datosMateriales = formatModelMateriales(data);
                        setListMateriales(datosMateriales);
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                listarMateriaPrimaPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response
                    if (!listMateriales && data) {
                        setListMateriales(formatModelMateriales(data));
                    } else {
                        const datosMateriales = formatModelMateriales(data);
                        setListMateriales(datosMateriales);
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
    const registraMaterial = (content) => {
        setTitulosModal("Nuevo material");
        setContentModal(content);
        setShowModal(true);
    }

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    const rutaRegreso = () => {
        enrutamiento.push("/DashboardPlaneacion")
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
                            <FontAwesomeIcon icon={faCirclePlus} /> Registrar un nuevo material
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
                listMateriales ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListMateriasPrimas
                                    listMateriales={listMateriales}
                                    history={history}
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    location={location}
                                    rowsPerPage={rowsPerPage}
                                    setRowsPerPage={setRowsPerPage}
                                    page={page}
                                    setPage={setPage}
                                    noTotalMateriales={noTotalMateriales}
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

export default withRouter(MateriasPrimas);
