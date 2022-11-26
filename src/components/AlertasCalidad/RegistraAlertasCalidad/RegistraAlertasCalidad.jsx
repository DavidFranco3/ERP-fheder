import { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Row, Container, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import DropzoneFormularios from "../../DropzoneFormularios";

function RegistraAlertasCalidad(props) {

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Para almacenar la foto de perfil del usuario
    const [fotoUsuario, setFotoUsuario] = useState(null);

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento.push("/AlertasCalidad")
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

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
                            onClick={() => {
                                rutaRegreso()
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowCircleLeft} /> Regresar
                        </Button>
                    </Col>
                </Row>
            </Alert>

            <br />

            <Container fluid>
                <div className="formularioDatos">
                    <Form>
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
                                                name="descripcionPiezas"
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
                                                name="noConformidad"
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
                                                name="piezasCondicion"
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
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="2">
                                            <Form.Label>
                                                Listas de firmas
                                            </Form.Label>
                                        </Col>
                                        <Col sm="2">
                                            <Button
                                                variant="success"
                                                className="registrar"
                                            >
                                                Adjuntar archivo
                                            </Button>
                                        </Col>

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
                                                    <DropzoneFormularios
                                                        setImagen={setFotoUsuario}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="subeFotoPerfil">
                                                <div className="fotoPerfil">
                                                    <DropzoneFormularios
                                                        setImagen={setFotoUsuario}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="subeFotoPerfil">
                                                <div className="fotoPerfil">
                                                    <DropzoneFormularios
                                                        setImagen={setFotoUsuario}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="subeFotoPerfil">
                                                <div className="fotoPerfil">
                                                    <DropzoneFormularios
                                                        setImagen={setFotoUsuario}
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
                                                        setImagen={setFotoUsuario}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="subeFotoPerfil">
                                                <div className="fotoPerfil">
                                                    <DropzoneFormularios
                                                        setImagen={setFotoUsuario}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="subeFotoPerfil">
                                                <div className="fotoPerfil">
                                                    <DropzoneFormularios
                                                        setImagen={setFotoUsuario}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="subeFotoPerfil">
                                                <div className="fotoPerfil">
                                                    <DropzoneFormularios
                                                        setImagen={setFotoUsuario}
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
                                    variant="success"
                                    className="registrar"
                                >
                                    {"Registrar"}
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    variant="danger"
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

export default RegistraAlertasCalidad;
