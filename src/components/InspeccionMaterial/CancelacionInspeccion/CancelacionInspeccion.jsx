import { useState, useEffect } from 'react';
import {Alert, Button, Col, Form, Row, Container, Spinner} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import { useHistory } from "react-router-dom";

function CancelacionInspeccion(props) {
    const { setShowModal } = props;
    
    // Para definir el enrutamiento
    const enrutamiento = useHistory()
    
    const cancelarCancelacion = () => {
        setShowModal(false)
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false); 
    
    return (
        <>
                <Container>
                    <div className="formularioDatos">
                        <Form>
                            <Row ClassName="mb-3">
                                 <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                    <Form.Label align="center">
                                        Motivos de la cancelación
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Motivos de la cancelación"
                                        name="motivos"
                                    />
                                </Form.Group>
                            </Row>
                            
                        <Form.Group as={Row} className="botones">
                        <Col>
                            <Button
                                variant="success"
                                className="registrar"
                            >
                                {"Guardar"}
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                variant="danger"
                                className="cancelar"
                                onClick={() => {
                                    cancelarCancelacion()
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

export default CancelacionInspeccion;
