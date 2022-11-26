import {useEffect, useMemo, useState} from 'react';
import {Alert, Button, Col, Row, Form, Container, Badge} from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import { useHistory } from "react-router-dom";

function RegistroHerramientasEquipos(props) {
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
                                Caracteristicas
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="text"
                                placeholder="Caracteristicas"
                                name="caracteristicas"
                            />
                            </Col>
                            </Form.Group>
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="3">
                            <Form.Label align="center">
                                Cantidad
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                placeholder="Cantidad"
                                name="cantidad"
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
                </Container>
        </>
    );
}

export default RegistroHerramientasEquipos;
