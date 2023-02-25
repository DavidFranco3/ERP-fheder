import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { withRouter } from "../../utils/withRouter";
import { toast } from "react-toastify";
import ListCuentasClientes from "../../components/CuentasClientes/ListCuentasClientes";
import { listarCuentaCliente } from "../../api/cuentasCliente";
import "./CuentasClientes.scss"
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function CuentasClientes(props) {
    const { setRefreshCheckLogin, location, history } = props;

    const enrutamiento = useNavigate();

    // Para almacenar la lista de pedidos de venta
    const [listCuentas, setListCuentas] = useState(null);

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

    useEffect(() => {
        try {
            listarCuentaCliente(getSucursal()).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listCuentas && data) {
                    setListCuentas(formatModelCuentas(data));
                } else {
                    const datosCuentas = formatModelCuentas(data);
                    setListCuentas(datosCuentas);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);

    // Para ir hacia la ruta de registro del pedido de venta
    const rutaRegistroFacturas = () => {
        enrutamiento("/RegistroFacturas")
    }

    const rutaRegreso = () => {
        enrutamiento("/DashboardFinanzas")
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
                                            Cuentas por cobrar
                                        </h1>
                                    </Col>
                                    <Col xs={6} md={4}>
                                        <Button
                                            className="btnRegistroVentas"
                                            title="Regresar al menú finanzas"
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
                                listCuentas ?
                                    (
                                        <>
                                            <Suspense fallback={<Spinner />}>
                                                <ListCuentasClientes
                                                    listCuentas={listCuentas}
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

function formatModelCuentas(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            cliente: data.cliente,
            nombreCliente: data.nombreCliente,
            sucursal: data.sucursal,
            total: data.total,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(CuentasClientes);
