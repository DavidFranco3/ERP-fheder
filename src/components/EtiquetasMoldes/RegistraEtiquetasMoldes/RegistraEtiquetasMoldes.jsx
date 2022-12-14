import { useState, useEffect } from 'react';
import {Alert, Button, Col, Form, Row, Container, Spinner} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";

function RegistraEtiquetasMoldes(props) {
    const { setShowModal } = props;
    
     // Cancelar y cerrar el formulario
    const cancelarRegistro = () => {
        setShowModal(false)
    }
    
    // Para controlar la animacion
    const [loading, setLoading] = useState(false); 
    
    return (
        <>
                <Container fluid>
                    <div className="formularioDatos">
                        <Form>
                        
                        <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
                                        Id. Interno
                                    </Form.Label>
                                    </Col>
                                    <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Id. Interno"
                                        name="idInterno"
                                    />
                                    </Col>
                                </Form.Group>
                            </Row>
                            
                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
                                        No. Interno
                                    </Form.Label>
                                    </Col>
                                    <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Numero interno"
                                        name="numeroInterno"
                                    />
                                    </Col>
                                </Form.Group>
                            </Row>
                            
                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
                                        Cavidad
                                    </Form.Label>
                                    </Col>
                                    <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Cavidad"
                                        name="cavidad"
                                    />
                                    </Col>
                                </Form.Group>
                            </Row>
                            
                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
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
                                </Form.Group>
                            </Row>
                            
                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
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

export default RegistraEtiquetasMoldes;
