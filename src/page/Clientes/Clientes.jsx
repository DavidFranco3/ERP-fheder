import { useState, useEffect, Suspense } from 'react';
import LayoutPrincipal from "../../layout/layoutPrincipal";
import "./Clientes.scss";
import {Alert, Button, Col, Row, Spinner} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus, faPlus, faUsers} from "@fortawesome/free-solid-svg-icons";
import {totalClientes, listarClientesPaginacion} from "../../api/clientes";
import {toast} from "react-toastify";
import ListClientes from "../../components/Clientes/ListClientes";
import { useHistory ,withRouter } from "react-router-dom";
import {getTokenApi, isExpiredToken, logoutApi} from "../../api/auth";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function Clientes(props) {
    const { setRefreshCheckLogin, location, history } = props;

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
    
        // Ir hacia ruta de registro
    const rutaRegistro = () => {
        enrutamiento.push("/RegistroClientes");
    }

    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalClientes, setNoTotalClientes] = useState(0);
    
    // Para almacenar los usuarios
    const [listClientes, setListClientes] = useState(null);

    // Para determinar el estado de la conexion
    const [conexionInternet, setConexionInternet] = useState(true);

    useEffect(() => {
        try {
            totalClientes().then(response => {
                const { data } = response;
                setNoTotalClientes(data)
            }).catch(e => {
                // console.log(e)
                if(e.message === 'Network Error') {
                    toast.error("Conexión al servidor no disponible");
                }
            })

            if(page === 0) {
                setPage(1)
                listarClientesPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response;
                    //console.log(data)
                    if(!listClientes && data){
                        setListClientes(formatModelClientes(data));
                    } else {
                        const datosClientes = formatModelClientes(data);
                        setListClientes(datosClientes)
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                listarClientesPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response;
                    //console.log(data)
                    if(!listClientes && data){
                        setListClientes(formatModelClientes(data));
                    } else {
                        const datosClientes = formatModelClientes(data);
                        setListClientes(datosClientes)
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
            <LayoutPrincipal className="Clientes" paginaSeleccionada="Clientes" setRefreshCheckLogin={setRefreshCheckLogin}>
                <Alert>
                    <Row>
                        <Col xs={12} md={8}>
                            <h1>
                                Mis clientes
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                            <Button
                                className="btnRegistroVentas"
                                onClick={() => {
                                    rutaRegistro()
                                }}
                            >
                                <FontAwesomeIcon icon={faCirclePlus} /> Registrar una nuevo cliente
                            </Button>
                        </Col>
                    </Row>
                </Alert>

                {
                    listClientes ?
                        (
                            <>
                            <Suspense fallback={<Spinner />}>
                            <ListClientes
                                listClientes={listClientes}
                                    location={location}
                                    history={history}
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    rowsPerPage={rowsPerPage}
                                    setRowsPerPage={setRowsPerPage}
                                    page={page}
                                    setPage={setPage}
                                    noTotalClientes={noTotalClientes}
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
        </>
    );
}

function formatModelClientes(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        const { direccion: { calle, numeroExterior, numeroInterior, colonia, municipio, estado, pais } } = data;
        dataTemp.push({
            id: data._id,
            nombre: data.nombre,
            apellidos: data.apellidos,
            rfc: data.rfc,
            telefonoCelular: data.telefonoCelular,
            calle: calle,
            numeroExterior: numeroExterior,
            numeroInterior: numeroInterior,
            colonia: colonia,
            municipio: municipio,
            estado: estado,
            pais: pais,
            correo: data.correo,
            foto: data.foto,
            estadoCliente: data.estadoCliente,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Clientes);
