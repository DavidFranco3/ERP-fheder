import {useEffect, useMemo, useState} from 'react';
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import {Alert, Button, Col, Row, Form, Container, Badge} from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import { useHistory } from "react-router-dom";
import "./RegistroIdentificacionPT.scss";

function RegistroIdentificacionPT(props) {
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
                            <Col sm="2">
                            <Form.Label align="center">
                                Fecha
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="date"
                                placeholder="Fecha"
                                name="fecha"
                            />
                            </Col>
                            </Form.Group>
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                            <Form.Label align="center">
                                Descripción
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                as="textarea"
                                placeholder="Descripción"
                                name="descripcion"
                            />
                            </Col>
                            </Form.Group>
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                            <Form.Label align="center">
                                No. Parte
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                placeholder="Numero de parte"
                                name="numeroParte"
                            />
                            </Col>
                            </Form.Group>
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                            <Form.Label align="center">
                                No. Orden
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                placeholder="Numero de orden"
                                name="numeroOrden"
                            />
                            </Col>
                            </Form.Group>
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
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
                        
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                            <Form.Label align="center">
                                Turno
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="text"
                                placeholder="Turno"
                                name="turno"
                            />
                            </Col>
                            </Form.Group>
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                            <Form.Label align="center">
                                Operador
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="text"
                                placeholder="Operador"
                                name="operador"
                            />
                            </Col>
                            </Form.Group>
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                            <Form.Label align="center">
                                Supervisor
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="text"
                                placeholder="Supervisor"
                                name="supervisor"
                            />
                            </Col>
                            </Form.Group>
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                            <Form.Label align="center">
                                Inspector
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="text"
                                placeholder="Inspector"
                                name="inspector"
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

export default RegistroIdentificacionPT;
