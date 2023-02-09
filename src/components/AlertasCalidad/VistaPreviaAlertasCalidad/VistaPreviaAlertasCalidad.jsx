import { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Row, Container, Image, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory, useParams } from "react-router-dom";
import DropzoneDeshabilitado from "../../DropzoneDeshabilitado";
import { toast } from "react-toastify";
import { getSucursal, getTokenApi, isExpiredToken, logoutApi } from "../../../api/auth";
import { actualizaAlertasCalidad, obtenerAlertasCalidad } from "../../../api/alertasCalidad";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { subeArchivosCloudinary } from "../../../api/cloudinary";
import "./VistaPreviaAlertasCalidad.scss";
import LogoPDF from "../../../assets/png/pdf.png";
import Regreso from "../../../assets/png/back.png";

function VistaPreviaAlertasCalidad(props) {
    const { setRefreshCheckLogin } = props;

    const descargaPDF = async () => {
    }

    // Para definir el enrutamiento
    const enrutamiento = useHistory();

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

    const params = useParams();
    const { id } = params

    useEffect(() => {
        //
        obtenerAlertasCalidad(id).then(response => {
            const { data } = response;
            //console.log(data)
            setFormData(initialFormData(data))
            // setFechaCreacion(fechaElaboracion)
            setLinkCondicionCorrecta1(data.condicionCorrecta.imagen1);
            setLinkCondicionCorrecta2(data.condicionCorrecta.imagen2);
            setLinkCondicionCorrecta3(data.condicionCorrecta.imagen3);
            setLinkCondicionCorrecta4(data.condicionCorrecta.imagen4);

            setLinkCondicionIncorrecta1(data.condicionIncorrecta.imagen1);
            setLinkCondicionIncorrecta2(data.condicionIncorrecta.imagen2);
            setLinkCondicionIncorrecta3(data.condicionIncorrecta.imagen3);
            setLinkCondicionIncorrecta4(data.condicionIncorrecta.imagen4);

            setLinkListaFirmas(data.listaFirmas);
        }).catch(e => {
            console.log(e)
        })
    }, []);

    // Para almacenar la foto de perfil del usuario
    const [condicionCorrecta1, setCondicionCorrecta1] = useState(null);

    const [linkCondicionCorrecta1, setLinkCondicionCorrecta1] = useState("");

    useEffect(() => {
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
    }, [condicionCorrecta1]);

    const [condicionCorrecta2, setCondicionCorrecta2] = useState(null);

    const [linkCondicionCorrecta2, setLinkCondicionCorrecta2] = useState("");

    useEffect(() => {
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
    }, [condicionCorrecta2]);

    const [condicionCorrecta3, setCondicionCorrecta3] = useState(null);

    const [linkCondicionCorrecta3, setLinkCondicionCorrecta3] = useState("");

    useEffect(() => {
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
    }, [condicionCorrecta3]);

    const [condicionCorrecta4, setCondicionCorrecta4] = useState(null);

    const [linkCondicionCorrecta4, setLinkCondicionCorrecta4] = useState("");

    useEffect(() => {
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
    }, [condicionCorrecta4]);

    const [condicionIncorrecta1, setCondicionIncorrecta1] = useState(null);

    const [linkCondicionIncorrecta1, setLinkCondicionIncorrecta1] = useState("");

    useEffect(() => {
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
    }, [condicionIncorrecta1]);

    const [condicionIncorrecta2, setCondicionIncorrecta2] = useState(null);

    const [linkCondicionIncorrecta2, setLinkCondicionIncorrecta2] = useState("");

    useEffect(() => {
        try {
            if (condicionIncorrecta2) {
                subeArchivosCloudinary(condicionIncorrecta2, "alertasCalidad").then(response => {
                    const { data } = response;
                    // console.log(data)
                    const { secure_url } = data;
                    setLinkCondicionIncorrecta2(secure_url)
                }).catch(e => {
                    console.log(e)
                })
            }
        } catch (e) {
            console.log(e)

        }
    }, [condicionIncorrecta2]);

    const [condicionIncorrecta3, setCondicionIncorrecta3] = useState(null);

    const [linkCondicionIncorrecta3, setLinkCondicionIncorrecta3] = useState("");

    useEffect(() => {
        try {
            if (condicionIncorrecta3) {
                subeArchivosCloudinary(condicionIncorrecta3, "alertasCalidad").then(response => {
                    const { data } = response;
                    // console.log(data)
                    const { secure_url } = data;
                    setLinkCondicionIncorrecta3(secure_url)
                }).catch(e => {
                    console.log(e)
                })
            }
        } catch (e) {
            console.log(e)

        }
    }, [condicionIncorrecta3]);

    const [condicionIncorrecta4, setCondicionIncorrecta4] = useState(null);

    const [linkCondicionIncorrecta4, setLinkCondicionIncorrecta4] = useState("");

    useEffect(() => {
        try {
            if (condicionIncorrecta4) {
                subeArchivosCloudinary(condicionIncorrecta4, "alertasCalidad").then(response => {
                    const { data } = response;
                    // console.log(data)
                    const { secure_url } = data;
                    setLinkCondicionIncorrecta4(secure_url)
                }).catch(e => {
                    console.log(e)
                })
            }
        } catch (e) {
            console.log(e)

        }
    }, [condicionIncorrecta4]);

    const [listaFirmas, setListaFirmas] = useState(null);

    const [linkListaFirmas, setLinkListaFirmas] = useState("");

    useEffect(() => {
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
    }, [listaFirmas]);

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento.push("/AlertasCalidad")
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    // Para guardar los datos del formulario
    const [formData, setFormData] = useState(initialFormDataInitial());

    const onSubmit = e => {
        e.preventDefault();
        console.log(e)

        if (!formData.cliente || !formData.descripcionPieza || !formData.descripcionNoConformidad || !formData.cantidadPiezasCondicion || !formData.referencia || !formData.accionContencion || !formData.accionCorrectiva || !formData.autorizo || !formData.elaboro || !formData.observaciones || !formData.referenciaNoConformidad) {
            toast.warning("Completa el formulario");
        } else {
            //console.log("Continuar")
            setLoading(true);

            const dataTemp = {
                fecha: formData.fecha,
                cliente: formData.cliente,
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
            }
            // console.log(dataTemp)

            // Modificar el pedido creado recientemente
            actualizaAlertasCalidad(id, dataTemp).then(response => {
                const { data: { mensaje, datos } } = response;
                // console.log(response)
                toast.success(mensaje)
                // Log acerca del registro inicial del tracking
                LogsInformativos("Se han registrado la alerta de calidad con folio " + formData.folio, dataTemp)
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
                                                defaultValue={formData.fecha}
                                                disabled
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
                                                disabled
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
                                                disabled
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
                                                disabled
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
                                                disabled
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
                                                disabled
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
                                                disabled
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
                                                disabled
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
                                                disabled
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
                                                disabled
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
                                                disabled
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
                                                disabled
                                            />
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
                                        Condición incorrecta
                                    </h4>
                                </div>
                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">

                                        <Col>
                                            <div className="subeFotoPerfil">
                                                <div className="fotoPerfil">
                                                    <DropzoneDeshabilitado
                                                        setImagen={setCondicionIncorrecta1} imagenBD={formData.imagenIncorrecta1}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="subeFotoPerfil">
                                                <div className="fotoPerfil">
                                                    <DropzoneDeshabilitado
                                                        setImagen={setCondicionIncorrecta2} imagenBD={formData.imagenIncorrecta2}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="subeFotoPerfil">
                                                <div className="fotoPerfil">
                                                    <DropzoneDeshabilitado
                                                        setImagen={setCondicionIncorrecta3} imagenBD={formData.imagenIncorrecta3}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="subeFotoPerfil">
                                                <div className="fotoPerfil">
                                                    <DropzoneDeshabilitado
                                                        setImagen={setCondicionIncorrecta4} imagenBD={formData.imagenIncorrecta4}
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
                                                    <DropzoneDeshabilitado
                                                        setImagen={setCondicionCorrecta1} imagenBD={formData.imagenCorrecta1}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="subeFotoPerfil">
                                                <div className="fotoPerfil">
                                                    <DropzoneDeshabilitado
                                                        setImagen={setCondicionCorrecta2} imagenBD={formData.imagenCorrecta2}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="subeFotoPerfil">
                                                <div className="fotoPerfil">
                                                    <DropzoneDeshabilitado
                                                        setImagen={setCondicionCorrecta3} imagenBD={formData.imagenCorrecta3}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="subeFotoPerfil">
                                                <div className="fotoPerfil">
                                                    <DropzoneDeshabilitado
                                                        setImagen={setCondicionCorrecta4} imagenBD={formData.imagenCorrecta4}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                    </Form.Group>
                                </Row>
                            </Container>
                        </div>

                        <br />

                        <div className="botones">
                            <Form.Group as={Row} className="botones">
                                <Row>
                                    <Col>
                                        <div
                                            className="generacionPDF"
                                        >
                                            <Image
                                                src={LogoPDF}
                                                className="logoPDF"
                                                onClick={() => {
                                                    descargaPDF()
                                                }}
                                            />
                                        </div>
                                    </Col>
                                    <Col>
                                        <div
                                            className="regreso"
                                        >
                                            <Image
                                                src={Regreso}
                                                className="regresarVistaAnterior"
                                                onClick={() => {
                                                    rutaRegreso()
                                                }}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </div>
                        <br />
                    </Form>
                </div>
            </Container>
        </>
    );
}

function initialFormDataInitial() {
    return {
        folio: "",
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
        referenciaNoConformidad: "",

        imagenCorrecta1: "",
        imagenCorrecta2: "",
        imagenCorrecta3: "",
        imagenCorrecta4: "",

        imagenIncorrecta1: "",
        imagenIncorrecta2: "",
        imagenIncorrecta3: "",
        imagenIncorrecta4: "",

        listaFirmas: "",
    }
}

function initialFormData(data) {
    return {
        folio: data.folio,
        fecha: data.fecha,
        cliente: data.cliente,
        descripcionPieza: data.descripcionPieza,
        descripcionNoConformidad: data.descripcionNoConformidad,
        cantidadPiezasCondicion: data.cantidadPiezasCondicion,
        referencia: data.referencia,
        accionContencion: data.accionContencion,
        accionCorrectiva: data.accionCorrectiva,
        autorizo: data.autorizo,
        elaboro: data.elaboro,
        observaciones: data.observaciones,
        referenciaNoConformidad: data.referenciaNoConformidad,

        imagenCorrecta1: data.condicionCorrecta.imagen1,
        imagenCorrecta2: data.condicionCorrecta.imagen2,
        imagenCorrecta3: data.condicionCorrecta.imagen3,
        imagenCorrecta4: data.condicionCorrecta.imagen4,

        imagenIncorrecta1: data.condicionIncorrecta.imagen1,
        imagenIncorrecta2: data.condicionIncorrecta.imagen2,
        imagenIncorrecta3: data.condicionIncorrecta.imagen3,
        imagenIncorrecta4: data.condicionIncorrecta.imagen4,

        listaFirmas: data.listaFirmas,
    }
}

export default VistaPreviaAlertasCalidad;
