import {useEffect, useMemo, useState} from 'react';
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import {Alert, Button, Col, Row, Form, Container, Badge} from "react-bootstrap";
import { useHistory } from "react-router-dom";

function RegistroEmbarque(props) {
    const { setRefreshCheckLogin } = props;
    
    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento.push("/Embarque")
    }
    
    // Para controlar la animacion
    const [loading, setLoading] = useState(false); 

    return (
        <>
            <LayoutPrincipal>
                <Alert>
                    <Row>
                        <Col xs={12} md={8}>
                            <h1>
                                Embarque
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                        <h1>
                            Folio-{"1"}
                        </h1>
                        </Col>
                    </Row>
                </Alert>
                
                <br/>
            
                <Container fluid>
                    <div className="formularioDatos">
                        <Form>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                    <Form.Label align="center">
                                        Unidad almacén
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Unidad almacén"
                                        name="unidadAlmacen"
                                    />
                                </Form.Group>
                                
                                <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                    <Form.Label align="center">
                                        Unidad transporte
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Unidad transporte"
                                        name="unidadTransporte"
                                    />
                                </Form.Group>
                            </Row>
                            
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                    <Form.Label align="center">
                                        Fecha de carga
                                    </Form.Label>
                                    <Form.Control
                                        type="date"
                                        placeholder="Fecha de carga"
                                        name="fechaCarga"
                                    />
                                </Form.Group>
                                
                                <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                    <Form.Label align="center">
                                        Fecha de partida
                                    </Form.Label>
                                    <Form.Control
                                        type="date"
                                        placeholder="Fecha de partida"
                                        name="fechaPartida"
                                    />
                                </Form.Group>
                            </Row>
                            
                            <Form.Group as={Row} className="botones">
                                <Col>
                                    <Button
                                        type="submit"
                                        variant="success"
                                        className="registrar"
                                    >
                                        {"Registrar"}
                                    </Button>
                                </Col>
                                <Col>
                                    <Button
                                        variant="danger"
                                        className="cancelar"
                                        onClick={() => {
                                            rutaRegreso()
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                </Col>
                            </Form.Group>
                    
                    <br/>

                        </Form>
                    </div>
                </Container>
            
            </LayoutPrincipal>
        </>
    );
}

export default RegistroEmbarque;
