import { useState, useEffect } from 'react';
import { eliminaProductosOV } from "../../../api/productosOV";
import { toast } from "react-toastify";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";
import { Button, Form, Spinner, Alert, Row, Col } from "react-bootstrap";

function EliminacionProductosOV(props) {
    const { datos, setShowModal, history, setListProductosCargados } = props;
    const { id, descripcion, numeroParte, cantidad, um, precioUnitario, total } = datos;

    //console.log(data)

    // Para cancelar la actualizacion
    const cancelarEliminacion = () => {
        setShowModal(false)
    }

    // Para controlar la animacion de carga
    const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            eliminaProductosOV(id).then(response => {
                const { data } = response;
                // console.log(data)
                //toast.success(data.mensaje)
                //LogsInformativos("Se ha eliminado el mes " + folio, data)
                setListProductosCargados(id)
                setShowModal(false);
                //setLoading(false);
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
                        Esta acción eliminara el producto de la Orden de Venta.
                    </p>
                </Alert>

                <Row>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Numero de parte
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={numeroParte}
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

                <br />

                <Row>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Cantidad
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={cantidad}
                            disabled
                        />
                    </Form.Group>
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
                </Row>

                <br />

                <Row>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Precio unitario
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={precioUnitario}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Total
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={total}
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

export default EliminacionProductosOV;
