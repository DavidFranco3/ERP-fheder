import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory, withRouter } from "react-router-dom";
import BasicModal from "../../components/Modal/BasicModal";
import RegistroIdentificacionPT from "../../components/IdentificacionPT/RegistroIdentificacionPT";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { listarEtiquetaPTPaginacion, totalEtiquetasPT } from "../../api/etiquetaIdentificacionPT";
import ListEtiquetasPT from '../../components/IdentificacionPT/ListEtiquetasPT';

function IdentificacionPT(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para el registro en el almacen de mp
    const nuevaEtiqueta = (content) => {
        setTitulosModal("Nueva etiqueta de Id. PT");
        setContentModal(content);
        setShowModal(true);
    }

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegistro = () => {
        enrutamiento.push("/RegistroReporte")
    }

    const rutaRegreso = () => {
        enrutamiento.push("/DashboardProduccion")
    }

    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalEtiquetas, setNoTotalEtiquetas] = useState(0);

    // Para almacenar el listado de compras realizadas
    const [listEtiquetas, setListEtiquetas] = useState(null);

    useEffect(() => {
        try {
            totalEtiquetasPT().then(response => {
                const { data } = response;
                setNoTotalEtiquetas(data)
            }).catch(e => {
                // console.log(e)
            })

            // listarOrdenesCompraPaginacion(pagina, limite)

            if (page === 0) {
                setPage(1)

                listarEtiquetaPTPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response
                    if (!listEtiquetas && data) {
                        setListEtiquetas(formatModelEtiquetas(data));
                    } else {
                        const datosEtiquetas = formatModelEtiquetas(data);
                        setListEtiquetas(datosEtiquetas);
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                listarEtiquetaPTPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response
                    if (!listEtiquetas && data) {
                        setListEtiquetas(formatModelEtiquetas(data));
                    } else {
                        const datosEtiquetas = formatModelEtiquetas(data);
                        setListEtiquetas(datosEtiquetas);
                    }
                }).catch(e => {
                    console.log(e)
                })
            }

        } catch (e) {
            console.log(e)
        }
    }, [location, page, rowsPerPage]);


    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Etiqueta de identificacion PT
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            onClick={() => {
                                nuevaEtiqueta(
                                    <RegistroIdentificacionPT
                                        setShowModal={setShowModal}
                                        location={location}
                                        history={history}
                                    />
                                )
                            }}
                        >
                            <FontAwesomeIcon icon={faCirclePlus} /> Nueva etiqueta
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
                listEtiquetas ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListEtiquetasPT
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    listEtiquetas={listEtiquetas}
                                    history={history}
                                    location={location}
                                    rowsPerPage={rowsPerPage}
                                    setRowsPerPage={setRowsPerPage}
                                    page={page}
                                    setPage={setPage}
                                    noTotalEtiquetas={noTotalEtiquetas}
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

function formatModelEtiquetas(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            fecha: data.fecha,
            descripcion: data.descripcion,
            noParte: data.noParte,
            noOrden: data.noOrden,
            cantidad: data.cantidad,
            turno: data.turno,
            operador: data.operador,
            supervisor: data.supervisor,
            inspector: data.inspector,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(IdentificacionPT);
