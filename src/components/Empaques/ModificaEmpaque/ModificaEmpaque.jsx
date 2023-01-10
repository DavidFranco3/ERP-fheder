import { useState, useEffect } from 'react';
import { actualizaEmpaque } from "../../../api/empaques";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import queryString from "query-string";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

function ModificaEmpaque(props) {
    const { dataEmpaque, location, history, setShowModal } = props;
    const { id, folio, nombre } = dataEmpaque;

    // Para controlar la animacion de carga
    const [loading, setLoading] = useState(false);

    // Cancelar y cerrar el formulario
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData(dataEmpaque));

    const onSubmit = e => {
        e.preventDefault();
        //console.log(formData)

        if (!formData.nombre || !formData.precio || !formData.um) {
            toast.warning("Comapleta el formulario")
        } else {
            setLoading(true)
            try {
                actualizaEmpaque(id, formData).then(response => {
                    const { data } = response;
                    LogsInformativos("El empaque con nombre: " + nombre + " fue modificado", formData)
                    toast.success(data.mensaje)
                    setLoading(false)
                    setShowModal(false)
                    history.push({
                        search: queryString.stringify(""),
                    });
                }).catch(e => {
                    console.log(e)
                })
            } catch (e) {
                console.log(e)
            }
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <>
            <div className="formularioDatos">
                <Form onChange={onChange} onSubmit={onSubmit}>
                    <Row className="mb-3">
                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                        <Col sm="2">
                                <Form.Label align="center">
                                    Folio
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Folio"
                                    name="folio"
                                    value={formData.folio}
                                    disabled
                                />
                            </Col>
                            
                            <Col sm="2">
                                <Form.Label align="center">
                                    Nombre
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Nombre"
                                    name="nombre"
                                    defaultValue={formData.nombre}
                                />
                            </Col>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                                <Form.Label align="center">
                                    UM
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    as="select"
                                    name="um"
                                    defaultValue={formData.um}
                                >
                                    <option >Elige....</option>
                                    <option value="KG" selected="KG">KG</option>
                                    <option value="Litros" selected="Litros">Litros</option>
                                    <option value="Piezas" selected="Piezas">Pieza</option>
                                    <option value="Otros" selected="Otros">Otros</option>
                                </Form.Control>
                            </Col>
                            <Col sm="2">
                                <Form.Label align="center">
                                    Precio
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Precio"
                                    name="precio"
                                    defaultValue={formData.precio}
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
                                {!loading ? "Modificar" : <Spinner animation="border" />}
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                variant="danger"
                                title="Cerrar el formulario"
                                className="Cerrar el formulario"
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
        </>
    );
}

function initialFormData(data) {
    const { id, folio, nombre, precio, um } = data;

    return {
        folio: folio,
        nombre: nombre,
        precio: precio,
        um: um,
    }
}

function formatModelProveedores(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            nombre: data.nombre,
            tipo: data.tipo,
            productoServicio: data.productoServicio,
            categoria: data.categoria,
            personalContacto: data.personalContacto,
            telefono: data.telefono,
            correo: data.correo,
            tiempoCredito: data.tiempoCredito,
            tiempoRespuesta: data.tiempoRespuesta,
            lugarRecoleccion: data.lugarRecoleccion,
            horario: data.horario,
            comentarios: data.comentarios,
            estado: data.estado,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}


export default ModificaEmpaque;
