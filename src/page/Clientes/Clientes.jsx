import { useState, useEffect, Suspense } from 'react';
import "./Clientes.scss";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faPlus, faUsers, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { listarClientes } from "../../api/clientes";
import { toast } from "react-toastify";
import ListClientes from "../../components/Clientes/ListClientes";
import { useNavigate } from "react-router-dom";
import { withRouter } from "../../utils/withRouter";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function Clientes(props) {
    const { setRefreshCheckLogin, location, history } = props;

    const enrutamiento = useNavigate();

    const rutaRegreso = () => {
        enrutamiento("/DashboardCatalogos")
    }

    // Cerrado de sesión automatico
    useEffect(() => {
        if (getTokenApi()) {
            if (isExpiredToken(getTokenApi())) {
                toast.warning("Sesión expirada");
                toast.success("Sesión cerrada por seguridad");
                logoutApi();
                enrutamiento("");
                setRefreshCheckLogin(true);
            }
        }
    }, []);
    // Termina cerrado de sesión automatico

    // Ir hacia ruta de registro
    const rutaRegistro = () => {
        enrutamiento("/RegistroClientes");
    }

    // Recuperación de la razón social seleccionada
    const [razonSocialElegida, setRazonSocialElegida] = useState("Sin Selección");

    useEffect(() => {
        if (getSucursal()) {
            setRazonSocialElegida(getSucursal)
        } else {
            setRazonSocialElegida("Sin Selección")
        }
    }, []);
    // Termina recuperación de la razón social recuperada

    // Para almacenar los usuarios
    const [listClientes, setListClientes] = useState(null);

    useEffect(() => {
        try {
            listarClientes(getSucursal()).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listClientes && data) {
                    setListClientes(formatModelClientes(data));
                } else {
                    const datosClientes = formatModelClientes(data);
                    setListClientes(datosClientes);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);


    return (
        <>
            {
                razonSocialElegida === "Sin Selección" ?
                    (
                        <>
                            <Lottie
                                loop={true}
                                play={true}
                                animationData={AnimacionLoading}
                            />
                        </>
                    )
                    :
                    (
                        <>
                            <Alert>
                                <Row>
                                    <Col xs={12} md={8}>
                                        <h1>
                                            Clientes
                                        </h1>
                                    </Col>
                                    <Col xs={6} md={4}>
                                        <Button
                                            className="btnRegistroVentas"
                                            title="Registrar un nuevo cliente"
                                            onClick={() => {
                                                rutaRegistro()
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faCirclePlus} /> Registrar
                                        </Button>
                                        <Button
                                            className="btnRegistroVentas"
                                            title="Regresar al menú catalogos"
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
                                listClientes ?
                                    (
                                        <>
                                            <Suspense fallback={<Spinner />}>
                                                <ListClientes
                                                    listClientes={listClientes}
                                                    location={location}
                                                    history={history}
                                                    setRefreshCheckLogin={setRefreshCheckLogin}
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
                        </>
                    )}
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
            sucursal: data.sucursal,
            rfc: data.rfc,
            telefonoCelular: data.telefonoCelular,
            count: data.count,
            diasCredito: data.diasCredito,
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
            domiciliosEntrega: data.domiciliosEntrega,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Clientes);
