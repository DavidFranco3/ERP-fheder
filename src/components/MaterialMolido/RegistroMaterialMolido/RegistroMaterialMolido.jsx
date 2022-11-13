import {useEffect, useMemo, useState} from 'react';
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import {Alert, Button, Col, Row, Form, Container, Badge} from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import { useHistory } from "react-router-dom";
import "./RegistroMaterialMolido.scss";

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
                            <Col sm="3">
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
                            <Col sm="3">
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
                            <Col sm="3">
                            <Form.Label>
                                Descripción del material
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                as="textarea"
                                placeholder="Descripción del material"
                                name="descripcion"
                            />
                            </Col>
                            </Form.Group>
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="3">
                            <Form.Label align="center">
                                Color
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="text"
                                placeholder="Color"
                                name="color"
                            />
                            </Col>
                            </Form.Group>
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="3">
                            <Form.Label align="center">
                                Peso
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                placeholder="Peso"
                                name="peso"
                            />
                            </Col>
                            </Form.Group>
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="3">
                            <Form.Label>
                                Nombre del molinero
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="text"
                                placeholder="Nombre del molinero"
                                name="molinero"
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
