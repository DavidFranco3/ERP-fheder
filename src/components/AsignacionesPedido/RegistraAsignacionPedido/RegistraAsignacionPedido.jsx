import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Container, Spinner } from "react-bootstrap";
import { obtenerDatosPedidoVenta } from "../../../api/pedidoVenta";
import { obtenerCliente } from "../../../api/clientes";
import { listarAlmacenPT } from "../../../api/almacenPT";
import { map } from "lodash";
import { registraAsignacionPedido, obtenerItem } from "../../../api/asignacionPedido";
import { toast } from "react-toastify";
import queryString from "query-string";

function RegistraAsignacionPedido(props) {
    const { setShowModal, location, history } = props;

    // Para guardar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());
    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    const [ordenVenta, setOrdenVenta] = useState("");
    const [idCliente, setIdCliente] = useState("");
    const [nombreCliente, setNombreCliente] = useState("");
    const [fechaPedido, setFechaPedido] = useState("");
    const [fechaEntrega, setFechaEntrega] = useState("");

    useEffect(() => {
        try {

            obtenerDatosPedidoVenta(formData.buscar).then(response => {
                const { data } = response;
                const { folio, cliente, fechaElaboracion, fechaEntrega } = data;
                setOrdenVenta(folio)
                setIdCliente(cliente)
                setFechaPedido(fechaElaboracion)
                setFechaEntrega(fechaEntrega)

                obtenerCliente(cliente).then(response => {
                    const { data } = response;
                    const { nombre, apellidos } = data;
                    setNombreCliente(nombre + " " + apellidos)

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

    // Para almacenar el listado de materias primas
    const [listMateriasPrimas, setListMateriasPrimas] = useState(null);

    useEffect(() => {
        try {
            listarAlmacenPT().then(response => {
                const { data } = response;
                // console.log(data)
                if (!listMateriasPrimas && data) {
                    setListMateriasPrimas(formatModelAlmacenPT(data));
                } else {
                    const datosProductos = formatModelAlmacenPT(data);
                    setListMateriasPrimas(datosProductos);
                }
            }).catch(e => {
                //console.log(e)
            })
        } catch (e) {
            //console.log(e)
        }
    }, []);

    // Para almacenar la materia prima seleccionada
    const [almacenPT, setAlmacenPT] = useState([]);

    const handleProducto = (articulo) => {
        // console.log(articulo)
        // {materiaprima?.folioMP + "/" + materiaprima?.nombre + "/" + materiaprima?.um + "/" + materiaprima?.existenciasOV + "/" + materiaprima?.existenciasStock + "/" + materiaprima?.existenciasTotales}
        const temp = articulo.split("/")
        // console.log(temp)

        // console.log(dataTemp)
        setAlmacenPT({
            idProducto: temp[0],
            um: temp[1],
            cantidadPedida: temp[2],
        })
    }

    const onSubmit = (e) => {
        e.preventDefault()

        if (!formData.buscar || !formData.producto) {
            toast.warning("Completa el formulario")
        } else {

            setLoading(true)
            // Realiza registro de la aportación
            obtenerItem().then(response => {
                const { data } = response;
                const { item } = data;
                console.log(data)

                const dataTemp = {
                    item: item,
                    folio: ordenVenta,
                    cliente: idCliente,
                    fechaPedido: fechaPedido,
                    fechaEntrega: fechaEntrega,
                    um: almacenPT.um,
                    cantidadPedida: almacenPT.cantidadPedida,
                    cantidadAsignada: "N/A",
                    plantaAsignada: "N/A",
                    producto: almacenPT.idProducto
                }

                registraAsignacionPedido(dataTemp).then(response => {
                    const { data } = response;

                    toast.success('Asignacion de pedido registrada')
                    setTimeout(() => {
                        setLoading(false)
                        history.push({
                            search: queryString.stringify(""),
                        });
                        setShowModal(false)
                    }, 2000)

                }).catch(e => {
                    console.log(e)
                })

            }).catch(e => {
                console.log(e)
            })
        }
    }

    // Cancelar y cerrar el formulario
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <>

            <Container fluid>
                <div className="formularioDatos">
                    <Form onChange={onChange} onSubmit={onSubmit}>
                        <Row ClassName="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="5">
                                    <Form.Label>
                                        Orden de venta:
                                    </Form.Label>
                                </Col>
                                <Col sm="7">
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
                                <Col sm="4">
                                    <Form.Label>Orden de venta:</Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Orden de venta"
                                        name="ordenVenta"
                                        value={formData.buscar.length == 9 ? ordenVenta : ""}
                                        disabled
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <br />

                        <Row ClassName="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="4">
                                    <Form.Label>Cliente:</Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Cliente"
                                        name="cliente"
                                        value={formData.buscar.length == 9 ? nombreCliente : ""}
                                        disabled
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <br />

                        <Row ClassName="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="4">
                                    <Form.Label>Fecha pedido:</Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="date"
                                        placeholder="Fecha pedido"
                                        name="fechaPedido"
                                        value={formData.buscar.length == 9 ? fechaPedido : ""}
                                        disabled
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <br />

                        <Row ClassName="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="4">
                                    <Form.Label>Fecha entrega:</Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="date"
                                        placeholder="Fecha entrega"
                                        name="fechaEntrega"
                                        value={formData.buscar.length == 9 ? fechaEntrega : ""}
                                        disabled
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <br />

                        <Row ClassName="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="4">
                                    <Form.Label>Seleccionar producto</Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control as="select"
                                        onChange={(e) => {
                                            handleProducto(e.target.value)
                                        }}
                                        defaultValue={formData.producto}
                                        name="producto"
                                    >
                                        <option>Elige</option>
                                        {map(listMateriasPrimas, (producto, index) => (
                                            <option
                                                key={index}
                                                value={producto.idProducto + "/" + producto.um + "/" + producto.existenciasTotales}
                                            >
                                                {producto.nombre}
                                            </option>
                                        ))}
                                    </Form.Control>
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
                                    {!loading ? "Registrar" : <Spinner animation="border" />}
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

function initialFormData(folio, fecha) {
    return {
        buscar: "",
        producto: "",
    }
}

function formatModelAlmacenPT(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            idProducto: data.idProducto,
            folioAlmacen: data.folioAlmacen,
            folioMP: data.folioMP,
            nombre: data.nombre,
            descripcion: data.descripcion,
            um: data.um,
            movimientos: data.movimientos,
            existenciasOV: data.existenciasOV,
            existenciasStock: data.existenciasStock,
            existenciasTotales: data.existenciasTotales,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default RegistraAsignacionPedido;
