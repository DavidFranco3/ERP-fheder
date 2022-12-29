import { useState, useEffect } from 'react';
import {Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {toast} from "react-toastify";
import {actualizaProveedores} from "../../../api/proveedores";
import {LogsInformativos} from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";

function ModificaProveedores(props) {
    const { dataProveedor, history, setShowModal} = props;
    const { id, folio, nombre, tipo, productoServicio, categoria, personalContacto, telefono, correo, tiempoCredito,tiempoRespuesta, lugarRecoleccion, horario, comentarios } = dataProveedor;

    // Para almacenar la informacion
    const [formData, setFormData] = useState(initialFormData(dataProveedor));

    // Para controlar la animación
    const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault()

        if (!formData.nombre || !formData.productoServicio || !formData.categoria || !formData.personalContacto || !formData.telefono || !formData.correo || !formData.tiempoCredito || !formData.tiempoRespuesta || !formData.lugarRecoleccion || !formData.horario || !formData.comentarios) {
            toast.warning("Completa el formulario");
        } else {
            setLoading(true)
            try {
                actualizaProveedores(id, formData).then(response => {
                    const { data } = response;
                    toast.success(data.mensaje)
                    LogsInformativos("Se ha modificado la información del proveedor " + formData.nombre, formData)
                    setLoading(false)
                    history.push({
                        search: queryString.stringify(""),
                    });
                    setShowModal(false)
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

    const cierraModal = () => {
        setShowModal(false)
    }

    return (
        <>
            <Form onSubmit={onSubmit} onChange={onChange}>

                {/* ID proveedor, nombre/servicio, tipo */}
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridFolio">
                        <Form.Label>
                            Folio
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="folio"
                            defaultValue={formData.folio}
                            disabled
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridNombre">
                        <Form.Label>
                            Nombre del proveedor
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre"
                            placeholder="Escribe el nombre"
                            defaultValue={formData.nombre}
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridHorario">
                        <Form.Label>
                            Horario
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="horario"
                            placeholder="Escribe el horario"
                            defaultValue={formData.horario}
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridTipo">
                        <Form.Label>
                            Categoría
                        </Form.Label>
                        <Form.Control
                            as="select"
                            name="categoria"
                            defaultValue={formData.categoria}
                        >
                            <option>Elige....</option>
                            <option value="Materia Prima">Materia Prima</option>
                            <option value="Insumos">Insumos</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridProductoServicio">
                        <Form.Label>
                            Producto/Servicio que proporciona
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="productoServicio"
                            placeholder="Escribe el producto o servicio"
                            defaultValue={formData.productoServicio}
                        />
                    </Form.Group>
                </Row>
                {/* Producto o servicio */}
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridPersonalContacto">
                        <Form.Label>
                            Personal de contacto
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="personalContacto"
                            placeholder="Escribe el personal de contacto"
                            defaultValue={formData.personalContacto}
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridTiempoCredito">
                        <Form.Label>
                            Tiempo de credito
                        </Form.Label>
                        <Form.Control
                            type="number"
                            min="0"
                            name="tiempoCredito"
                            placeholder="Escribe el tiempo"
                            defaultValue={formData.tiempoCredito}
                        />
                    </Form.Group>

                </Row>
                {/* Personal de contacto, telefono, Email */}
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridTelefono">
                        <Form.Label>
                            Telefono
                        </Form.Label>
                        <Form.Control
                            type="number"
                            min="0"
                            name="telefono"
                            placeholder="Escribe el telefono"
                            defaultValue={formData.telefono}
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridCorreo">
                        <Form.Label>
                            Correo
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="correo"
                            placeholder="Escribe el correo"
                            defaultValue={formData.correo}
                        />
                    </Form.Group>

                </Row>
                {/* Tiempo credito, tiempo respuesta, Lugar de recoleccion */}
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridTiempoRespuesta">
                        <Form.Label>
                            Tiempo de respuesta
                        </Form.Label>
                        <Form.Control
                            type="number"
                            min="0"
                            name="tiempoRespuesta"
                            placeholder="Escribe el tiempo"
                            defaultValue={formData.tiempoRespuesta}
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridLugarRecoleccion">
                        <Form.Label>
                            Lugar de recolección
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="lugarRecoleccion"
                            placeholder="Escribe el lugar de recolección"
                            defaultValue={formData.lugarRecoleccion}
                        />
                    </Form.Group>
                </Row>
                {/*  horario, comentarios */}
                <Row className="mb-3">

                    <Form.Group as={Col} controlId="formGridComentarios">
                        <Form.Label>Comentarios</Form.Label>
                        <Form.Control as="textarea" rows={3}
                            type="text"
                            placeholder="Escribe los comentarios"
                            name="comentarios"
                            defaultValue={formData.comentarios}
                        />
                    </Form.Group>

                </Row>

                {/* Botones de acciones */}
                <Form.Group as={Row} className="botones">
                    <Row>
                        <Col>
                            <Button
                                type="submit"
                                title="Actualizar el registro"
                                variant="success"
                                className="registrar"
                            >
                                {!loading ? "Modifica la información" : <Spinner animation="border" />}
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                variant="danger"
                                title="Cerrar el formulario"
                                className="registrar"
                                onClick={() => {
                                    cierraModal()
                                }}
                            >
                                Cancelar
                            </Button>
                        </Col>
                    </Row>
                </Form.Group>

            </Form>
        </>
    );
}

function initialFormData(data){
    const { folio, nombre, tipo, productoServicio, categoria, personalContacto, telefono, correo, tiempoCredito,tiempoRespuesta, lugarRecoleccion, horario, comentarios } = data;

    return {
        folio: folio,
        nombre: nombre,
        productoServicio: productoServicio,
        categoria: categoria,
        personalContacto: personalContacto,
        telefono: telefono,
        correo: correo,
        tiempoCredito: tiempoCredito,
        tiempoRespuesta: tiempoRespuesta,
        lugarRecoleccion: lugarRecoleccion,
        horario: horario,
        comentarios: comentarios
    }
}

export default ModificaProveedores;
