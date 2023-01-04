import { useState, useEffect } from 'react';
import "./EliminaAlmacenes.scss"
import { Alert, Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { eliminaAlmacenes } from "../../../api/almacenes";
import { toast } from "react-toastify";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";
import { useRouteMatch } from 'react-router-dom';

function EliminaAlmacenes(props) {
    const { datos, setShowModal, location, history } = props;
    // console.log(datos)
    const { id, folio, nombreArticulo, um, cantidadExistencia } = datos;

    // Para controlar la animacion de carga
    const [loading, setLoading] = useState(false);

    const cierraModal = () => {
        setShowModal(false)
    }

    const onSubmit = (e) => {
        e.preventDefault()

        setLoading(true)
        try {
            eliminaAlmacenes(id).then(response => {
                const { data } = response;
                toast.success(data.mensaje)
                setLoading(false)
                LogsInformativos("Se ha eliminado el articulo del almacen " + folio, datos)
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
                    Si elimina este articulo no se tendrá registro de existencias del artículo y sus movimientos.
                </p>
            </Alert>

            <Form onSubmit={onSubmit}>
                {/* ID proveedor, orden de venta */}

                <Row>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Folio
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={folio}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Articulo
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={nombreArticulo}
                            disabled
                        />
                    </Form.Group>
                </Row>

                <br />

                <Row>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            UM
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={um}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Existencia
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={cantidadExistencia}
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

export default EliminaAlmacenes;
