import { useState, useEffect } from 'react';
import { Alert, Button, Col, Row, Form, Container, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { toast } from "react-toastify";

function RegistraRechazos(props) {
    const { setRefreshCheckLogin } = props;
    // Para la animacion del spinner
    const [loading, setLoading] = useState(false);

    // Para definir el enrutamiento
    const enrutamiento = useNavigate()

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento("/Rechazos")
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
                            Nuevo rechazo de producto
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
                                Remisión
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe la remisión"
                                name="remisión"
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
                                name="folio"
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} className="mb-3" controlId="formHorizontalNumeroInterno">
                            <Form.Label>
                                Cantidad rechazada
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe la cantidad rechazada"
                                name="cantidadRechazada"
                            >
                            </Form.Control>
                        </Form.Group>
                    </Row>


                    <Form.Group as={Row} className="botones">
                        <Col>
                            <Button
                                type="submit"
                                title="Guardar informacion del formulario"
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

export default RegistraRechazos;
