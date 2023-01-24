import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Container, Spinner } from "react-bootstrap";
import { actualizaProductosOV } from "../../../api/productosOV";
import { toast } from "react-toastify";
import queryString from "query-string";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

function ModificacionProductos(props) {
    const { datos, setShowModal, history, setListProductosCargados } = props;

    // Para guardar los datos del formulario
    const [formData, setFormData] = useState(initialFormData(datos));

    const { _id, numeroParte, descripcion } = datos;
    // Para determinar si hay conexion con el servidor o a internet
    const [conexionInternet, setConexionInternet] = useState(true);

    // Cancelar y cerrar el formulario
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault()

        setLoading(true)
        setListProductosCargados("");
        // Realiza registro de la aportación
        const dataTemp = {
            numeroParte: numeroParte,
            descripcion: descripcion,
            cantidad: formData.cantidad,
            um: formData.um,
            precioUnitario: formData.precioUnitario,
            total: parseFloat(formData.precioUnitario) * parseInt(formData.cantidad)
        }

        actualizaProductosOV(_id, dataTemp).then(response => {
            const { data } = response;
            setListProductosCargados(_id);
            setShowModal(false);

        }).catch(e => {
            console.log(e)
        })
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <>
            <Container fluid>
                <div className="formularioDatos">
                    <Form onChange={onChange} onSubmit={onSubmit}>
                        <Row>
                            <Form.Group as={Col} controlId="formGridCliente">
                                <Form.Label>
                                    Numero de parte
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    value={numeroParte}
                                    disabled
                                />
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridCliente">
                                <Form.Label>
                                    Descripcion
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    value={descripcion}
                                    disabled
                                />
                            </Form.Group>
                        </Row>

                        <br />

                        <Row>
                            <Form.Group as={Col} controlId="formGridCliente">
                                <Form.Label>
                                    Cantidad
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={formData.cantidad}
                                    name="cantidad"
                                />
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridCliente">
                                <Form.Label>
                                    UM
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={formData.um}
                                    name="um"
                                />
                            </Form.Group>
                        </Row>

                        <br />

                        <Row>
                            <Form.Group as={Col} controlId="formGridCliente">
                                <Form.Label>
                                    Precio unitario
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.precioUnitario}
                                    name="precioUnitario"
                                    disabled
                                />
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridCliente">
                                <Form.Label>
                                    Total
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    value={parseFloat(formData.precioUnitario) * parseInt(formData.cantidad)}
                                    name="total"
                                    disabled
                                />
                            </Form.Group>
                        </Row>
                        <Form.Group as={Row} className="botones">
                            <Col>
                                <Button
                                    type="submit"
                                    title="Actualizar el registro"
                                    variant="success"
                                    className="registrar"
                                >
                                    {!loading ? "Modificar" : <Spinner animation="border" />}
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    variant="danger"
                                    title="Cerrar el formulario"
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

function initialFormData(data) {

    return {
        cantidad: data.cantidad,
        um: data.um,
        precioUnitario: data.precioUnitario,
        total: data.total
    }
}

export default ModificacionProductos;
