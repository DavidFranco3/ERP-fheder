import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory, withRouter } from "react-router-dom";
import LayoutPrincipal from "../../layout/layoutPrincipal";
import BasicModal from "../../components/Modal/BasicModal";
import RegistraMaquinas from '../../components/Maquinas/RegistraMaquinas';
import { listarMaquinaPaginacion, totalMaquina } from "../../api/maquinas";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../api/auth";
import { toast } from "react-toastify";
import ListMaquinas from "../../components/Maquinas/ListMaquinas"

function Maquinas(props) {
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
    const registraMaquina = (content) => {
        setTitulosModal("Nueva maquina");
        setContentModal(content);
        setShowModal(true);
    }

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    const rutaRegreso = () => {
        enrutamiento.push("/")
    }

    // Para almacenar la lista de pedidos de venta
    const [listMaquinas, setListMaquinas] = useState(null);

    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalMaquinas, setNoTotalMaquinas] = useState(0);

    useEffect(() => {
        try {
            totalMaquina().then(response => {
                const { data } = response;
                setNoTotalMaquinas(data)
            })

            // listarOrdenesCompraPaginacion(page, rowsPerPage)
            if (page === 0) {
                setPage(1)
                listarMaquinaPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response;
                    if (!listMaquinas && data) {
                        setListMaquinas(formatModelMaquinas(data));
                    } else {
                        const datosMaquinas = formatModelMaquinas(data);
                        setListMaquinas(datosMaquinas);
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                listarMaquinaPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response;
                    if (!listMaquinas && data) {
                        setListMaquinas(formatModelMaquinas(data));
                    } else {
                        const datosMaquinas = formatModelMaquinas(data);
                        setListMaquinas(datosMaquinas);
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
                                Maquinas
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                            <Button
                                className="btnRegistroVentas"
                                onClick={() => {
                                    registraMaquina(
                                        <RegistraMaquinas
                                            setShowModal={setShowModal}
                                            showModal={showModal}
                                            location={location}
                                            history={history}
                                        />
                                    )
                                }}
                            >
                                <FontAwesomeIcon icon={faCirclePlus} /> Nueva maquina
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
                    listMaquinas ?
                        (
                            <>
                                <Suspense fallback={<Spinner />}>
                                    <ListMaquinas
                                        listMaquinas={listMaquinas}
                                        location={location}
                                        history={history}
                                        setRefreshCheckLogin={setRefreshCheckLogin}
                                        rowsPerPage={rowsPerPage}
                                        setRowsPerPage={setRowsPerPage}
                                        page={page}
                                        setPage={setPage}
                                        noTotalMaquinas={noTotalMaquinas}
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

function formatModelMaquinas(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            numeroMaquina: data.numeroMaquina,
            marca: data.marca,
            tonelaje: data.tonelaje,
            lugar: data.lugar,
            status: data.status,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}


export default withRouter(Maquinas);