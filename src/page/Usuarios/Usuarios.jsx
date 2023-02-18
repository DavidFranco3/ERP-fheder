import { useState, useEffect, Suspense } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faPlus, faUsers, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { withRouter } from "../../utils/withRouter";
import "./Usuarios.scss";
import { listarUsuarios } from "../../api/usuarios";
import { toast } from "react-toastify";
import ListUsuarios from "../../components/Usuarios/ListUsuarios";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function Usuarios(props) {
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
                setRefreshCheckLogin(true);
            }
        }
    }, []);
    // Termina cerrado de sesión automatico

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
    const [listUsuarios, setListUsuarios] = useState(null);

    useEffect(() => {
        try {
            listarUsuarios().then(response => {
                const { data } = response;

                //console.log(data);

                if (!listUsuarios && data) {
                    setListUsuarios(formatModelUsuarios(data));
                } else {
                    const datosUsurios = formatModelUsuarios(data);
                    setListUsuarios(datosUsurios);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);

    // Para controlar el acceso a la ruta de registro y de modificacion
    const registraColaborador = () => {
        enrutamiento("/RegistroUsuarios")
    }

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
                                            Usuarios
                                        </h1>
                                    </Col>
                                    <Col xs={6} md={4}>
                                        <Button
                                            className="btnRegistroVentas"
                                            title="Registrar un nuevo usuario"
                                            onClick={() => {
                                                registraColaborador()
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

                            {listUsuarios ?
                                (
                                    <>
                                        <Suspense fallback={<Spinner />}>
                                            <ListUsuarios
                                                listUsuarios={listUsuarios}
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

function formatModelUsuarios(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        const { direccion: { calle, numeroExterior, numeroInterior, colonia, municipio, estado, pais } } = data;
        dataTemp.push({
            id: data._id,
            nombre: data.nombre,
            apellidos: data.apellidos,
            curp: data.curp,
            nss: data.nss,
            rfc: data.rfc,
            telefonoCelular: data.telefonoCelular,
            telefonoFijo: data.telefonoFijo,
            calle: calle,
            numeroExterior: numeroExterior,
            numeroInterior: numeroInterior,
            colonia: colonia,
            municipio: municipio,
            estado: estado,
            pais: pais,
            departamento: data.departamento,
            correo: data.correo,
            password: data.password,
            foto: data.foto,
            estadoUsuario: data.estadoUsuario,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Usuarios);
