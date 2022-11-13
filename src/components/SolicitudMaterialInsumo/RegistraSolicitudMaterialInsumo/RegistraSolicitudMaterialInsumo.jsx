import { useState, useEffect } from 'react';
import {Alert, Button, Col, Form, Row, Container, Spinner, Badge} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import { useHistory } from "react-router-dom";

function RegistraSolicitudMaterialInsumo(props) {
    
    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento.push("/SolicitudMaterialInsumo")
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
                                Nueva solicitud de material/insumos
                            </h1>
                        </Col>
                    </Row>
                </Alert>
                
                <br/>
                
                <Container fluid>
                    <div className="formularioDatos">
                        <Form>
                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="1">
                                    <Form.Label align="center">
                                        ¿Que solicita?
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="¿Que solicita?"
                                        name="solicitud"
                                    />
                                </Col>
                                
                                <Col sm="2">
                                    <Form.Label align="center">
                                        Fecha de elaboracion
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="date"
                                        placeholder="Fecha de elaboracion"
                                        name="fechaElaboracion"
                                    />
                                </Col>
                                
                                <Col sm="2">
                                    <Form.Label align="center">
                                        Nombre del solicitante
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nombre del solicitante"
                                        name="nombreSolicitante"
                                    />
                                </Col>
                                </Form.Group>
                            </Row>
                            
                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="1">
                                    <Form.Label align="center">
                                        Folio
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Folio"
                                        name="folio"
                                    />
                                </Col>
                                
                                <Col sm="2">
                                    <Form.Label align="center">
                                        ¿Cuando se require?
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="date"
                                        placeholder="¿Cuando se require?"
                                        name="requiere"
                                    />
                                </Col>
                                
                                <Col sm="2">
                                    <Form.Label align="center">
                                        Area solicitante
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Area solicitante"
                                        name="areaSolicitante"
                                    />
                                </Col>
                                </Form.Group>
                            </Row>
                            
                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="1">Item</Col>
                                <Col sm="3">
                                    <Form.Label align="center">
                                        Descripcion del producto y/o servicio
                                    </Form.Label>
                                </Col>
                                
                                <Col sm="2">
                                    <Form.Label align="center">
                                        Unidad de medida
                                    </Form.Label>
                                </Col>
                                
                                <Col sm="1">
                                    <Form.Label align="center">
                                        Cantidad
                                    </Form.Label>
                                </Col>
                                
                                <Col sm="2">
                                    <Form.Label align="center">
                                        Proveedor sugerido
                                    </Form.Label>
                                </Col>
                                
                                <Col sm="2">
                                    <Form.Label align="center">
                                        Aplicacion
                                    </Form.Label>
                                </Col>
                                
                                <Col sm="1">

                                </Col>
                                
                                </Form.Group>
                            </Row>
                            
                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="1"></Col>
                                <Col sm="3">
                                    <Form.Control
                                        type="text"
                                        placeholder="descripcion"
                                        name="descripcion"
                                    />
                                </Col>
                                
                                <Col sm="2">
                                    <Form.Control
                                        type="text"
                                        placeholder="pieza"
                                        name="pieza"
                                    />
                                </Col>
                                
                                <Col sm="1">
                                    <Form.Control
                                        type="number"
                                        placeholder="cantidad"
                                        name="cantidad"
                                    />
                                </Col>
                                
                                <Col sm="2">
                                    <Form.Control
                                        type="text"
                                        placeholder="proveedor sugerido"
                                        name="proveedor"
                                    />
                                </Col>
                                
                                <Col sm="2">
                                    <Form.Control
                                        type="text"
                                        placeholder="aplicacion"
                                        name="aplicacion"
                                    />
                                </Col>
                                
                                <Col sm="1">
                                        <Badge
                                            bg="success"
                                            className="agregarItem"
                                        >
                        +
                    </Badge>
                                    </Col>
                                
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
                        </Form>
                    </div>
                </Container> 
            </LayoutPrincipal>
        </>
    );
}

export default RegistraSolicitudMaterialInsumo;
