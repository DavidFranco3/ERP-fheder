import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { getTokenApi, isExpiredToken, logoutApi } from "../../api/auth";
import { toast } from "react-toastify";
import { totalProveedores, listarProveedoresPaginacion } from "../../api/proveedores";
import { withRouter, useHistory } from "react-router-dom";
import ListProveedores from "../../components/Proveedores/ListProveedores";
import BasicModal from "../../components/Modal/BasicModal";
import RegistraProveedores from "../../components/Proveedores/RegistraProveedores";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function Proveedores(props) {
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

    // Para definir el salto entre rutas
    const enrutamiento = useHistory();

    // Para determinar el estado de la conexion
    const [conexionInternet, setConexionInternet] = useState(true);

    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalProveedores, setNoTotalProveedores] = useState(0);

    // Para almacenar el listado de proveedores
    const [listProveedores, setListProveedores] = useState(null);

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    useEffect(() => {
        try {
            totalProveedores().then(response => {
                const { data } = response;
                setNoTotalProveedores(data)
            }).catch(e => {
                // console.log(e)
            })

            if (page === 0) {
                setPage(1)

                listarProveedoresPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response
                    if (!listProveedores && data) {
                        setListProveedores(formatModelProveedores(data));
                    } else {
                        const datosProveedores = formatModelProveedores(data);
                        setListProveedores(datosProveedores);
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                listarProveedoresPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response
                    if (!listProveedores && data) {
                        setListProveedores(formatModelProveedores(data));
                    } else {
                        const datosProveedores = formatModelProveedores(data);
                        setListProveedores(datosProveedores);
                    }
                }).catch(e => {
                    console.log(e)
                })
            }

        } catch (e) {
            console.log(e)
        }
    }, [location, page, rowsPerPage]);

    //Para el registro de proveedores
    const registraProveedor = (content) => {
        setTitulosModal("Registra proveedor");
        setContentModal(content);
        setShowModal(true);
    }

    const rutaRegreso = () => {
        enrutamiento.push("/DashboardCompras")
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Mis proveedores
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            onClick={() => {
                                registraProveedor(
                                    <RegistraProveedores
                                        history={history}
                                        setShowModal={setShowModal}
                                    />
                                )
                            }}
                        >
                            <FontAwesomeIcon icon={faCirclePlus} /> Registrar una nuevo proveedor
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

            {listProveedores ?
                (
                    <>
                        <Suspense fallback={<Spinner />}>
                            <ListProveedores
                                listProveedores={listProveedores}
                                history={history}
                                setRefreshCheckLogin={setRefreshCheckLogin}
                                location={location}
                                rowsPerPage={rowsPerPage}
                                setRowsPerPage={setRowsPerPage}
                                page={page}
                                setPage={setPage}
                                noTotalProveedores={noTotalProveedores}
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

function formatModelProveedores(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            nombre: data.nombre,
            tipo: data.tipo,
            productoServicio: data.productoServicio,
            categoria: data.categoria,
            personalContacto: data.personalContacto,
            telefono: data.telefono,
            correo: data.correo,
            tiempoCredito: data.tiempoCredito,
            tiempoRespuesta: data.tiempoRespuesta,
            lugarRecoleccion: data.lugarRecoleccion,
            horario: data.horario,
            comentarios: data.comentarios,
            estado: data.estado,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Proveedores);
