import { useState, useEffect } from 'react';
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { toast } from "react-toastify";
import queryString from "query-string";
import { Button, Col, Form, Row, Spinner, Alert } from "react-bootstrap";
import { cambiaEstadoProductosMatriz } from "../../../api/matrizProductos";

function EstadoMatrizProductos(props) {
    const { dataProducto, location, history, setShowModal } = props;
    const { id, descripcion, noInterno, estado } = dataProducto;

    // Para determinar el uso de la animacion
    const [loading, setLoading] = useState(false);

    // Para cancelar la actualizacion
    const cancelarEliminacion = () => {
        setShowModal(false)
    }

    const onSubmit = e => {
        e.preventDefault()
        setLoading(true)

        try {
            const dataTemp = {
                estado: estado === "true" ? "false" : "true"
            }
            cambiaEstadoProductosMatriz(id, dataTemp).then(response => {
                const { data } = response;
                //console.log(data)
                LogsInformativos("El producto de la matriz con no. interno " + noInterno + " cambio su estado a " + dataTemp.estado, dataTemp)
                toast.success(data.mensaje);
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
                {estado == "true" ? (
                    <>
                        <Alert variant="danger">
                            <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                            <p className="mensaje">
                                Esta acción deshabilitara del sistema el producto.
                            </p>
                        </Alert>
                    </>
                ) : (
                    <>
                        <Alert variant="success">
                            <Alert.Heading>Atención! Acción constructiva!</Alert.Heading>
                            <p className="mensaje">
                                Esta acción activara en el sistema el producto.
                            </p>
                        </Alert>
                    </>
                )
                }
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
                            title={estado == "true" ? "Desactivar" : "Activar"}
                            variant="success"
                            className="registrar"
                        >
                            {!loading ? estado == "true" ? "Desactivar" : "Activar" : <Spinner animation="border" />}
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

export default EstadoMatrizProductos;
