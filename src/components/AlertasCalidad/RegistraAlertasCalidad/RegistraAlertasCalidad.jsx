import { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Row, Container, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import DropzoneFormularios from "../../DropzoneFormularios";
import { toast } from "react-toastify";
import { getSucursal, getTokenApi, isExpiredToken, logoutApi } from "../../../api/auth";
import { registraAlertaCalidad, obtenerNoAlerta, obtenerItemAlertasCalidad } from "../../../api/alertasCalidad";
import { LogsInformativos, LogsInformativosLogout } from "../../Logs/LogsSistema/LogsSistema";
import { subeArchivosCloudinary } from "../../../api/cloudinary";

function RegistraAlertasCalidad(props) {
    const { setRefreshCheckLogin } = props;
    // Para definir el enrutamiento
    const enrutamiento = useNavigate();

    const cierreAutomatico = () => {
        if (getTokenApi()) {
            if (isExpiredToken(getTokenApi())) {
                LogsInformativosLogout("Sesión finalizada", setRefreshCheckLogin)
                toast.warning("Sesión expirada");
                toast.success("Sesión cerrada por seguridad");
                logoutApi();
                setRefreshCheckLogin(true);
            }
        }
    }

    // Cerrado de sesión automatico
    useEffect(() => {
        cierreAutomatico();
    }, []);
    // Termina cerrado de sesión automatico

    // Para almacenar la foto de perfil del usuario
    const [condicionCorrecta1, setCondicionCorrecta1] = useState(null);

    const [linkCondicionCorrecta1, setLinkCondicionCorrecta1] = useState("");

    const obtenerCondicionCorrecta1 = () => {
        try {
            if (condicionCorrecta1) {
                subeArchivosCloudinary(condicionCorrecta1, "alertasCalidad").then(response => {
                    const { data } = response;
                    // console.log(data)
                    const { secure_url } = data;
                    setLinkCondicionCorrecta1(secure_url)
                }).catch(e => {
                    console.log(e)
                })
            }
        } catch (e) {
            console.log(e)

        }
    }

    useEffect(() => {
        obtenerCondicionCorrecta1();
    }, [condicionCorrecta1]);

    const [condicionCorrecta2, setCondicionCorrecta2] = useState(null);

    const [linkCondicionCorrecta2, setLinkCondicionCorrecta2] = useState("");

    const obtenerCondicionCorrecta2 = () => {
        try {
            if (condicionCorrecta2) {
                subeArchivosCloudinary(condicionCorrecta2, "alertasCalidad").then(response => {
                    const { data } = response;
                    // console.log(data)
                    const { secure_url } = data;
                    setLinkCondicionCorrecta2(secure_url)
                }).catch(e => {
                    console.log(e)
                })
            }
        } catch (e) {
            console.log(e)

        }
    }

    useEffect(() => {
        obtenerCondicionCorrecta2();
    }, [condicionCorrecta2]);

    const [condicionCorrecta3, setCondicionCorrecta3] = useState(null);

    const [linkCondicionCorrecta3, setLinkCondicionCorrecta3] = useState("");

    const obtenerCondicionCorrecta3 = () => {
        try {
            if (condicionCorrecta3) {
                subeArchivosCloudinary(condicionCorrecta3, "alertasCalidad").then(response => {
                    const { data } = response;
                    // console.log(data)
                    const { secure_url } = data;
                    setLinkCondicionCorrecta3(secure_url)
                }).catch(e => {
                    console.log(e)
                })
            }
        } catch (e) {
            console.log(e)

        }
    }

    useEffect(() => {
        obtenerCondicionCorrecta3();
    }, [condicionCorrecta3]);

    const [condicionCorrecta4, setCondicionCorrecta4] = useState(null);

    const [linkCondicionCorrecta4, setLinkCondicionCorrecta4] = useState("");

    const obtenerCondicionCorrecta4 = () => {
        try {
            if (condicionCorrecta4) {
                subeArchivosCloudinary(condicionCorrecta4, "alertasCalidad").then(response => {
                    const { data } = response;
                    // console.log(data)
                    const { secure_url } = data;
                    setLinkCondicionCorrecta4(secure_url)
                }).catch(e => {
                    console.log(e)
                })
            }
        } catch (e) {
            console.log(e)

        }
    }

    useEffect(() => {
        obtenerCondicionCorrecta4();
    }, [condicionCorrecta4]);

    const [condicionIncorrecta1, setCondicionIncorrecta1] = useState(null);

    const [linkCondicionIncorrecta1, setLinkCondicionIncorrecta1] = useState("");

    const obtenerCondicionIncorrecta1 = () => {
        try {
            if (condicionIncorrecta1) {
                subeArchivosCloudinary(condicionIncorrecta1, "alertasCalidad").then(response => {
                    const { data } = response;
                    // console.log(data)
                    const { secure_url } = data;
                    setLinkCondicionIncorrecta1(secure_url)
                }).catch(e => {
                    console.log(e)
                })
            }
        } catch (e) {
            console.log(e)

        }
    }

    useEffect(() => {
        obtenerCondicionIncorrecta1();
    }, [condicionIncorrecta1]);

    const [condicionIncorrecta2, setCondicionIncorrecta2] = useState(null);

    const [linkCondicionIncorrecta2, setLinkCondicionIncorrecta2] = useState("");

    const obtenerCondicionIncorrecta2 = () => {
        try {
            if (condicionIncorrecta2) {
                subeArchivosCloudinary(condicionIncorrecta2, "alertasCalidad").then(response => {
                    const { data } = response;
                    // console.log(data)
                    const { secure_url } = data;
                    setLinkCondicionIncorrecta1(secure_url)
                }).catch(e => {
                    console.log(e)
                })
            }
        } catch (e) {
            console.log(e)

        }
    }

    useEffect(() => {
        obtenerCondicionIncorrecta2();
    }, [condicionIncorrecta2]);

    const [condicionIncorrecta3, setCondicionIncorrecta3] = useState(null);

    const [linkCondicionIncorrecta3, setLinkCondicionIncorrecta3] = useState("");

    const obtenerCondicionIncorrecta3 = () => {
        try {
            if (condicionIncorrecta3) {
                subeArchivosCloudinary(condicionIncorrecta3, "alertasCalidad").then(response => {
                    const { data } = response;
                    // console.log(data)
                    const { secure_url } = data;
                    setLinkCondicionIncorrecta1(secure_url)
                }).catch(e => {
                    console.log(e)
                })
            }
        } catch (e) {
            console.log(e)

        }
    }

    useEffect(() => {
        obtenerCondicionIncorrecta3();
    }, [condicionIncorrecta3]);

    const [condicionIncorrecta4, setCondicionIncorrecta4] = useState(null);

    const [linkCondicionIncorrecta4, setLinkCondicionIncorrecta4] = useState("");

    const obtenerCondicionIncorrecta4 = () => {
        try {
            if (condicionIncorrecta4) {
                subeArchivosCloudinary(condicionIncorrecta4, "alertasCalidad").then(response => {
                    const { data } = response;
                    // console.log(data)
                    const { secure_url } = data;
                    setLinkCondicionIncorrecta1(secure_url)
                }).catch(e => {
                    console.log(e)
                })
            }
        } catch (e) {
            console.log(e)

        }
    }

    useEffect(() => {
        obtenerCondicionIncorrecta4();
    }, [condicionIncorrecta4]);

    const [listaFirmas, setListaFirmas] = useState(null);

    const [linkListaFirmas, setLinkListaFirmas] = useState("");

    const obtenerListaFirmas = () => {
        try {
            if (listaFirmas) {
                subeArchivosCloudinary(listaFirmas, "alertasCalidad").then(response => {
                    const { data } = response;
                    // console.log(data)
                    const { secure_url } = data;
                    setLinkListaFirmas(secure_url)
                }).catch(e => {
                    console.log(e)
                })
            }
        } catch (e) {
            console.log(e)

        }
    }

    useEffect(() => {
        obtenerListaFirmas();
    }, [listaFirmas]);

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento("/AlertasCalidad")
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    // Para guardar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para almacenar el folio actual
    const [folioActual, setFolioActual] = useState("");

    const obtenerFolio = () => {
        try {
            obtenerNoAlerta().then(response => {
                const { data } = response;
                // console.log(data)
                const { noAlerta } = data;
                setFolioActual(noAlerta)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
       obtenerFolio();
    }, []);

    // Para almacenar el folio actual
    const [itemActual, setItemActual] = useState("");

    const obtenerItem = () => {
        try {
            obtenerItemAlertasCalidad().then(response => {
                const { data } = response;
                // console.log(data)
                const { item } = data;
                setItemActual(item)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        obtenerItem();
    }, []);

    const onSubmit = e => {
        e.preventDefault();
        console.log(e)

        if (!formData.cliente || !formData.descripcionPieza || !formData.descripcionNoConformidad || !formData.cantidadPiezasCondicion || !formData.referencia || !formData.accionContencion || !formData.accionCorrectiva || !formData.autorizo || !formData.elaboro || !formData.observaciones || !formData.referenciaNoConformidad) {
            toast.warning("Completa el formulario");
        } else {
            //console.log("Continuar")
            setLoading(true);

            const dataTemp = {
                item: itemActual,
                folio: folioActual,
                fecha: fechaActual,
                cliente: formData.cliente,
                sucursal: getSucursal(),
                descripcionPieza: formData.descripcionPieza,
                descripcionNoConformidad: formData.descripcionNoConformidad,
                cantidadPiezasCondicion: formData.cantidadPiezasCondicion,
                referencia: formData.referencia,
                accionContencion: formData.accionContencion,
                accionCorrectiva: formData.accionCorrectiva,
                autorizo: formData.autorizo,
                elaboro: formData.elaboro,
                observaciones: formData.observaciones,
                listaFirmas: linkListaFirmas,
                referenciaNoConformidad: formData.referenciaNoConformidad,
                condicionIncorrecta: {
                    imagen1: linkCondicionIncorrecta1,
                    imagen2: linkCondicionIncorrecta2,
                    imagen3: linkCondicionIncorrecta3,
                    imagen4: linkCondicionIncorrecta4,
                },
                condicionCorrecta: {
                    imagen1: linkCondicionCorrecta1,
                    imagen2: linkCondicionCorrecta2,
                    imagen3: linkCondicionCorrecta3,
                    imagen4: linkCondicionCorrecta4,
                },
                estado: "true"
            }
            // console.log(dataTemp)

            // Modificar el pedido creado recientemente
            registraAlertaCalidad(dataTemp).then(response => {
                const { data: { mensaje, datos } } = response;
                // console.log(response)
                toast.success(mensaje)
                // Log acerca del registro inicial del tracking
                LogsInformativos("Se han registrado la alerta de calidad con folio " + folioActual, dataTemp)
                // Registro inicial del tracking
                rutaRegreso();
            }).catch(e => {
                console.log(e)
            })
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const hoy = new Date();
    // const fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear() + " " + hora;
    const fecha = (hoy.getMonth() + 1) > 9 && hoy.getDate() < 10 ? hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + "0" + hoy.getDate()
        : (hoy.getMonth() + 1) < 10 && hoy.getDate() > 9 ? hoy.getFullYear() + '-' + "0" + (hoy.getMonth() + 1) + '-' + hoy.getDate()
            : (hoy.getMonth() + 1) < 10 && hoy.getDate() < 10 ? hoy.getFullYear() + '-' + "0" + (hoy.getMonth() + 1) + '-' + "0" + hoy.getDate()
                : hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate();

    const [fechaActual, setFechaActual] = useState(fecha);

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Nueva alerta de calidad
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Regresar al menú calidad"
                            onClick={() => {
                                rutaRegreso()
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowCircleLeft} /> Regresar
                        </Button>
                    </Col>
                </Row>
            </Alert>

            <Container fluid>
                <br />
                <div className="formularioDatos">
                    <Form onChange={onChange} onSubmit={onSubmit}>
                        <div className="encabezado">
                            <Container fluid>
                                <br />
                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label>
                                                Fecha
                                            </Form.Label>
                                        </Col>
                                        <Col sm="3">
                                            <Form.Control
                                                type="date"
                                                placeholder="Fecha"
                                                name="fecha"
                                                value={fechaActual}
                                                onChange={e => setFechaActual(e.target.value)}
                                            />
                                        </Col>

                                        <Col sm="1">
                                            <Form.Label>
                                                Cliente
                                            </Form.Label>
                                        </Col>
                                        <Col sm="3">
                                            <Form.Control
                                                type="text"
                                                placeholder="Cliente"
                                                name="cliente"
                                                defaultValue={formData.cliente}
                                            />
                                        </Col>

                                        <Col sm="1">
                                            <Form.Label>
                                                Descripción de pieza
                                            </Form.Label>
                                        </Col>
                                        <Col sm="3">
                                            <Form.Control
                                                type="text"
                                                placeholder="descripcion de piezas"
                                                name="descripcionPieza"
                                                defaultValue={formData.descripcionPieza}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="2">
                                            <Form.Label>
                                                Descripción de No Conformidad
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="No conformidad"
                                                name="descripcionNoConformidad"
                                                defaultValue={formData.descripcionNoConformidad}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="2">
                                            <Form.Label>
                                                Cantidad de piezas con esta condición
                                            </Form.Label>
                                        </Col>
                                        <Col sm="5">
                                            <Form.Control
                                                type="text"
                                                placeholder="Cantidad de piezas con esta condición"
                                                name="cantidadPiezasCondicion"
                                                defaultValue={formData.cantidadPiezasCondicion}
                                            />
                                        </Col>

                                        <Col sm="1">
                                            <Form.Label>
                                                Referencia
                                            </Form.Label>
                                        </Col>
                                        <Col sm="4">
                                            <Form.Control
                                                type="text"
                                                placeholder="Referencia"
                                                name="referencia"
                                                defaultValue={formData.referencia}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="2">
                                            <Form.Label>
                                                Acción de contención
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Acción de contención"
                                                name="accionContencion"
                                                defaultValue={formData.accionContencion}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="2">
                                            <Form.Label>
                                                Acción correctiva
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Acción correctiva"
                                                name="accionCorrectiva"
                                                defaultValue={formData.accionCorrectiva}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="2">
                                            <Form.Label>
                                                Autorizó
                                            </Form.Label>
                                        </Col>
                                        <Col sm="4">
                                            <Form.Control
                                                type="text"
                                                placeholder="Autorizó"
                                                name="autorizo"
                                                defaultValue={formData.autorizo}
                                            />
                                        </Col>

                                        <Col sm="1">
                                            <Form.Label>
                                                Elaboró
                                            </Form.Label>
                                        </Col>
                                        <Col sm="5">
                                            <Form.Control
                                                type="text"
                                                placeholder="Elaboró"
                                                name="elaboro"
                                                defaultValue={formData.elaboro}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="2">
                                            <Form.Label>
                                                Observaciones
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Observaciones"
                                                name="observaciones"
                                                defaultValue={formData.observaciones}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="3">
                                            <Form.Label>
                                                Referencia no conformidad
                                            </Form.Label>
                                        </Col>
                                        <Col sm="4">
                                            <Form.Control
                                                type="text"
                                                placeholder="Referencia no conformidad"
                                                name="referenciaNoConformidad"
                                                defaultValue={formData.referenciaNoConformidad}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <br />
                                <div className="subeOrdenVenta">
                                    <h4>Lista de firmas</h4>
                                    <div className="ordenVenta">
                                        <DropzoneFormularios
                                            setImagen={setListaFirmas}
                                        />
                                    </div>
                                </div>

                            </Container>
                        </div>

                        <br />

                        <div className="datosHerramientas">
                            <Container fluid>
                                <br />
                                <div className="tituloSeccion">
                                    <h4>
                                        Condición incorrecta
                                    </h4>
                                </div>
                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">

                                        <Col>
                                            <div className="subeFotoPerfil">
                                                <div className="fotoPerfil">
                                                    <DropzoneFormularios
                                                        setImagen={setCondicionIncorrecta1}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="subeFotoPerfil">
                                                <div className="fotoPerfil">
                                                    <DropzoneFormularios
                                                        setImagen={setCondicionIncorrecta2}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="subeFotoPerfil">
                                                <div className="fotoPerfil">
                                                    <DropzoneFormularios
                                                        setImagen={setCondicionIncorrecta3}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="subeFotoPerfil">
                                                <div className="fotoPerfil">
                                                    <DropzoneFormularios
                                                        setImagen={setCondicionIncorrecta4}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                    </Form.Group>
                                </Row>
                            </Container>
                        </div>

                        <br />

                        <div className="datosHerramientas">
                            <Container fluid>
                                <br />
                                <div className="tituloSeccion">
                                    <h4>
                                        Condición correcta
                                    </h4>
                                </div>
                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">

                                        <Col>
                                            <div className="subeFotoPerfil">
                                                <div className="fotoPerfil">
                                                    <DropzoneFormularios
                                                        setImagen={setCondicionCorrecta1}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="subeFotoPerfil">
                                                <div className="fotoPerfil">
                                                    <DropzoneFormularios
                                                        setImagen={setCondicionCorrecta2}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="subeFotoPerfil">
                                                <div className="fotoPerfil">
                                                    <DropzoneFormularios
                                                        setImagen={setCondicionCorrecta3}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="subeFotoPerfil">
                                                <div className="fotoPerfil">
                                                    <DropzoneFormularios
                                                        setImagen={setCondicionCorrecta4}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                    </Form.Group>
                                </Row>
                            </Container>
                        </div>

                        <Form.Group as={Row} className="botones">
                            <Col>
                                <Button
                                    type="submit"
                                    variant="success"
                                    title="Guardar información del formulario"
                                    className="registrar"
                                >
                                    {!loading ? "Registrar" : <Spinner animation="border" />}
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    variant="danger"
                                    title="Cerrar el formulario"
                                    className="cancelar"
                                    onClick={() => {
                                        rutaRegreso()
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </Col>
                        </Form.Group>
                        <br />
                    </Form>
                </div>
            </Container>
        </>
    );
}

function initialFormData() {
    return {
        fecha: "",
        cliente: "",
        descripcionPieza: "",
        descripcionNoConformidad: "",
        cantidadPiezasCondicion: "",
        referencia: "",
        accionContencion: "",
        accionCorrectiva: "",
        autorizo: "",
        elaboro: "",
        observaciones: "",
        referenciaNoConformidad: ""
    }
}

export default RegistraAlertasCalidad;
