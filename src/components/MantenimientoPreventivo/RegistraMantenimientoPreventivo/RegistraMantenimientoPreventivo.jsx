import { useState, useEffect } from 'react';
import {Alert, Button, Col, Form, Row, Container, Spinner} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";

function RegistraMantenimientoPreventivo(props) {
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
                        
                        <div className="encabezado">
                                <Container fluid>
                                <br/>
                        <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
                                        Ident
                                    </Form.Label>
                                    </Col>
                                    <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Identificador"
                                        name="ident"
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
                            </Container>
                                </div>
                            <br/>
                            
                            <div className="materiaPrima">
                                <Container fluid>
                                <br/>
                                    <div className="tituloSeccion">
                                        <h4>
                                            Fechas programadas de mantenimiento
                                        </h4>
                                    </div>
                            
                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label align="center">
                                        Semana 1
                                    </Form.Label>
                                    </Col>
                                    <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Semana 1"
                                        name="semana1"
                                    />
                                    </Col>
                                    <Col sm="2">
                                    <Form.Label align="center">
                                        Semana 2
                                    </Form.Label>
                                    </Col>
                                    <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Semana 2"
                                        name="semana2"
                                    />
                                    </Col>
                                    
                                </Form.Group>
                            </Row>
                            
                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label align="center">
                                        Semana 3
                                    </Form.Label>
                                    </Col>
                                    <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Semana 3"
                                        name="semana3"
                                    />
                                    </Col>
                                    <Col sm="2">
                                    <Form.Label align="center">
                                        Semana 4
                                    </Form.Label>
                                    </Col>
                                    <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Semana 4"
                                        name="semana4"
                                    />
                                    </Col>
                                    
                                </Form.Group>
                            </Row>
                            </Container>
                                </div>
                            <br/>
                            
                            <div className="pigmentoMasterBach">
                                <Container fluid>
                                <br/>
                                    <div className="tituloSeccion">
                                        <h4>
                                            Fechas reales de mantenimientos realizados
                                        </h4>
                                    </div>
                            
                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
                                        Real semana 1
                                    </Form.Label>
                                    </Col>
                                    <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Real semana 1"
                                        name="realSemana1"
                                    />
                                    </Col>
                                    <Col sm="3">
                                    <Form.Label align="center">
                                        Real semana 2
                                    </Form.Label>
                                    </Col>
                                    <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Real semana 2"
                                        name="realSemana2"
                                    />
                                    </Col>
                                    
                                </Form.Group>
                            </Row>
                            
                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
                                        Real semana 3
                                    </Form.Label>
                                    </Col>
                                    <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Real semana 3"
                                        name="realSemana3"
                                    />
                                    </Col>
                                    <Col sm="3">
                                    <Form.Label align="center">
                                        Real semana 4
                                    </Form.Label>
                                    </Col>
                                    <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Real semana 4"
                                        name="realSemana4"
                                    />
                                    </Col>
                                    
                                </Form.Group>
                            </Row>
                            
                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
                                        Comentarios
                                    </Form.Label>
                                    </Col>
                                    <Col>
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Comentarios"
                                        name="comentarios"
                                    />
                                    </Col>
                                </Form.Group>
                            </Row>
                            </Container>
                                </div>
                            
                        <Form.Group as={Row} className="botones">
                        <Col>
                            <Button
                                variant="success"
                                title="Guardar información del formulario"
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

export default RegistraMantenimientoPreventivo;
