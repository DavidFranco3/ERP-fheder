import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Container, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import queryString from "query-string";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

function ModificacionProductos(props) {
    const { datos, setShowModal, history, setListProductosCargados, listProductosCargados } = props;

    console.log(listProductosCargados);

    // Para guardar los datos del formulario
    const [formData, setFormData] = useState(initialFormData(datos));

    const { ID, folio, descripcion } = datos;
    // Para determinar si hay conexion con el servidor o a internet
    const [conexionInternet, setConexionInternet] = useState(true);

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
        cambiarValor("subtotal", datos.subtotal, parseFloat(formData.precio) * parseInt(formData.cantidad));
        cambiarValor("requisicion", datos.requisicion, formData.requisicion);
        cambiarValor("referencia", datos.referencia, formData.referencia);

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
                                    Folio
                                </Form.Label>
                                <Form.Control
                                    id="material"
                                    type="text"
                                    value={folio}
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
                                    value={formData.precio}
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
                                    value={parseFloat(formData.precio) * parseInt(formData.cantidad)}
                                    name="total"
                                    disabled
                                />
                            </Form.Group>
                        </Row>

                        <br />

                        <Row>
                            <Form.Group as={Col} controlId="formGridCliente">
                                <Form.Label>
                                    Referencia
                                </Form.Label>
                                <Form.Control
                                    id="requision"
                                    type="text"
                                    defaultValue={formData.requisicion}
                                    name="requisicion"
                                />
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridCliente">
                                <Form.Label>
                                    Referencia
                                </Form.Label>
                                <Form.Control
                                    id="referencia"
                                    type="text"
                                    defaultValue={formData.referencia}
                                    name="referencia"
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
        precio: data.precio,
        subtotal: data.subtotal,
        requisicion: data.requisicion,
        referencia: data.referencia
    }
}

export default ModificacionProductos;
