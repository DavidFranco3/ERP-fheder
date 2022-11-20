import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory, withRouter } from "react-router-dom";
import LayoutPrincipal from "../../layout/layoutPrincipal";
import BasicModal from "../../components/Modal/BasicModal";
import RegistroPrimeraPieza from "../../components/EtiquetaPrimeraPieza/RegistraPrimeraPieza";
import { listarEtiquetasPiezasPaginacion, totalEtiquetasPiezas } from "../../api/etiquetaPrimeraPieza";
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../api/auth";
import { toast } from "react-toastify";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import ListEtiquetasPrimeraPieza from '../../components/EtiquetaPrimeraPieza/ListEtiquetasPrimeraPieza';

function EtiquetaPrimeraPieza(props) {
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

    // Para el registro en el almacen de mp
    const nuevaEtiqueta1eraPieza = (content) => {
        setTitulosModal("Nuevo etiqueta 1ra pieza");
        setContentModal(content);
        setShowModal(true);
    }

    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalEtiquetas, setNoTotalEtiquetas] = useState(0);

    // Para almacenar la lista de las integraciones de ventas y gastos
    const [listEtiquetas, setListEtiquetas] = useState(null);

    useEffect(() => {
        try {
            totalEtiquetasPiezas().then(response => {
                const { data } = response;
                setNoTotalEtiquetas(data)
            })

            // listarOrdenesCompraPaginacion(page, rowsPerPage)
            if (page === 0) {
                setPage(1)
                listarEtiquetasPiezasPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response;
                    if (!listEtiquetas && data) {
                        setListEtiquetas(formatModelEtiquetaPrimeraPieza(data));
                    } else {
                        const datosVentas = formatModelEtiquetaPrimeraPieza(data);
                        setListEtiquetas(datosVentas);
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                listarEtiquetasPiezasPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response;
                    if (!listEtiquetas && data) {
                        setListEtiquetas(formatModelEtiquetaPrimeraPieza(data));
                    } else {
                        const datosVentas = formatModelEtiquetaPrimeraPieza(data);
                        setListEtiquetas(datosVentas);
                    }
                }).catch(e => {
                    console.log(e)
                })
            }

        } catch (e) {
            console.log(e)
        }
    }, [location, page, rowsPerPage]);

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    const rutaRegreso = () => {
       enrutamiento.push("/DashboardCalidad")
   }

    return (
        <>
            <LayoutPrincipal setRefreshCheckLogin={setRefreshCheckLogin}>
                <Alert>
                    <Row>
                        <Col xs={12} md={8}>
                            <h1>
                                Registro de primera pieza
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                            <Button
                                className="btnRegistroVentas"
                                onClick={() => {
                                    nuevaEtiqueta1eraPieza(
                                        <RegistroPrimeraPieza
                                            setShowModal={setShowModal}
                                            location={location}
                                            history={history}
                                        />
                                    )
                                }}
                            >
                                <FontAwesomeIcon icon={faCirclePlus} /> Nueva etiqueta 1era pieza
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
                               <ListEtiquetasPrimeraPieza
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

function formatModelEtiquetaPrimeraPieza(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            fecha: data.fecha,
            noMaquina: data.noMaquina,
            descripcionProducto: data.descripcionProducto,
            cliente: data.cliente,
            peso: data.peso,
            noCavidades: data.noCavidades,
            turno: data.turno,
            inspector: data.inspector,
            supervisor: data.supervisor,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(EtiquetaPrimeraPieza);
