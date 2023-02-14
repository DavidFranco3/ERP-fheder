import { useState, useEffect } from 'react';
import { eliminaUsuario } from "../../../api/usuarios";
import { toast } from "react-toastify";
import queryString from "query-string";
import { Button, Col, Form, Row, Spinner, Alert } from "react-bootstrap";
import { eliminaPedidoVenta } from "../../../api/pedidoVenta";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { LogTrackingEliminacion } from "../../Tracking/Gestion/GestionTracking";

function EliminacionFisicaVentas(props) {
    const { datos, setShowModal, history } = props;
    const { id, folio, condicionesPago, numeroPedido, fechaElaboracion, } = datos;

    //console.log(datosPedido)

    // Para cancelar la actualizacion
    const cancelarEliminacion = () => {
        setShowModal(false)
    }

    // Para determinar el uso de la animacion
    const [loading, setLoading] = useState(false);

    const onSubmit = e => {
        e.preventDefault();

        setLoading(true);
        //console.log(dataTemp)

        try {
            eliminaPedidoVenta(id).then(response => {
                const { data } = response;
                // console.log(data)
                toast.success(data.mensaje)
                LogsInformativos("Se ha eliminado la venta con el folio " + folio, datos)
                LogTrackingEliminacion(folio)
                setShowModal(false);
                setLoading(false);
                history({
                    search: queryString.stringify(""),
                });
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
                        Esta acción eliminara del sistema la venta.
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
                            condiciones de pago
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={condicionesPago}
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
                            value={numeroPedido}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Fecha de elaboracion
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={fechaElaboracion}
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

export default EliminacionFisicaVentas;
