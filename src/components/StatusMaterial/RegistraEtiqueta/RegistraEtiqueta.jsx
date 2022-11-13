import { useState, useEffect } from 'react';
import {Alert, Button, Col, Form, Row, Container, Spinner} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";

function RegistraEtiqueta(props) {
    const {setShowModal} = props;
    
    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    const cancelarEtiqueta = () => {
        setShowModal(false)
    }
    
    // Define la ruta de registro
    const rutaRegistroStatus = () => {
        enrutamiento.push("/RegistroStatusMaterial")
    }
    
    // Para controlar la animacion
    const [loading, setLoading] = useState(false); 
    
    return (
        <>
                <Container>
                    <div className="formularioDatos">
                        <Form>
                            <Row className="mb-3">
                                <Form.Label>
                                    Buscar folio
                                </Form.Label>
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col>
                                    <Form.Control
                                        type="Text"
                                        placeholder="Escribe el folio a buscar"
                                        name="folio"
                                    />
                                </Col>
                                <Col sm="3">
                                    <Button
                                        type="button"
                                        variant="success"
                                        className="registrar"
                                    >
                                        {"Buscar"}
                                    </Button>
                                </Col>
                                </Form.Group>
                            </Row>
                            
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                    <Form.Control
                                        as="Textarea"
                                        placeholder=""
                                        name="folioBuscado"
                                    />
                                </Form.Group>
                            </Row>
                            
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formHorizontalNoInterno">
                            <Col>
                                    <Form.Check
                                                value="continuarSinFolio"
                                                type="radio"
                                                label="Continuar sin busqueda"
                                                name="continuarSinFolio"
                                                id="continuarSinFolio"
                                            />
                                </Col>
                            </Form.Group>
                            </Row>
                            
                            <Form.Group as={Row} className="botones">
                        <Col>
                            <Button
                                variant="success"
                                className="registrar"
                                onClick={() => {
                                    rutaRegistroStatus()
                                }}
                            >
                                {"Continuar"}
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                variant="danger"
                                className="cancelar"
                                onClick={() => {
                                    cancelarEtiqueta()
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

export default RegistraEtiqueta;
