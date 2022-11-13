import { useState, useEffect } from 'react';
import {Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {LogsInformativos} from "../../Logs/LogsSistema/LogsSistema";
import {toast} from "react-toastify";
import queryString from "query-string";
import {eliminaProductosMatriz} from "../../../api/matrizProductos";

function EliminaMatrizProductos(props) {
    const { dataProducto, location, setShowModal, history } = props;
    const { id, noInterno, descripcion } = dataProducto;

    const [loading, setLoading] = useState(false);

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
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridNombre">
                        <Form.Label>Datos del producto</Form.Label>
                        <Form.Control type="text"
                                      name="nombre"
                                      disabled={true}
                                      defaultValue={"# " + noInterno + " , " + descripcion}
                        />
                    </Form.Group>
                </Row>

                <Form.Group className="btnEliminar">
                    <Button variant="primary" type="submit">
                        {!loading ? "¿Desea eliminar el producto?" : <Spinner animation="border" />}
                    </Button>
                </Form.Group>
            </Form>
        </>
    );
}

export default EliminaMatrizProductos;
