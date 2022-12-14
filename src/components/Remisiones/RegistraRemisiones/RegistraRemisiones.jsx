import { useState, useEffect } from 'react';
import { Alert, Button, Col, Row, Form, Container, Badge } from "react-bootstrap";
import { useHistory } from "react-router-dom";

function RegistraRemisiones(props) {

    // Para la animacion del spinner
    const [loading, setLoading] = useState(false);

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento.push("/Remisión")
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Nueva remisión
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <h1>
                            Folio-{"1"}
                        </h1>
                    </Col>
                </Row>
            </Alert>

            <Container fluid>
                <Form>
                    <Row className="mb-3">
                        <Form.Group as={Col} className="mb-3" controlId="formHorizontalNumeroInterno">
                            <Form.Label>
                                Folio
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe el folio"
                                name="folio"
                                disabled
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} className="mb-3" controlId="formHorizontalNumeroInterno">
                            <Form.Label>
                                Orden de venta
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe la orden de venta"
                                name="ordenVenta"
                            >
                            </Form.Control>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} className="mb-3" controlId="formHorizontalNumeroInterno">
                            <Form.Label>
                                Cliente
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe el cliente"
                                name="cliente"
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} className="mb-3" controlId="formHorizontalNumeroInterno">
                            <Form.Label>
                                Productos
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe los productos"
                                name="productos"
                            >
                            </Form.Control>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Label align="center">
                            Subtotales
                        </Form.Label>
                        <Form.Group as={Col} className="mb-3" controlId="formHorizontalNumeroInterno">
                            <Form.Label>
                                Cantidad
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe la cantidad"
                                name="cantidad"
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} className="mb-3" controlId="formHorizontalNumeroInterno">
                            <Form.Label>
                                Precio
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe el precio"
                                name="precio"
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} className="mb-3" controlId="formHorizontalNumeroInterno">
                            <Form.Label>
                                Total
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe el total"
                                name="total"
                            >
                            </Form.Control>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} className="mb-3" controlId="formHorizontalNumeroInterno">
                            <Form.Label>
                                Impuestos
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe los impuestos"
                                name="impuestos"
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} className="mb-3" controlId="formHorizontalNumeroInterno">
                            <Form.Label>
                                Descuentos
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe los descuentos"
                                name="descuentos"
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} className="mb-3" controlId="formHorizontalNumeroInterno">
                            <Form.Label>
                                Total
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe el total"
                                name="total"
                            >
                            </Form.Control>
                        </Form.Group>
                    </Row>

                    <Form.Group as={Row} className="botones">
                        <Col>
                            <Button
                                type="submit"
                                title="Guardar información del formulario"
                                variant="success"
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
                                    rutaRegreso()
                                }}
                            >
                                Cancelar
                            </Button>
                        </Col>
                    </Form.Group>
                </Form>
            </Container>
        </>
    );
}

export default RegistraRemisiones;
