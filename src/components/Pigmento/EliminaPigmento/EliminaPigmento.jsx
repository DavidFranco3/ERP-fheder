import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Spinner, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import queryString from "query-string";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { eliminaPigmento } from '../../../api/pigmento';

function EliminaPigmento(props) {
    const { dataPigmento, location, history, setShowModal } = props;
    const { id, folio, nombre, um, precio } = dataPigmento;

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
            eliminaPigmento(id).then(response => {
                const { data } = response;
                LogsInformativos("El material con nombre " + nombre + " fue eliminado")
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

    return (
        <>
            <div className="formularioDatos">
                <Form onSubmit={onSubmit}>
                    <Alert variant="danger">
                        <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                        <p className="mensaje">
                            Esta acción eliminara del sistema el pigmento.
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
                                placeholder="Escribe el nombre"
                                name="nombre"
                                defaultValue={nombre}
                                disabled
                            />
                        </Form.Group>
                    </Row>

                    <br />

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
                                Precio
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe el precio"
                                name="precio"
                                defaultValue={precio}
                                disabled
                            />
                        </Form.Group>
                    </Row>

                    <Form.Group as={Row} className="botones">
                        <Col>
                            <Button
                                type="submit"
                                variant="success"
                                className="registrar"
                            >
                                {!loading ? "Eliminar" : <Spinner animation="border" />}
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                variant="danger"
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

export default EliminaPigmento;
