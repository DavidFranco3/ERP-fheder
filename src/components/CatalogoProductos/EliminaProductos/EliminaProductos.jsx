import { useState, useEffect } from 'react';
import {Button, Col, Form, Row, Spinner, Alert} from "react-bootstrap";
import { eliminaProductosCatalogo } from "../../../api/catalogoProductos";
import {toast} from "react-toastify";
import queryString from "query-string";
import {LogsInformativos} from "../../Logs/LogsSistema/LogsSistema";

function EliminaProductos(props) {
    const { dataProducto, location, setShowModal, history } = props;
    const { id, noInterno, descripcion } = dataProducto;

    const [loading, setLoading] = useState(false);
    
    // Para cancelar la actualizacion
    const cancelarEliminacion = () => {
        setShowModal(false)
    }

    const onSubmit = e => {
        e.preventDefault()

        try {
            eliminaProductosCatalogo(id).then(response => {
                const { data } = response;
                LogsInformativos("El producto del catálogo con no. interno " + noInterno + " fue eliminado", dataProducto)
                toast.success(data.status)
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
            
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridNombre">
                        <Form.Label>Datos del producto</Form.Label>
                        <Form.Control type="text"
                                      name="nombre"
                                      disabled={true}
                                      defaultValue={"#" + noInterno + " " + descripcion}
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
        </>
    );
}

export default EliminaProductos;
