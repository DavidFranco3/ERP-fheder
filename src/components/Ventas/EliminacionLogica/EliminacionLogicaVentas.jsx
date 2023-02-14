import { useState, useEffect } from 'react';
import queryString from "query-string";
import "./EliminacionLogicaVentas.scss";
import { Button, Col, Form, Row, Spinner, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { actualizaEstadoPedidoVenta } from "../../../api/pedidoVenta";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { LogTrackingActualizacion } from "../../Tracking/Gestion/GestionTracking";

function EliminacionLogicaVentas(props) {
    const { datos, setShowModal, history } = props;
    const { id, folio, condicionesPago, numeroPedido, fechaElaboracion, estado } = datos;

    // Para determinar el uso de la animacion
    const [loading, setLoading] = useState(false);

    // Para cancelar el registro
    const cancelar = () => {
        setShowModal(false)
    }

    const onSubmit = e => {
        e.preventDefault();

        setLoading(true);

        const dataTemp = {
            estado: estado === "false" ? "true" : "false"
        }
        //console.log(dataTemp)

        try {
            actualizaEstadoPedidoVenta(id, dataTemp).then(response => {
                const { data } = response;
                //console.log(data)
                toast.success(data.mensaje);
                LogsInformativos("Se ha cancelado la orden de venta " + folio, datos);
                LogTrackingActualizacion(folio, "Cancelación", "0");
                setShowModal(false);
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
                        Esta acción cancelara la orden de venta.
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

                <br />

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
                            variant="success"
                            title={estado === "true" ? "Deshabilitar" : "Habilitar"}
                            type="submit"
                            className="registrar">
                            {!loading ? "Aceptar" : <Spinner animation="border" />}
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            variant="danger"
                            title="Cerrar el formulario"
                            className="cancelar"
                            onClick={() => {
                                cancelar()
                            }}
                        >
                            Cerrar
                        </Button>
                    </Col>
                </Form.Group>
            </Form>
        </>
    );
}

export default EliminacionLogicaVentas;
