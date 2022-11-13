import { useState, useEffect } from 'react';
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import {useHistory} from "react-router-dom";
import {Alert, Button, Col, Row, Form, Container, Badge} from "react-bootstrap";
import "./RegistroTiquets.scss";

function RegistroTiquets(props) {
    const { setRefreshCheckLogin } = props;

    const [loading, setLoading] = useState(false);

    const enrutamiento = useHistory();
    
    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento.push("/Tiquets")
    }

    return (
        <>
            <LayoutPrincipal>
                    <Alert>
                        <Row>
                            <Col xs={12} md={8}>
                                <h1>
                                    Registro Tiquet
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
               
               <Container>
                   <div className="formularioDatos">
                        <Form>
                            <Row className="mb-3">
                                <Form.Label align="center">
                                        Ventas
                                </Form.Label>
                                <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                    <Form.Label align="center">
                                        Numero
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Numero"
                                        name="numeroVenta"
                                    />
                                </Form.Group>
                                
                                 <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                    <Form.Label align="center">
                                        Descripción
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Descripcion"
                                        name="descripcionVenta"
                                    />
                                </Form.Group>
                            </Row>
                                
                                <br/>
                                
                                <Row className="mb-3">
                                <Form.Label align="center">
                                        Compras
                                </Form.Label>
                                <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                    <Form.Label align="center">
                                        Numero
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Numero"
                                        name="numeroCompra"
                                    />
                                </Form.Group>
                                
                                 <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                    <Form.Label align="center">
                                        Descripción
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Descripcion"
                                        name="descripcionCompra"
                                    />
                                </Form.Group>
                            </Row>
                            
                            <br/>
                            
                            <Row className="mb-3">
                                <Form.Label align="center">
                                        Producción
                                </Form.Label>
                                <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                    <Form.Label align="center">
                                        Numero
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Numero"
                                        name="numeroProduccion"
                                    />
                                </Form.Group>
                                
                                 <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                    <Form.Label align="center">
                                        Descripción
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Descripcion"
                                        name="descripcionProduccion"
                                    />
                                </Form.Group>
                            </Row>
                            
                            <br/>
                            
                            <Row className="mb-3">
                                <Form.Label align="center">
                                        Almacen
                                </Form.Label>
                                <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                    <Form.Label align="center">
                                        Numero
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Numero"
                                        name="numeroAlmacen"
                                    />
                                </Form.Group>
                                
                                 <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                    <Form.Label align="center">
                                        Descripción
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Descripcion"
                                        name="descripcionAlmacen"
                                    />
                                </Form.Group>
                            </Row>
                            
                            <br/>
                            
                            <Row className="mb-3">
                                <Form.Label align="center">
                                        Embarque
                                </Form.Label>
                                <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                    <Form.Label align="center">
                                        Numero
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Numero"
                                        name="numerEmbarque"
                                    />
                                </Form.Group>
                                
                                 <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                    <Form.Label align="center">
                                        Descripción
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Descripcion"
                                        name="descripcionEmbarque"
                                    />
                                </Form.Group>
                            </Row>
                            
                            <br/>
                            
                            <Row className="mb-3">
                                <Form.Label align="center">
                                        Logística
                                </Form.Label>
                                <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                    <Form.Label align="center">
                                        Numero
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Numero"
                                        name="numeroLogistica"
                                    />
                                </Form.Group>
                                
                                 <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                    <Form.Label align="center">
                                        Descripción
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Descripcion"
                                        name="descripcionLogistica"
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

export default RegistroTiquets;
