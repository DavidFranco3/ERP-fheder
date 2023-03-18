import { useState } from 'react';
import { Button, Col, Form, Row, Container, Spinner } from "react-bootstrap";

function ModificacionProductos(props) {
    const { datos, setShowModal, listProductosCargados } = props;

    // Para guardar los datos del formulario
    const [formData, setFormData] = useState(initialFormData(datos));

    const { _id, ID, item, idProducto } = datos;

    // Cancelar y cerrar el formulario
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    function cambiarValor(valorABuscar, valorViejo, valorNuevo) {
        listProductosCargados.forEach(function (elemento) { // recorremos el array

            //asignamos el valor del elemento dependiendo del valor a buscar, validamos que el valor sea el mismo y se reemplaza con el nuevo. 
            elemento[valorABuscar] = elemento[valorABuscar] == valorViejo ? valorNuevo : elemento[valorABuscar]
        })
    }

    const addItems = () => {

        setLoading(true);

        cambiarValor("cantidad", datos.cantidad, formData.cantidad);
        cambiarValor("um", datos.um, formData.um);
        cambiarValor("total", datos.total, parseFloat(formData.precioUnitario) * parseInt(formData.cantidad))

        cancelarRegistro();
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <>
            <Container fluid>
                <div className="formularioDatos">
                    <Form onChange={onChange}>
                        <Row>
                            <Form.Group as={Col} controlId="formGridCliente">
                                <Form.Label>
                                    Numero de parte
                                </Form.Label>
                                <Form.Control
                                    id="material"
                                    type="text"
                                    value={ID}
                                    disabled
                                />
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridCliente">
                                <Form.Label>
                                    Descripcion
                                </Form.Label>
                                <Form.Control
                                    id="descripcion"
                                    type="text"
                                    value={item}
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
                                    id="cantidad"
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
                                    id="um"
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
                                    id="precioUnitario"
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
                                    id="total"
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
                                    title="Actualizar el registro"
                                    variant="success"
                                    className="registrar"
                                    onClick={() => {
                                        addItems()
                                    }}
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
