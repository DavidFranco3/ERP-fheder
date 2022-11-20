import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory, withRouter } from "react-router-dom";
import LayoutPrincipal from "../../layout/layoutPrincipal";
import BasicModal from "../../components/Modal/BasicModal";
import RegistroMaterialMolido from "../../components/MaterialMolido/RegistroMaterialMolido";
import ListEtiquetaMolido from '../../components/MaterialMolido/ListEtiquetaMolido';
import { listarEtiquetaMolidoPaginacion, totalEtiquetaMolido } from "../../api/etiquetaMolido";
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../api/auth";
import { toast } from "react-toastify";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function MaterialMolido(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para el registro en el almacen de mp
    const nuevaEtiqueta = (content) => {
        setTitulosModal("Nueva etiqueta de molido");
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

    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalEtiquetas, setNoTotalEtiquetas] = useState(0);

    // Para almacenar la lista de las integraciones de ventas y gastos
    const [listEtiquetas, setListEtiquetas] = useState(null);

    useEffect(() => {
        try {
            totalEtiquetaMolido().then(response => {
                const { data } = response;
                setNoTotalEtiquetas(data)
            })

            // listarOrdenesCompraPaginacion(page, rowsPerPage)
            if (page === 0) {
                setPage(1)
                listarEtiquetaMolidoPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response;
                    if (!listEtiquetas && data) {
                        setListEtiquetas(formatModelEtiquetaMolido(data));
                    } else {
                        const datosEtiqueta = formatModelEtiquetaMolido(data);
                        setListEtiquetas(datosEtiqueta);
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                listarEtiquetaMolidoPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response;
                    if (!listEtiquetas && data) {
                        setListEtiquetas(formatModelEtiquetaMolido(data));
                    } else {
                        const datosEtiqueta = formatModelEtiquetaMolido(data);
                        setListEtiquetas(datosEtiqueta);
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
            <LayoutPrincipal setRefreshCheckLogin={setRefreshCheckLogin}>
                <Alert>
                    <Row>
                        <Col xs={12} md={8}>
                            <h1>
                                Id. Material Molido
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                            <Button
                                className="btnRegistroVentas"
                                onClick={() => {
                                    nuevaEtiqueta(
                                        <RegistroMaterialMolido
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
                               <ListEtiquetaMolido
                                   listEtiquetas={listEtiquetas}
                                   location={location}
                                   history={history}
                                   setRefreshCheckLogin={setRefreshCheckLogin}
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
            </LayoutPrincipal>
        </>
    );
}

function formatModelEtiquetaMolido(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            fecha: data.fecha,
            turno: data.turno,
            descripcion: data.descripcion,
            color: data.color,
            peso: data.peso,
            nombreMolinero: data.nombreMolinero,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(MaterialMolido);
