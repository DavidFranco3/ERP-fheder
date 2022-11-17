import { useState, useEffect, Suspense } from 'react';
import { withRouter, useHistory } from "react-router-dom";
import LayoutPrincipal from "../../layout/layoutPrincipal";
import {Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus, faArrowCircleLeft} from "@fortawesome/free-solid-svg-icons";
import RegistroExistenciasAlmacenPT from "../../components/AlmacenPT/RegistroExistenciasAlmacenPT";
import RegistroEntradaSalidaAlmacenPT from "../../components/AlmacenPT/RegistroEntradaSalidaAlmacenPT";
import ListAlmacenPT from "../../components/AlmacenPT/ListAlmacenPT";
import BasicModal from "../../components/Modal/BasicModal";
import {listarPaginacionAlmacenPT, totalAlmacenPT} from "../../api/almacenPT";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function AlmacenPt(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Para definir el enrutamiento
    const enrutamiento = useHistory();

    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalAlmacenPT, setNoTotalAlmacenPT] = useState(0);

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para el registro en el almacen de PT
    const nuevoRegistro = (content) => {
        setTitulosModal("Nuevo registro");
        setContentModal(content);
        setShowModal(true);
    }

    // Para el registro de entradas o salidas
    const nuevaEntradaSalida = (content) => {
        setTitulosModal("Nueva Entrada / Salida");
        setContentModal(content);
        setShowModal(true);
    }

    // Para almacenar el listado de objetos en el almacen de pt
    const [listAlmacenPT, setListAlmacenPT] = useState(null);

    useEffect(() => {
        try {
            totalAlmacenPT().then(response => {
                const { data } = response;
                setNoTotalAlmacenPT(data)
            })
            // listarPaginacionAlmacenMP(page,rowsPerPage)
            if(page === 0) {
                setPage(1)
                listarPaginacionAlmacenPT(page, rowsPerPage).then(response => {
                    const { data } = response;

                    if(!listAlmacenPT &&data) {
                        setListAlmacenPT(formatModelAlmacenPT(data));
                    } else {
                        const datosUsuarios = formatModelAlmacenPT(data);
                        setListAlmacenPT(datosUsuarios);
                    }
                })
            } else {
                listarPaginacionAlmacenPT(page, rowsPerPage).then(response => {
                    const { data } = response;

                    if(!listAlmacenPT &&data) {
                        setListAlmacenPT(formatModelAlmacenPT(data));
                    } else {
                        const datosUsuarios = formatModelAlmacenPT(data);
                        setListAlmacenPT(datosUsuarios);
                    }
                })
            }
        } catch (e) {
            console.log(e)
        }
    }, [location, page, rowsPerPage]);

    const rutaRegreso = () => {
        enrutamiento.push("/DashboardAlmacenes")
    }

    return (
        <>
            <LayoutPrincipal setRefreshCheckLogin={setRefreshCheckLogin}>
                <Alert>
                    <Row>
                        <Col xs={12} md={8} className="tituloPrincipal">
                            <h1>
                                Existencias de almacén producto terminado
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                            <Button
                                className="btnRegistroVentas"
                                onClick={() => {
                                    nuevoRegistro(
                                        <RegistroExistenciasAlmacenPT
                                            setShowModal={setShowModal}
                                            location={location}
                                            history={history}
                                        />
                                    )
                                }}
                            >
                                <FontAwesomeIcon icon={faCirclePlus} /> Nuevo registro
                            </Button>

                            <Button
                                className="btnRegistroVentas"
                                onClick={() => {
                                    nuevaEntradaSalida(
                                        <RegistroEntradaSalidaAlmacenPT
                                            setShowModal={setShowModal}
                                            location={location}
                                            history={history}
                                        />
                                    )
                                }}
                            >
                                <FontAwesomeIcon icon={faCirclePlus} /> Nueva E / S
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
                    listAlmacenPT ?
                        (
                            <>
                                <Suspense fallback={<Spinner />}>
                                    <ListAlmacenPT
                                        listAlmacenPT={listAlmacenPT}
                                        location={location}
                                        history={history}
                                        setRefreshCheckLogin={setRefreshCheckLogin}
                                        rowsPerPage={rowsPerPage}
                                        setRowsPerPage={setRowsPerPage}
                                        page={page}
                                        setPage={setPage}
                                        noTotalAlmacenPT={noTotalAlmacenPT}
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

            </LayoutPrincipal>

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

function formatModelAlmacenPT(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folioAlmacen: data.folioAlmacen,
            folioMP: data.folioMP,
            nombre: data.nombre,
            descripcion: data.descripcion,
            um: data.um,
            movimientos: data.movimientos,
            existenciasOV: data.existenciasOV,
            existenciasStock: data.existenciasStock,
            existenciasTotales: data.existenciasTotales,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(AlmacenPt);
