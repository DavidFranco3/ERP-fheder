import { useState, useEffect } from 'react';
import { Alert, Button, Col, Container, Form, Image, Row, Spinner, Table } from "react-bootstrap";
import { withRouter, useNavigate } from "react-router-dom";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { toast } from "react-toastify";

function RegistroPlaneacion(props) {
    const { setRefreshCheckLogin } = props;

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

    // Para la animacion del spinner
    const [loading, setLoading] = useState(false);

    const enrutamiento = useNavigate();

    // Para ir hacia la ruta de registro del pedido de venta
    const rutaRegresoPlaneacion = () => {
        enrutamiento("/Planeacion")
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Registro de planeacion
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <h1>
                            Folio {"1"}
                        </h1>
                    </Col>
                </Row>
            </Alert>

            <Container>
                <Col>
                    <div className="formlarioRegistroProductos">
                        <Form>
                            <Row>
                                <Form.Group as={Col} className="mb-3" controlId="formHorizontalNumeroInterno">
                                    <Form.Label>
                                        Orden de venta
                                    </Form.Label>
                                    <Form.Control as="select"
                                        name="ordenVenta"
                                    >
                                        <option>Elige una opción</option>
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group as={Col} className="mb-3" controlId="formCliente">
                                    <Form.Label>
                                        Productos
                                    </Form.Label>
                                    <Form.Control as="select"
                                        name="cliente"
                                    >
                                        <option>Elige una opción</option>
                                    </Form.Control>
                                </Form.Group>
                            </Row>


                            {/* No. molde y cav molde */}
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridNumeroMolde">
                                    <Form.Label>
                                        Detalles
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Escribe el no. del molde"
                                        name="noMolde"
                                    />
                                </Form.Group>

                                <Form.Group as={Col} className="mb-3" controlId="formCliente">
                                    <Form.Label>
                                        Estado
                                    </Form.Label>
                                    <Form.Control as="select"
                                        name="cliente"
                                    >
                                        <option >Elige una opcion</option>
                                        <option value="Entrada">Entrada</option>
                                        <option value="Salida">Salida</option>
                                    </Form.Control>
                                </Form.Group>
                            </Row>

                            <Form.Group as={Row} className="botones">
                                <Row>
                                    <Col>
                                        <Button
                                            title="Guardar la información del formulario"
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
                                                rutaRegresoPlaneacion()
                                            }}
                                        >
                                            Cancelar
                                        </Button>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Form>
                    </div>
                </Col>
            </Container>
        </>
    );
}

export default RegistroPlaneacion;
