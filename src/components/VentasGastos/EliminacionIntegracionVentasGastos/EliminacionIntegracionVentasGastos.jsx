import { useState, useEffect } from 'react';
import {eliminaIntegraciones} from "../../../api/integracionVentasGastos";
import {toast} from "react-toastify";
import {LogsInformativos} from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";
import {Button, Form, Spinner, Alert, Row, Col} from "react-bootstrap";

function EliminacionIntegracionVentasGastos(props) {
    const { data, setShowModal, history } = props;
    const { id, folio, importe, iva, total  } = data;

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
           eliminaIntegraciones(id).then(response => {
                const { data } = response;
                // console.log(data)
                toast.success(data.mensaje)
                LogsInformativos("Se ha eliminado la integracion de ventas y gastos con el folio " + folio, data);
                setShowModal(false);
                setLoading(false);
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
                    Esta acción eliminara la integracion de ventas y gastos.
                </p>
            </Alert>

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
                            Importe
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={importe}
                            disabled
                        />
                    </Form.Group>
                </Row>

                <br/>

                <Row>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Numero de pedido
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={iva}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Fecha de elaboracion
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

export default EliminacionIntegracionVentasGastos;
