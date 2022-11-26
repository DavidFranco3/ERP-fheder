import { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Row, Container, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";

function RegistraMes(props) {
    const { setShowModal } = props
    // Para definir el enrutamiento
    // Cancelar y cerrar el formulario
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    return (
        <>
            <div className="formularioDatos">
                <Form>
                    <Row ClassName="mb-3">
                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                                <Form.Label>
                                    #
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    type="number"
                                    placeholder="Folio"
                                    name="folio"
                                />
                            </Col>
                            <Col sm="2">
                                <Form.Label>
                                    Cantidad a fabricar
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    type="number"
                                    placeholder="Cantidad a fabricar"
                                    name="cantidadFabricar"
                                />
                            </Col>
                        </Form.Group>
                    </Row>

                    <br />



                    <Row ClassName="mb-3">
                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                                <Form.Label>
                                    OP
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    type="number"
                                    placeholder="OP"
                                    name="op"
                                />
                            </Col>
                            <Col sm="2">
                                <Form.Label>
                                    Acumulado
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    type="number"
                                    placeholder="Acumulado"
                                    name="acumulado"
                                />
                            </Col>
                        </Form.Group>
                    </Row>

                    <br />

                    <Row ClassName="mb-3">
                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                                <Form.Label>
                                    No. Int
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="No. Interno"
                                    name="noInterno"
                                />
                            </Col>
                            <Col sm="2">
                                <Form.Label>
                                    Pendiente
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    type="number"
                                    placeholder="Pendiente"
                                    name="pendiente"
                                />
                            </Col>
                        </Form.Group>
                    </Row>

                    <br />

                    <Row ClassName="mb-3">
                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                                <Form.Label>
                                    Cliente
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Cliente"
                                    name="cliente"
                                />
                            </Col>
                            <Col sm="2">
                                <Form.Label>
                                    Ciclo
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    type="number"
                                    placeholder="Ciclo"
                                    name="ciclo"
                                />
                            </Col>
                        </Form.Group>
                    </Row>

                    <br />

                    <Row ClassName="mb-3">
                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                                <Form.Label>
                                    Descripción
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Descripción"
                                    name="descripcion"
                                />
                            </Col>
                            <Col sm="2">
                                <Form.Label>
                                    Std x turno
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    type="number"
                                    placeholder="Std x turno"
                                    name="StdTurno"
                                />
                            </Col>
                        </Form.Group>
                    </Row>

                    <br />

                    <Row ClassName="mb-3">
                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                            </Col>
                            <Col>
                            </Col>
                            <Col sm="2">
                                <Form.Label>
                                    Turnos req.
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    type="number"
                                    placeholder="Turnos requeridos"
                                    name="turnosRequeridos"
                                />
                            </Col>
                        </Form.Group>
                    </Row>

                    <br />

                    <Row ClassName="mb-3">
                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                                <Form.Label>
                                    Fecha incial
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    type="date"
                                    placeholder="Fecha inicial"
                                    name="fchaInicial"
                                />
                            </Col>
                            <Col sm="2">
                                <Form.Label>
                                    Fecha final
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    type="date"
                                    placeholder="Fecha final"
                                    name="fechaFinal"
                                />
                            </Col>
                        </Form.Group>
                    </Row>

                    <Form.Group as={Row} className="botones">
                        <Col>
                            <Button
                                variant="success"
                                className="registrar"
                            >
                                Registrar
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                variant="danger"
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
        </>
    );
}

export default RegistraMes;
