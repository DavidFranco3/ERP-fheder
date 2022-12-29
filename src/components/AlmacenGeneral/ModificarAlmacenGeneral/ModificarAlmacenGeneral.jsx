import { useState, useEffect } from 'react';
import {Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {toast} from "react-toastify";
import {actualizaAlmacenGeneral} from "../../../api/almacenGeneral";
import {LogsInformativos} from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";

function ModificarAlmacenGeneral(props) {
    const { datos, setShowModal, location, history } = props;
    // console.log(datos)
    const { id, folioAlmacen, nombre, descripcion, um, tipo, estado } = datos;

    // Para controlar la animación
    const [loading, setLoading] = useState(false);

    // Para cancelar la actualizacion
    const cancelarActualizacion = () => {
        setShowModal(false)
    }

    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData(datos));

    const onSubmit = (e) => {
        e.preventDefault()

        if(!formData.nombre || !formData.descripcion || !formData.um || !formData.tipo || !formData.estado){
            toast.warning("Completa el formulario")
        } else {
            setLoading(true)
            try {
                // actualizaAlmacenGeneral
                actualizaAlmacenGeneral(id, formData).then(response => {
                    const { data } = response;

                    const { mensaje, datos } = data;
                    toast.success(mensaje)
                    setLoading(false)
                    LogsInformativos("Se ha modificado un articulo en el almacen general " + formData.nombre, formData)
                    history.push({
                        search: queryString.stringify(""),
                    });
                    setShowModal(false)
                }).catch(e => {
                    // console.log(e)
                })
            } catch (e) {
                // console.log(e)
            }
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <>
            <div className="contenidoFormularioPrincipal">
                <Form onChange={onChange} onSubmit={onSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridFolioAG">
                        <Form.Label>
                            Folio
                        </Form.Label>
                        <Form.Control
                            type="text"
                            nombre="folio"
                            defaultValue={folioAlmacen}
                            disabled
                        />
                    </Form.Group>

                    <Form.Group as={Col}>
                        <Form.Label>
                            Nombre
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre"
                            placeholder="Escribe el nombre"
                            defaultValue={formData.nombre}
                        />
                    </Form.Group>
                </Row>
                
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formHorizontalDescripcion" className="descripcionMP">
                        <Form.Label>
                            Descripción
                        </Form.Label>
                        <Col>
                            <Form.Control
                                as="textarea" rows={2}
                                placeholder="Escribe la descripcion"
                                name="descripcion"
                                defaultValue={formData.descripcion}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formHorizontalUnidadMedida" className="unidadMedidaMP">
                        <Form.Label>
                            Unidad de medida
                        </Form.Label>
                        <Col>
                            <Form.Control
                                as="select"
                                name="um"
                                defaultValue={formData.um}
                            >
                                <option >Elige....</option>
                                <option value="KG">KG</option>
                                <option value="Litros">Litros</option>
                                <option value="Piezas">Pieza</option>
                                <option value="Otros">Otros</option>
                            </Form.Control>
                        </Col>
                    </Form.Group>
                </Row>
                
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formHorizontalTipo" className="status">
                        <Form.Label>
                            Tipo
                        </Form.Label>
                        <Col>
                            <Form.Control
                                as="select"
                                name="tipo"
                                defaultValue={formData.tipo}
                            >
                                <option >Elige....</option>
                                <option value="Maquinaria">Maquinaria</option>
                                <option value="Accesorio">Accesorio</option>
                                <option value="Empaque">Empaque</option>
                            </Form.Control>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formHorizontalStatus" className="status">
                        <Form.Label>
                            Estado
                        </Form.Label>
                        <Col>
                            <Form.Control
                                as="select"
                                name="estado"
                                defaultValue={formData.estado}
                            >
                                <option >Elige....</option>
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                            </Form.Control>
                        </Col>
                    </Form.Group>
                </Row>

                    <Form.Group as={Row} className="botones">
                        <Col>
                            <Button
                                type="submit"
                                title="Actualizar información del registro"
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
                                    cancelarActualizacion()
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

function initialFormData(datos) {
    const { id, folioAlmacen, nombre, descripcion, um, tipo, estado } = datos;

    return {
        nombre: nombre,
        descripcion: descripcion,
        um: um,
        tipo: tipo,
        estado: estado
    }
}

export default ModificarAlmacenGeneral;
