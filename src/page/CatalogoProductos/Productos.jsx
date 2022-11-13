import { useState , useEffect, Suspense } from 'react';
import {Alert, Button, Col, Container, Row, Spinner} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import ListVentas from "../../components/Ventas/ListVentas";
import {getTokenApi, isExpiredToken, logoutApi} from "../../api/auth";
import {toast} from "react-toastify";
import { totalCatalogoProductos, listarCatalogoProductosPaginacion } from "../../api/catalogoProductos";
import { withRouter, useHistory } from "react-router-dom";
import ListProductos from "../../components/CatalogoProductos/ListProductos";
import MateriasPrimas from "../MateriasPrimas";
import BasicModal from "../../components/Modal/BasicModal";
import {map} from "lodash";
import { Switch } from '@headlessui/react'
import "./Productos.scss"
import LayoutPrincipal from "../../layout/layoutPrincipal";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function Productos(props) {
    const{ setRefreshCheckLogin, location, history } = props;
    
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

    // Para definir que productos deben ser mostrados
    const [estadoProductos, setEstadoProductos] = useState("true");

    // Para definir la ruta de registro de los productos
    const rutaRegistraProductos = () => {
        enrutamiento.push("/Registra-CatalogoProductos")
    }
    
    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalProductos, setNoTotalProductos] = useState(0);
    
    // Para almacenar el listado de productos
    const [listProductos, setListProductos] = useState(null);

   useEffect(() => {
        try {
            totalCatalogoProductos().then(response => {
                const { data } = response;
                setNoTotalProductos(data)
            }).catch(e => {
                // console.log(e)
                if(e.message === 'Network Error') {
                    toast.error("Conexión al servidor no disponible");
                }
            })

            if(page === 0) {
                setPage(1)
                listarCatalogoProductosPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response;
                    //console.log(data)
                    if(!listProductos && data){
                        setListProductos(formatModelMatrizProductos(data));
                    } else {
                        const datosProductos = formatModelMatrizProductos(data);
                        setListProductos(datosProductos)
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                listarCatalogoProductosPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response;
                    //console.log(data)
                    if(!listProductos && data){
                        setListProductos(formatModelMatrizProductos(data));
                    } else {
                        const datosProductos = formatModelMatrizProductos(data);
                        setListProductos(datosProductos)
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
                                Catálogo de productos
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                            <Button
                                className="btnRegistroVentas"
                                onClick={() => {
                                    rutaRegistraProductos()
                                }}
                            >
                                <FontAwesomeIcon icon={faCirclePlus} /> Registrar un nuevo producto
                            </Button>
                        </Col>
                    </Row>
                </Alert>

                {
                    listProductos ?
                        (
                            <>
                            <Suspense fallback={<Spinner />}>
                                <ListProductos
                                    listProductos={listProductos}
                                    location={location}
                                    history={history}
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    rowsPerPage={rowsPerPage}
                                    setRowsPerPage={setRowsPerPage}
                                    page={page}
                                    setPage={setPage}
                                    noTotalProductos={noTotalProductos}
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

function formatModelMatrizProductos(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            noInterno: data.noInterno,
            noParte: data.noParte,
            materiaPrima: data.materiaPrima,
            estado: data.estado,
            descripcion: data.descripcion,
            cliente: data.cliente,
            datosMolde: data.datosMolde,
            datosPieza: data.datosPieza,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Productos);
