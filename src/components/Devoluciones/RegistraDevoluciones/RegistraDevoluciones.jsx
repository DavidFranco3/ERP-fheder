import { useState, useEffect } from 'react';
import { Alert, Button, Col, Row, Form, Container, Badge } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { toast } from "react-toastify";

function RegistraDevoluciones(props) {
    const { setRefreshCheckLogin } = props;
    // Para la animacion del spinner
    const [loading, setLoading] = useState(false);

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento.push("/Devoluciones")
    }

    // Cerrado de sesión automatico
    useEffect(() => {
        if (getTokenApi()) {
            if (isExpiredToken(getTokenApi())) {
                toast.warning("Sesión expirada");
                toast.success("Sesión cerrada por seguridad");
                logoutApi();
                setRefreshCheckLogin(true);
            }
        }
    }, []);
    // Termina cerrado de sesión automatico

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Nueva devolución
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
                                Factura
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe la factura"
                                name="factura"
                            >
                            </Form.Control>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} className="mb-3" controlId="formHorizontalNumeroInterno">
                            <Form.Label>
                                Empresa
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe la empresa"
                                name="empresa"
                            >
                            </Form.Control>
                        </Form.Group>

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
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} className="mb-3" controlId="formHorizontalNumeroInterno">
                            <Form.Label>
                                RFC
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe el RFC"
                                name="RFC"
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} className="mb-3" controlId="formHorizontalNumeroInterno">
                            <Form.Label>
                                Almacen
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe el almacen"
                                name="almacen"
                            >
                            </Form.Control>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} className="mb-3" controlId="formHorizontalNumeroInterno">
                            <Form.Label>
                                Razón social
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe la razón social"
                                name="razónSocial"
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} className="mb-3" controlId="formHorizontalNumeroInterno">
                            <Form.Label>
                                Comentario
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe el comentario"
                                name="comentario"
                            >
                            </Form.Control>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} className="mb-3" controlId="formHorizontalNumeroInterno">
                            <Form.Label>
                                Vendedor
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe el vendedor"
                                name="vendedor"
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} className="mb-3" controlId="formHorizontalNumeroInterno">
                            <Form.Label>
                                Domicilio
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe el domicilio"
                                name="domicilio"
                            >
                            </Form.Control>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
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
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} className="mb-3" controlId="formHorizontalNumeroInterno">
                            <Form.Label>
                                Costo
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe el costo"
                                name="costo"
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} className="mb-3" controlId="formHorizontalNumeroInterno">
                            <Form.Label>
                                Importe
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe el importe"
                                name="importe"
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

export default RegistraDevoluciones;
