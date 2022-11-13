import { useState, useEffect, Suspense } from 'react';
import "./Departamentos.scss";
import {Alert, Button, Col, Row, Spinner} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus, faPlus, faUsers} from "@fortawesome/free-solid-svg-icons";
import LayoutPrincipal from "../../layout/layoutPrincipal";
import {totalDepartamentos, listarDepartamentosPaginacion} from "../../api/departamentos";
import { useHistory, withRouter } from "react-router-dom";
import ListDepartamentos from "../../components/Departamentos/ListDepartamentos";
import BasicModal from "../../components/Modal/BasicModal";
import RegistroDepartamentos from "../../components/Departamentos/Registro";
import {getTokenApi, isExpiredToken, logoutApi} from "../../api/auth";
import {toast} from "react-toastify";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';


function Departamentos(props) {
    const { setRefreshCheckLogin, location, history } = props;
    
     // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalDepartamentos, setNoTotalDepartamentos] = useState(0);
    
    // Para almacenar los departamentos
    const [listDepartamentos, setListDepartamentos] = useState(null);

    // Para determinar si hay conexion a internet o al servidor
    const [conexionInternet, setConexionInternet] = useState(true);

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    const enrutamiento = useHistory();

    // Cerrado de sesión automatico
    useEffect(() => {
        if(getTokenApi()) {
            if(isExpiredToken(getTokenApi())) {
                toast.warning("Sesión expirada");
                toast.success("Sesión cerrada por seguridad");
                logoutApi();
                setRefreshCheckLogin(true);
            }
        }
    }, []);
    // Termina cerrado de sesión automatico

    useEffect(() => {
        try {
            totalDepartamentos().then(response =>{
                const { data } = response;
                setNoTotalDepartamentos(data)
            }).catch(e => {
                // console.log(e)
            })

            // listarOrdenesCompraPaginacion(pagina, limite)

            if(page === 0) {
                setPage(1)

                listarDepartamentosPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response
                    if(!listDepartamentos &&data) {
                        setListDepartamentos(formatModelDepartamento(data));
                    } else {
                        const datosDepartamentos = formatModelDepartamento(data);
                        setListDepartamentos(datosDepartamentos);
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                listarDepartamentosPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response
                    if(!listDepartamentos &&data) {
                        setListDepartamentos(formatModelDepartamento(data));
                    } else {
                        const datosDepartamentos = formatModelDepartamento(data);
                        setListDepartamentos(datosDepartamentos);
                    }
                }).catch(e => {
                    console.log(e)
                })
            }

        } catch (e) {
            console.log(e)
        }
    }, [location, page, rowsPerPage]);

    // Para guardar un nuevo dato
    const registraDepartamentos = (content) => {
        setTitulosModal("Registrando");
        setContentModal(content);
        setShowModal(true);
    }


    return (
        <>
            <LayoutPrincipal className="Departamentos" paginaSeleccionada="Departamentos" setRefreshCheckLogin={setRefreshCheckLogin}>
                <Alert>
                    <Row>
                        <Col xs={12} md={8}>
                            <h1>
                                Mis Departamentos
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                            <Button
                                className="btnRegistroVentas"
                                onClick={() => {
                                    registraDepartamentos(<RegistroDepartamentos setShowModal={setShowModal} history={history} />)
                                }}
                            >
                                <FontAwesomeIcon icon={faCirclePlus} /> Registrar una nuevo departamento
                            </Button>
                        </Col>
                    </Row>
                </Alert>

                {
                    listDepartamentos ?
                        (
                            <>
                            <Suspense fallback={<Spinner /> }>
                                <ListDepartamentos 
                                listDepartamentos={listDepartamentos} 
                                history={history}
                                setRefreshCheckLogin={setRefreshCheckLogin}
                                location={location}
                                rowsPerPage={rowsPerPage}
                                setRowsPerPage={setRowsPerPage}
                                page={page}
                                setPage={setPage}
                                noTotalDepartamentos={noTotalDepartamentos}
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

function formatModelDepartamento(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            nombre: data.nombre,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Departamentos);
