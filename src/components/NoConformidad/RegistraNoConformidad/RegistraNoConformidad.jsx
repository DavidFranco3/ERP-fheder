import { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Row, Container, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import DropzoneFormularios from "../../DropzoneFormularios";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { toast } from "react-toastify";
import { registraNoConformidad, obtenerItemNoConformidad, obtenerNumeroNoConformidad } from "../../../api/noConformidad";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { subeArchivosCloudinary } from "../../../api/cloudinary";

function RegistraReporte(props) {
    const { setRefreshCheckLogin } = props;

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

    // Para guardar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para almacenar la foto de perfil del usuario
    const [diagrama, setDiagrama] = useState(null);

    const [linkDiagrama, setLinkDiagrama] = useState("");

    useEffect(() => {
        try {
            if (diagrama) {
                subeArchivosCloudinary(diagrama, "noConformidad").then(response => {
                    const { data } = response;
                    // console.log(data)
                    const { secure_url } = data;
                    setLinkDiagrama(secure_url)
                }).catch(e => {
                    console.log(e)
                })
            }
        } catch (e) {
            console.log(e)

        }
    }, [diagrama]);

    // Para almacenar la foto de perfil del usuario
    const [evidencia1, setEvidencia1] = useState(null);

    const [linkEvidencia1, setLinkEvidencia1] = useState("");

    useEffect(() => {
        try {
            if (evidencia1) {
                subeArchivosCloudinary(evidencia1, "noConformidad").then(response => {
                    const { data } = response;
                    // console.log(data)
                    const { secure_url } = data;
                    setLinkEvidencia1(secure_url)
                }).catch(e => {
                    console.log(e)
                })
            }
        } catch (e) {
            console.log(e)

        }
    }, [evidencia1]);

    const [evidencia2, setEvidencia2] = useState(null);

    const [linkEvidencia2, setLinkEvidencia2] = useState("");

    useEffect(() => {
        try {
            if (evidencia2) {
                subeArchivosCloudinary(evidencia2, "noConformidad").then(response => {
                    const { data } = response;
                    // console.log(data)
                    const { secure_url } = data;
                    setLinkEvidencia2(secure_url)
                }).catch(e => {
                    console.log(e)
                })
            }
        } catch (e) {
            console.log(e)

        }
    }, [evidencia2]);

    const [evidencia3, setEvidencia3] = useState(null);

    const [linkEvidencia3, setLinkEvidencia3] = useState("");

    useEffect(() => {
        try {
            if (evidencia3) {
                subeArchivosCloudinary(evidencia3, "noConformidad").then(response => {
                    const { data } = response;
                    // console.log(data)
                    const { secure_url } = data;
                    setLinkEvidencia3(secure_url)
                }).catch(e => {
                    console.log(e)
                })
            }
        } catch (e) {
            console.log(e)
        }
    }, [evidencia3]);

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento.push("/NoConformidad")
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    // Para almacenar el folio actual
    const [folioActual, setFolioActual] = useState("");

    useEffect(() => {
        try {
            obtenerNumeroNoConformidad().then(response => {
                const { data } = response;
                // console.log(data)
                const { noControl } = data;
                setFolioActual(noControl)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    // Para almacenar el folio actual
    const [itemActual, setItemActual] = useState("");

    useEffect(() => {
        try {
            obtenerItemNoConformidad().then(response => {
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
    }, []);

    const onSubmit = e => {
        e.preventDefault();
        console.log(e)

        if (!formData.descripcionNoConformidad || !formData.correccion || !formData.analisisCausaRaiz || !formData.causaRaiz || !formData.accionCorrectiva || !formData.status || !formData.responsables || !formData.statusFinal) {
            toast.warning("Completa el formulario");
        } else {
            //console.log("Continuar")
            setLoading(true);

            const dataTemp = {
                item: itemActual,
                folio: folioActual,
                descripcionNoConformidad: formData.descripcionNoConformidad,
                correccion: formData.correccion,
                analisisCausaRaiz: formData.analisisCausaRaiz,
                diagrama: linkDiagrama,
                causaRaiz: formData.causaRaiz,
                accionCorrectiva: formData.accionCorrectiva,
                fecha: fechaActual,
                status: formData.status,
                responsables: formData.responsables,
                fechaCierre: fechaCierre,
                statusFinal: formData.statusFinal,
                sucursal: getSucursal(),
                evidencia: {
                    imagen1: linkEvidencia1,
                    imagen2: linkEvidencia2,
                    imagen3: linkEvidencia3,
                },
                estado: "true"
            }
            // console.log(dataTemp)

            // Modificar el pedido creado recientemente
            registraNoConformidad(dataTemp).then(response => {
                const { data: { mensaje, datos } } = response;
                // console.log(response)
                toast.success(mensaje)
                // Log acerca del registro inicial del tracking
                LogsInformativos("Se han registrado la no conformidad con folio " + folioActual, dataTemp)
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

    const [fechaCierre, setFechaCierre] = useState(fecha);

    console.log(formData);

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Nueva No Conformidad
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
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
                                        No Conformidad Descripción
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Descripción"
                                        name="descripcionNoConformidad"
                                        defaultValue={formData.descripcionNoConformidad}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
                                        ¿Requiere corrección? Corrección
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Corrección"
                                        name="correccion"
                                        defaultValue={formData.correccion}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
                                        Analisis de cauda raíz (Metodo Ishikawa)
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Analisis de cauza raiz"
                                        name="analisisCausaRaiz"
                                        defaultValue={formData.analisisCausaRaiz}
                                    />
                                </Col>

                                <br />
                                <div className="subeOrdenVenta">
                                    <h4>Adjuntar diagrama</h4>
                                    <div className="ordenVenta">
                                        <DropzoneFormularios
                                            setImagen={setDiagrama}
                                        />
                                    </div>
                                </div>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label align="center">
                                        Cauza raiz
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Causa raiz"
                                        name="causaRaiz"
                                        defaultValue={formData.causaRaiz}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label align="center">
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
                                    <Form.Label align="center">
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
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label align="center">
                                        Status
                                    </Form.Label>
                                </Col>
                                <Col sm="3">
                                    <Form.Control
                                        type="text"
                                        placeholder="Status"
                                        name="status"
                                        defaultValue={formData.status}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label align="center">
                                        Responsables
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Responsables"
                                        name="responsables"
                                        defaultValue={formData.responsables}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label align="center">
                                        Fecha de cierre
                                    </Form.Label>
                                </Col>
                                <Col sm="3">
                                    <Form.Control
                                        type="date"
                                        placeholder="Fecha de cierre"
                                        name="fechaCierre"
                                        value={fechaCierre}
                                        onChange={e => setFechaCierre(e.target.value)}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label align="center">
                                        Status Final
                                    </Form.Label>
                                </Col>
                                <Col sm="3">
                                    <Form.Control
                                        type="text"
                                        placeholder="Satus"
                                        name="statusFinal"
                                        defaultValue={formData.statusFinal}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label align="center">
                                        Evidencia
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <div className="subeFotoPerfil">
                                        <div className="fotoPerfil">
                                            <DropzoneFormularios
                                                setImagen={setEvidencia1}
                                            />
                                        </div>
                                    </div>
                                </Col>
                                <Col>
                                    <div className="subeFotoPerfil">
                                        <div className="fotoPerfil">
                                            <DropzoneFormularios
                                                setImagen={setEvidencia2}
                                            />
                                        </div>
                                    </div>
                                </Col>
                                <Col>
                                    <div className="subeFotoPerfil">
                                        <div className="fotoPerfil">
                                            <DropzoneFormularios
                                                setImagen={setEvidencia3}
                                            />
                                        </div>
                                    </div>
                                </Col>
                            </Form.Group>
                        </Row>

                        <Form.Group as={Row} className="botones">
                            <Col>
                                <Button
                                    type="submit"
                                    variant="success"
                                    title="Guardar la información del formulario"
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

                            <br />

                        </Form.Group>
                    </Form>
                </div>
            </Container>
        </>
    );
}

function initialFormData() {
    return {
        descripcionNoConformidad: "",
        correccion: "",
        analisisCausaRaiz: "",
        causaRaiz: "",
        accionCorrectiva: "",
        status: "",
        responsables: "",
        statusFinal: "",
    }
}

export default RegistraReporte;
