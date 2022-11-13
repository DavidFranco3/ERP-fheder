import {useEffect, useMemo, useState} from 'react';
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import {Alert, Button, Col, Row, Form, Container, Badge} from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import { useHistory } from "react-router-dom";
import "./NuevoRegistro.scss";

function NuevoRegistro(props) {
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
                                Producto
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="text"
                                placeholder="Producto"
                                name="producto"
                            />
                            </Col>
                            </Form.Group>
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                            <Form.Label align="center">
                                Producción
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="text"
                                placeholder="Producción"
                                name="produccion"
                            />
                            </Col>
                            </Form.Group>
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                            <Form.Label align="center">
                                Eficiencia
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                placeholder="Eficiencia"
                                name="eficiencia"
                            />
                            </Col>
                            </Form.Group>
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                            <Form.Label align="center">
                                Ciclo
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="text"
                                placeholder="Ciclo"
                                name="ciclo"
                            />
                            </Col>
                            </Form.Group>
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                            <Form.Label align="center">
                                Estandar
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="text"
                                placeholder="Estandar"
                                name="estandar"
                            />
                            </Col>
                            </Form.Group>
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                            <Form.Label align="center">
                                Scrap
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="text"
                                placeholder="Scrap"
                                name="scrap"
                            />
                            </Col>
                            </Form.Group>
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                            <Form.Label align="center">
                                Observacion
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                as="textarea"
                                placeholder="Producto"
                                name="producto"
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

export default NuevoRegistro;
