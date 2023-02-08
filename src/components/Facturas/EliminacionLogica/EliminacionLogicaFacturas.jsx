import { useState, useEffect } from 'react';
import queryString from "query-string";
import "./EliminacionLogicaFacturas.scss";
import { Button, Col, Form, Row, Spinner, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { actualizaEstadoFactura } from "../../../api/facturas";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { LogTrackingActualizacion } from "../../Tracking/Gestion/GestionTracking";

function EliminacionLogicaFacturas(props) {
    const { datos, setShowModal, history } = props;
    const { id, folio, ordenVenta, nombreCliente, nombreContacto, estado } = datos;

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
            actualizaEstadoFactura(id, dataTemp).then(response => {
                const { data } = response;
                //console.log(data)
                toast.success(data.mensaje);
                LogsInformativos("Se ha cancelado la factura " + folio, datos);
                //LogTrackingActualizacion(folio, "Cancelación", "0");
                setShowModal(false);
                history.push({
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
                        Esta acción cancelara la cuenta por cobrar.
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
                            Orden de venta
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={ordenVenta}
                            disabled
                        />
                    </Form.Group>
                </Row>

                <br />

                <Row>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Cliente
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={nombreCliente}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Contacto
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={nombreContacto}
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

export default EliminacionLogicaFacturas;
