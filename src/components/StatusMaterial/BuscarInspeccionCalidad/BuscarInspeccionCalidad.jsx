import { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Row, Container, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import { useHistory } from "react-router-dom";
import { obtenerDatosInspeccion } from "../../../api/inspeccionMaterial";

const fechaToCurrentTimezone = (fecha) => {
    const date = new Date(fecha)

    date.setMinutes(date.getMinutes() - date.getTimezoneOffset())


    return date.toISOString().slice(0, 16);
}

function BuscarOV(props) {
    const { setShowModal, setFolio, setFecha, setLote, setPropiedad, setTipoMaterial, setNombre, setCantidad, setRecibio, setResultadoFinal } = props;
    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    // Para almacenar la informacion del formulario
    const [formData, setFormData] = useState(initialFormData());

    const [fechaEncontrada, setFechaEncontrada] = useState("");

    const [nombreEncontrado, setNombreEncontrado] = useState("");

    const [loteEncontrado, setLoteEncontrado] = useState("")

    useEffect(() => {
        try {

            obtenerDatosInspeccion(formData.buscar).then(response => {
                const { data } = response;
                const { folio, fecha, nombre, lote, cantidad, propiedad, tipoMaterial, nombreRecibio, resultadoFinalInspeccion } = data;
                setFolio(folio);
                setFecha(fecha);
                setNombre(nombre);
                setLote(lote);
                setCantidad(cantidad);
                setPropiedad(propiedad);
                setTipoMaterial(tipoMaterial);
                setRecibio(nombreRecibio);
                setResultadoFinal(resultadoFinalInspeccion)

                setFechaEncontrada(fecha);
                setNombreEncontrado(nombre)
                setLoteEncontrado(lote);
            }).catch(e => {
                console.log(e)
            })

        } catch (e) {
            console.log(e)
        }
    }, [formData.buscar]);

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
        //setOrdenVenta(formData.buscar);
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
                                        placeholder="fecha"
                                        name="fecha"
                                        value={formData.buscar.length == 4 ? fechaEncontrada : ""}
                                        disabled
                                    />
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nombre"
                                        name="nombre"
                                        value={formData.buscar.length == 4 ? nombreEncontrado : ""}
                                        disabled
                                    />
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="lote"
                                        name="lote"
                                        value={formData.buscar.length == 4 ? loteEncontrado : ""}
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
