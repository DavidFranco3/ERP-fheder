import { useState, useEffect } from 'react';
import {LogsInformativos} from "../../Logs/LogsSistema/LogsSistema";
import {toast} from "react-toastify";
import queryString from "query-string";
import {Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {cambiaEstadoProductosMatriz} from "../../../api/matrizProductos";

function EstadoMatrizProductos(props) {
    const { dataProducto, location, history, setShowModal } = props;
    const { id, descripcion, noInterno, estado } = dataProducto;

    // Para determinar el uso de la animacion
    const [loading, setLoading] = useState(false);

    const onSubmit = e => {
        e.preventDefault()
        setLoading(true)

        try {
            const dataTemp = {
                estado: estado === "true"  ? "false" : "true"
            }
            cambiaEstadoProductosMatriz(id, dataTemp).then(response => {
                const { data } = response;
                //console.log(data)
                if(dataTemp.estado === "true") {
                    LogsInformativos("El producto de la matriz con no. interno "+ noInterno +  " cambio su estado a activo", dataProducto)
                    toast.success("Producto cambio a estado activo");
                }
                if(dataTemp.estado === "false") {
                    LogsInformativos("El producto de la matriz con no. interno "+ noInterno +  " cambio su estado a obsoleto", dataProducto)
                    toast.success("Producto cambio a estado obsoleto");
                }
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
                        <Form.Label>Desea cambiar el estado del producto</Form.Label>
                        <Form.Control type="text"
                                      name="nombre"
                                      disabled={true}
                                      defaultValue={"#" + noInterno + " " + descripcion}
                        />
                    </Form.Group>
                </Row>

                <Form.Group className="btnEliminar">
                    <Button variant="primary" type="submit">
                        {!loading ? (estado === "true" ? "¿Desea cambiar a obsoleto el producto?" : "¿Desea cambiar a activo el producto?") : <Spinner animation="border" />}
                    </Button>
                </Form.Group>
            </Form>
        </>
    );
}

export default EstadoMatrizProductos;
