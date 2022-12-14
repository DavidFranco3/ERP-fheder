import { useState, useEffect } from 'react';
import { eliminaMateriaPrima } from "../../../api/materiaPrima";
import { Button, Col, Form, Row, Spinner, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import queryString from "query-string";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

function EliminaMateriasPrimas(props) {
    const { dataMaterial, location, history, setShowModal } = props;
    const { id, folio, descripcion, um, precio } = dataMaterial;

    // Para controlar la animacion de carga
    const [loading, setLoading] = useState(false);

    // Para cancelar la actualizacion
    const cancelarEliminacion = () => {
        setShowModal(false)
    }

    const onSubmit = e => {
        e.preventDefault()

        setLoading(true)
        try {
            eliminaMateriaPrima(id).then(response => {
                const { data } = response;
                LogsInformativos("El material con descripción " + descripcion + " fue eliminado")
                toast.success(data.mensaje)
                setLoading(false)
                setShowModal(false)
                history.push({
                    search: queryString.stringify(""),
                });
            }).catch(e => {
                // console.log(e)
            })
        } catch (e) {
            // console.log(e)
        }
    }

    return (
        <>
            <div className="formularioDatos">
                <Form onSubmit={onSubmit}>
                    <Alert variant="danger">
                        <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                        <p className="mensaje">
                            Esta acción eliminara del sistema la materia prima.
                        </p>
                    </Alert>
                    <Row>
                        <Form.Group as={Col} controlId="formHorizontalDescripcion">
                            <Form.Label>
                                Folio
                            </Form.Label>
                            <Form.Control
                                type="text"
                                defaultValue={folio}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formHorizontalDescripcion">
                            <Form.Label>
                                Descripción
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe la descripcion"
                                name="descripcion"
                                defaultValue={descripcion}
                                disabled
                            />
                        </Form.Group>
                    </Row>

                    <br/>

                    <Row>
                        <Form.Group as={Col} controlId="formHorizontalDescripcion">
                            <Form.Label>
                                UM
                            </Form.Label>
                            <Form.Control
                                type="text"
                                defaultValue={um}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formHorizontalDescripcion">
                            <Form.Label>
                                Descripción
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe la descripcion"
                                name="descripcion"
                                defaultValue={precio}
                                disabled
                            />
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

export default EliminaMateriasPrimas;
