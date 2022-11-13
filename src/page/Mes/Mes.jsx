import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory, withRouter } from "react-router-dom";
import LayoutPrincipal from "../../layout/layoutPrincipal";
import BasicModal from "../../components/Modal/BasicModal";
import RegistrarMes from "../../components/Mes/RegistraMes";
import ListMeses from "../../components/Mes/ListMeses";
import { listarMesPaginacion, totalMes } from "../../api/mes";
import { getTokenApi, isExpiredToken, logoutApi } from "../../api/auth";
import { toast } from "react-toastify";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function Mes(props) {
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

    // Para registrar los materiales
    const registraMes = (content) => {
        setTitulosModal("Nuevo programa del mes");
        setContentModal(content);
        setShowModal(true);
    }

    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalMes, setNoTotalMes] = useState(0);

    // Para almacenar la lista de las integraciones de ventas y gastos
    const [listMeses, setListMeses] = useState(null);

    useEffect(() => {
        try {
            totalMes().then(response => {
                const { data } = response;
                setNoTotalMes(data)
            })

            // listarOrdenesCompraPaginacion(page, rowsPerPage)
            if (page === 0) {
                setPage(1)
                listarMesPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response;
                    if (!listMeses && data) {
                        setListMeses(formatModelMeses(data));
                    } else {
                        const datosVentas = formatModelMeses(data);
                        setListMeses(datosVentas);
                    }
                }).catch(e => {
                    // console.log(e)
                })
            } else {
                listarMesPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response;
                    if (!listMeses && data) {
                        setListMeses(formatModelMeses(data));
                    } else {
                        const datosVentas = formatModelMeses(data);
                        setListMeses(datosVentas);
                    }
                }).catch(e => {
                    // console.log(e)
                })
            }

        } catch (e) {
            console.log(e)
        }
    }, [location, page, rowsPerPage]);

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    const rutaRegreso = () => {
        enrutamiento.push("/DashboardPlaneacion")
    }

    return (
        <>
            <LayoutPrincipal setRefreshCheckLogin={setRefreshCheckLogin}>
                <Alert>
                    <Row>
                        <Col xs={12} md={8}>
                            <h1>
                                Programa de producción
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                            <Button
                                className="btnRegistroVentas"
                                onClick={() => {
                                    registraMes(
                                        <RegistrarMes
                                            setShowModal={setShowModal}
                                            showModal={showModal}
                                            location={location}
                                            history={history}
                                        />
                                    )
                                }}
                            >
                                <FontAwesomeIcon icon={faCirclePlus} /> Nuevo mes
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
                    listMeses ?
                        (
                            <>
                                <Suspense fallback={<Spinner />}>
                                    <ListMeses
                                        listMeses={listMeses}
                                        location={location}
                                        history={history}
                                        setRefreshCheckLogin={setRefreshCheckLogin}
                                        rowsPerPage={rowsPerPage}
                                        setRowsPerPage={setRowsPerPage}
                                        page={page}
                                        setPage={setPage}
                                        noTotalMeses={noTotalMes}
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

function formatModelMeses(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            mes: data.mes,
            dias: data.dias,
            noMaquinas: data.noMaquinas,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Mes);
