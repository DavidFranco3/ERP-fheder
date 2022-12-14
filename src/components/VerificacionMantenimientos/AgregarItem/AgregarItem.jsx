import { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Row, Container, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";

function AgregarItem(props) {
    const { setShowModal } = props;
    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const cancelarRegistro = () => {
        setShowModal(false);
    }

    // Define la ruta de registro
    const rutaRegistro = () => {
        enrutamiento.push("/RegistroVerificacionMantenimientos")
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    return (
        <>
            <Container fluid>
                <div className="formularioDatos">
                    <Form>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formGridFolioAG">
                                <Col sm="3">
                                    <Form.Label>
                                        Punto de revisión
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Punto de revisión"
                                        nombre="puntoRevision"
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formGridFolioAG">
                                <Col sm="3">
                                    <Form.Label>
                                        Status
                                    </Form.Label>
                                </Col>
                                <Col sm="4">
                                    <Form.Control
                                        type="text"
                                        placeholder="Status"
                                        nombre="status"
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formGridFolioAG">
                                <Col sm="3">
                                    <Form.Label>
                                        Observaciones
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Observaciones"
                                        nombre="observaciones"
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Form.Group as={Row} className="botones">
                            <Col>
                                <Button
                                    variant="success"
                                    title="Guardar el registro"
                                    className="registrar"
                                >
                                    {"Registrar"}
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    variant="danger"
                                    title="Cerrar el formulario"
                                    className="cancelar"
                                    onClick={() => {
                                        cancelarRegistro()
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </Col>
                        </Form.Group>
                    </Form>
                </div>
            </Container>
        </>
    );
}

export default AgregarItem;
