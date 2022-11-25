import { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Row, Container, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import { useHistory } from "react-router-dom";
import { obtenerDatosPedidoVenta, listarPedidosVenta } from "../../../api/pedidoVenta";
import { obtenerCliente } from "../../../api/clientes";

const fechaToCurrentTimezone = (fecha) => {
    const date = new Date(fecha)

    date.setMinutes(date.getMinutes() - date.getTimezoneOffset())


    return date.toISOString().slice(0, 16);
}

function BuscarOV(props) {
    const { setShowModal, setOrdenVenta, setClienteOV, setCantidadRequeridaOV } = props;
    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    // Para almacenar la informacion del formulario
    const [formData, setFormData] = useState(initialFormData());
    const [valorInicialCliente, setValorInicialCliente] = useState("");
    const [valorFinalCliente, setValorFinalCliente] = useState("");
    const [valorFolio, setValorFolio] = useState("");
    const [fecha, setFecha] = useState("");
    const [listProducto, setListProducto] = useState([]);

    useEffect(() => {
        try {

            obtenerDatosPedidoVenta(formData.buscar).then(response => {
                const { data } = response;
                const { folio, cliente, fechaElaboracion, productos } = data;
                setOrdenVenta(folio)
                setValorFolio(folio)
                setValorInicialCliente(cliente)
                setFecha(fechaElaboracion)
                setListProducto(productos)

                obtenerCliente(cliente).then(response => {
                    const { data } = response;
                    const { nombre } = data;
                    setClienteOV(nombre)
                    setValorFinalCliente(nombre)

                }).catch(e => {
                    console.log(e)
                })

            }).catch(e => {
                console.log(e)
            })

        } catch (e) {
            console.log(e)
        }
    }, [formData.buscar]);

    const cantidad = listProducto.reduce((amount, item) => (amount + parseInt(item.cantidad)), 0);

    // Cancelar y cerrar el formulario
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const onSubmit = e => {
        e.preventDefault();
        //setNombreCliente()
        //console.log(formData)
        setLoading(true);
        setOrdenVenta(formData.buscar);
        setCantidadRequeridaOV(cantidad);
        setShowModal(false);
    }

    return (
        <>

            <Container fluid>
                <div className="formularioDatos">
                    <Form onSubmit={onSubmit} onChange={onChange}>
                        <Row ClassName="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label>Orden de venta:</Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Buscar orden de venta"
                                        name="buscar"
                                        defaultValue={formData.buscar}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <br />

                        <Row ClassName="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Orden de venta"
                                        name="ordenVenta"
                                        value={formData.buscar.length == 9 ? valorFolio : ""}
                                        disabled
                                    />
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Cliente"
                                        name="cliente"
                                        value={formData.buscar.length == 9 ? valorFinalCliente : ""}
                                        disabled
                                    />
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Fecha"
                                        name="fecha"
                                        value={formData.buscar.length == 9 ? fecha : ""}
                                        disabled
                                    />
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
                                    {!loading ? "Seleccionar" : <Spinner animation="border" />}
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    variant="danger"
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

function initialFormData() {
    return {
        buscar: ""
    }
}

export default BuscarOV;
