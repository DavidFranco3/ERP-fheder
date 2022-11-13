import { useState } from 'react';
import {Button, Col, Form, Row, Spinner, Alert} from "react-bootstrap";
import queryString from "query-string";
import "./EliminacionFisicaPlaneacion.scss"
import {eliminaPlaneacion} from "../../../api/planeacion";
import {toast} from "react-toastify";
import {LogsInformativos} from "../../Logs/LogsSistema/LogsSistema";

function EliminacionFisicaPlaneacion(props) {
    const { datos, location, history, setShowModal } = props;

    // console.log(datos)
    const { id, folio, ordenVenta } = datos;

    // Para desplegar pregunta

    const cierraModal = () => {
        setShowModal(false)
    }

    // Para controlar la animacion de carga
    const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            eliminaPlaneacion(id).then(response => {
                const { data } = response;
                toast.success(data.mensaje)
                setLoading(false)
                LogsInformativos(`Se ha eliminado la planeación con folio ${folio}`, datos)
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
            <Alert variant="danger">
                <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                <p className="mensaje">
                    Si elimina esta planeación se desvinculará la información del tracking.
                </p>
            </Alert>

            <Form onSubmit={onSubmit}>
                {/* ID proveedor, orden de venta */}
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridFolio">
                        <Form.Label>
                            Folio
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="folio"
                            defaultValue={folio}
                            disabled
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridNombre">
                        <Form.Label>
                            Orden de venta
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre"
                            defaultValue={ordenVenta}
                            disabled
                        />
                    </Form.Group>
                </Row>

                {/* Botones de acciones */}
                <Form.Group as={Row} className="botones">
                    <Row>
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

export default EliminacionFisicaPlaneacion;
