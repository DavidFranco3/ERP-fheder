import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Spinner, Alert } from "react-bootstrap";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { toast } from "react-toastify";
import queryString from "query-string";
import { eliminaProductosMatriz } from "../../../api/matrizProductos";

function EliminaMatrizProductos(props) {
    const { dataProducto, location, setShowModal, history } = props;
    const { id, noInterno, descripcion } = dataProducto;

    const [loading, setLoading] = useState(false);

    // Para cancelar la actualizacion
    const cancelarEliminacion = () => {
        setShowModal(false)
    }

    const onSubmit = e => {
        e.preventDefault()
        setLoading(true)
        try {
            eliminaProductosMatriz(id).then(response => {
                const { data } = response;
                setLoading(false)
                LogsInformativos("El producto de la matriz con no. interno " + noInterno + " fue eliminado", dataProducto)
                toast.success(data.mensaje)
                setLoading(false);
                setShowModal(false);
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
            <Form onSubmit={onSubmit}>
                <Alert variant="danger">
                    <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                    <p className="mensaje">
                        Esta acción eliminara del sistema el producto.
                    </p>
                </Alert>
                <Row>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Numero interno
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={noInterno}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Descripcion
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={descripcion}
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
        </>
    );
}

export default EliminaMatrizProductos;
