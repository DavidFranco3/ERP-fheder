import { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Row, Container, Image, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import DropzoneDeshabilitado from "../../DropzoneDeshabilitado";
import { toast } from "react-toastify";
import { getSucursal, getTokenApi, isExpiredToken, logoutApi } from "../../../api/auth";
import { actualizaAlertasCalidad, obtenerAlertasCalidad } from "../../../api/alertasCalidad";
import { LogsInformativos, LogsInformativosLogout } from "../../Logs/LogsSistema/LogsSistema";
import { subeArchivosCloudinary } from "../../../api/cloudinary";
import "./VistaPreviaAlertasCalidad.scss";
import LogoPDF from "../../../assets/png/pdf.png";
import Regreso from "../../../assets/png/back.png";

function VistaPreviaAlertasCalidad(props) {
    const { setRefreshCheckLogin } = props;

    const descargaPDF = async () => {
    }

    // Para definir el enrutamiento
    const enrutamiento = useNavigate();

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento("/AlertasCalidad")
    }

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

    const params = useParams();
    const { id } = params

    // Para guardar los datos del formulario
    const [formData, setFormData] = useState(initialFormDataInitial());

    useEffect(() => {
        //
        obtenerAlertasCalidad(id).then(response => {
            const { data } = response;
            //console.log(data)
            setFormData(initialFormData(data))
        }).catch(e => {
            console.log(e)
        })
    }, []);

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Detalles de alerta de calidad
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
                    <Form onChange={onChange}>
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
                                                        imagenBD={formData.imagenIncorrecta1}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="subeFotoPerfil">
                                                <div className="fotoPerfil">
                                                    <DropzoneDeshabilitado
                                                        imagenBD={formData.imagenIncorrecta2}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="subeFotoPerfil">
                                                <div className="fotoPerfil">
                                                    <DropzoneDeshabilitado
                                                        imagenBD={formData.imagenIncorrecta3}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="subeFotoPerfil">
                                                <div className="fotoPerfil">
                                                    <DropzoneDeshabilitado
                                                        imagenBD={formData.imagenIncorrecta4}
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
                                                        imagenBD={formData.imagenCorrecta1}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="subeFotoPerfil">
                                                <div className="fotoPerfil">
                                                    <DropzoneDeshabilitado
                                                        imagenBD={formData.imagenCorrecta2}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="subeFotoPerfil">
                                                <div className="fotoPerfil">
                                                    <DropzoneDeshabilitado
                                                        imagenBD={formData.imagenCorrecta3}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="subeFotoPerfil">
                                                <div className="fotoPerfil">
                                                    <DropzoneDeshabilitado
                                                        imagenBD={formData.imagenCorrecta4}
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
