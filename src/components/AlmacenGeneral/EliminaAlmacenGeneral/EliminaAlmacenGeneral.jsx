import { useState, useEffect } from 'react';
import {Alert, Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {toast} from "react-toastify";
import {eliminaAlmacenGeneral} from "../../../api/almacenGeneral";
import {LogsInformativos} from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";

function ModificarAlmacenGeneral(props) {
    const { datos, setShowModal, location, history } = props;
    // console.log(datos)
    const { id, folioAlmacen, nombre, descripcion, um, tipo, estado } = datos;

    // Para controlar la animación
    const [loading, setLoading] = useState(false);

    // Para cancelar la actualizacion
    const cancelarEliminacion = () => {
        setShowModal(false)
    }

    const onSubmit = (e) => {
        e.preventDefault()

        setLoading(true)
        try {
            eliminaAlmacenGeneral(id).then(response => {
                const { data } = response;
                toast.success(data.mensaje)
                setLoading(false)
                LogsInformativos("Se ha eliminado del almacen de materia prima el articulo con folio " + folioAlmacen, datos)
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

    return (
        <>
            <div className="contenidoFormularioPrincipal">
            
            <Alert variant="danger">
                <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                <p className="mensaje">
                    Si elimina esta materia prima no se tendrá registro de existencias del artículo y sus movimientos.
                </p>
            </Alert>
            
                <Form onSubmit={onSubmit}>
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
                            defaultValue={nombre}
                            disabled
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
                                defaultValue={descripcion}
                                required
                                disabled
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
                                defaultValue={um}
                                disabled
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
                                defaultValue={tipo}
                                disabled
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
                                defaultValue={estado}
                                disabled
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
                                title="Eliminar el registro"
                                variant="success"
                                className="registrar"
                            >
                                {!loading ? "Eliminar" : <Spinner animation="border" />}
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                variant="danger"
                                title="Cerrar el formulario"
                                className="cancelar"
                                onClick={() => {
                                    cancelarEliminacion()
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

export default ModificarAlmacenGeneral;
