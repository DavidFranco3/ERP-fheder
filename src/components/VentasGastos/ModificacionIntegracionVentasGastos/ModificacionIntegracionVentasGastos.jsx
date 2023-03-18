import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Container, Spinner } from "react-bootstrap";
import { listarClientes } from "../../../api/clientes";
import { map } from "lodash";
import { actualizaIntegraciones } from "../../../api/integracionVentasGastos";
import { toast } from "react-toastify";
import queryString from "query-string";
import { LogsInformativos } from '../../Logs/LogsSistema/LogsSistema';
import { getSucursal } from '../../../api/auth';

function ModificacionIntegracionVentasGastos(props) {
    const { data, setShowModal, history } = props;

    const { id } = data;

    // Para guardar los datos del formulario
    const [formData, setFormData] = useState(initialFormData(data));

    // Para determinar si hay conexion con el servidor o a internet
    const [conexionInternet, setConexionInternet] = useState(true);

    // Para almacenar la lista completa de clientes
    const [listClientes, setListClientes] = useState(null);

    const cargarListaclientes = () => {
        try {
            listarClientes(getSucursal()).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listClientes && data) {
                    setListClientes(formatModelClientes(data));
                } else {
                    const datosClientes = formatModelClientes(data);
                    setListClientes(datosClientes);
                }
            }).catch(e => {
                //console.log(e)
                if (e.message === 'Network Error') {
                    //console.log("No hay internet")
                    toast.error("Conexión a Internet no Disponible");
                    setConexionInternet(false);
                }
            })
        } catch (e) {
            console.log(e)
        }
    }

    // Obtener los clientes registrados
    useEffect(() => {
        cargarListaclientes();
    }, []);

    // Para almacenar el folio actual
    const [facturaActual, setFacturaActual] = useState("");

    // Cancelar y cerrar el formulario
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault()

        if (!formData.fechaFactura || !formData.cliente || !formData.importe || !formData.observaciones) {
            toast.warning("Completa el formulario")
        } else {

            setLoading(true)
            // Realiza registro de la aportación

            const dataTemp = {
                fechaFactura: formData.fechaFactura,
                cliente: formData.cliente,
                importe: formData.importe,
                iva: formData.importe != "" ? parseFloat(formData.importe) * parseFloat(0.16) : "0",
                total: formData.importe != "" ? (parseFloat(formData.importe) + parseFloat(formData.importe) * parseFloat(0.16)) : "0",
                observaciones: formData.observaciones
            }

            actualizaIntegraciones(id, dataTemp).then(response => {
                const { data } = response;
                LogsInformativos("Se a modificado la integracion de ventas y gastos " + data.folio, dataTemp);
                toast.success(data.mensaje);
                setTimeout(() => {
                    setLoading(false)
                    history({
                        search: queryString.stringify(""),
                    });
                    setShowModal(false)
                }, 0)

            }).catch(e => {
                console.log(e)
            })
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <>
            <Container fluid>
                <div className="formularioDatos">
                    <Form onChange={onChange} onSubmit={onSubmit}>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label>
                                        No. Factura
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="No. Factura"
                                        name="numeroFactura"
                                        defaultValue={formData.folio}
                                        disabled
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label>
                                        Fecha factura
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="date"
                                        placeholder="Fecha factura"
                                        name="fechaFactura"
                                        defaultValue={formData.fechaFactura}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label>
                                        Cliente
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control as="select"
                                        defaultValue={formData.cliente}
                                        name="cliente"
                                    >
                                        <option>Elige</option>
                                        {map(listClientes, (cliente, index) => (
                                            <option
                                                key={index}
                                                value={cliente.id} selected={cliente?.id === formData.cliente}
                                            >
                                                {cliente.nombre}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label>
                                        Importe
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Importe"
                                        name="importe"
                                        defaultValue={formData.importe}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label>
                                        IVA
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="IVA"
                                        name="iva"
                                        value={formData.importe != "" ? parseFloat(formData.importe) * parseFloat(0.16) : "0"}
                                        disabled
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label>
                                        Total
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Total"
                                        name="total"
                                        value={formData.importe != "" ? (parseFloat(formData.importe) + parseFloat(formData.importe) * parseFloat(0.16)) : "0"}
                                        disabled
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label>
                                        Observaciones
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        as="textarea"
                                        style={{ height: '100px' }}
                                        type="text"
                                        placeholder="Observaciones"
                                        name="observaciones"
                                        defaultValue={formData.observaciones}
                                    />
                                </Col>
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
                                    {!loading ? "Actualizar" : <Spinner animation="border" />}
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
    const { folio, fechaFactura, cliente, importe, observaciones } = data;

    return {
        folio: folio,
        fechaFactura: fechaFactura,
        cliente: cliente,
        importe: importe,
        observaciones: observaciones,
    }
}

function formatModelClientes(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        const { direccion: { calle, numeroExterior, numeroInterior, colonia, municipio, estado, pais } } = data;
        dataTemp.push({
            id: data._id,
            nombre: data.nombre,
            apellidos: data.apellidos,
            rfc: data.rfc,
            telefonoCelular: data.telefonoCelular,
            calle: calle,
            numeroExterior: numeroExterior,
            numeroInterior: numeroInterior,
            colonia: colonia,
            municipio: municipio,
            estado: estado,
            pais: pais,
            correo: data.correo,
            foto: data.foto,
            estadoCliente: data.estadoCliente,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default ModificacionIntegracionVentasGastos;
