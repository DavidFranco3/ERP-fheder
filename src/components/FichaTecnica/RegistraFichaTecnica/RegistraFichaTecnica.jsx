import { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Row, Container, Spinner, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import "./RegistraFichaTecnica.scss";

function RegistraFichaTecnica(props) {

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento.push("/FichaTecnica")
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Nueva ficha tecnica
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Regresar a la pagina anterior"
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
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label>
                                        Descripcion de material
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Descripcion de material"
                                        name="descripcionMaterial"
                                    />
                                </Col>

                                <Col sm="2">
                                    <Form.Label>
                                        Realizo
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Realizo"
                                        name="relizo"
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label>
                                        Fecha de elaboración
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="date"
                                        placeholder="Fecha"
                                        name="fecha"
                                    />
                                </Col>

                                <Col sm="2">
                                    <Form.Label>
                                        Autorizó
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Autorizó"
                                        name="autorizo"
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <br />

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">

                                <Col></Col>

                                <Col>
                                    <Form.Label>
                                        Item
                                    </Form.Label>
                                </Col>

                                <Col>
                                    <Form.Label>
                                        Propiedades
                                    </Form.Label>
                                </Col>


                                <Col>
                                    <Form.Label>
                                        Especificaciones
                                    </Form.Label>
                                </Col>

                                <Col>
                                    <Form.Label>
                                        Tolerancia
                                    </Form.Label>
                                </Col>

                                <Col>
                                    <Form.Label>
                                        Unidad
                                    </Form.Label>
                                </Col>

                                <Col>
                                    <Form.Label>
                                        Referencia
                                    </Form.Label>
                                </Col>

                                <Col></Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">

                                <Col></Col>

                                <Col>
                                    <Form.Control
                                        type="text"
                                        name="propiedad"
                                    />
                                </Col>

                                <Col>
                                    <Form.Control
                                        type="text"
                                        name="propiedad"
                                    />
                                </Col>


                                <Col>
                                    <Form.Control
                                        type="text"
                                        name="propiedad"
                                    />
                                </Col>

                                <Col>
                                    <Form.Control
                                        type="text"
                                        name="propiedad"
                                    />
                                </Col>

                                <Col>
                                    <Form.Control
                                        type="text"
                                        name="propiedad"
                                    />
                                </Col>

                                <Col>
                                    <Form.Control
                                        type="text"
                                        name="propiedad"
                                    />
                                </Col>

                                <Col>
                                    <Badge
                                        bg="success"
                                        className="agregarItem"
                                    >
                                        +
                                    </Badge>
                                </Col>
                            </Form.Group>
                        </Row>

                        <Form.Group as={Row} className="botones">
                            <Col>
                                <Button
                                    variant="success"
                                    title="Guardar la información del formulario"
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
                                        rutaRegreso()
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

export default RegistraFichaTecnica;
