import { useState, useEffect } from 'react';
import queryString from "query-string";
import "./EliminacionLogicaIntegracion.scss";
import { Button, Col, Form, Row, Spinner, Alert } from "react-bootstrap";
import { eliminaDepartamento } from "../../../api/departamentos";
import { toast } from "react-toastify";
import { actualizaEstadoIntegraciones } from "../../../api/integracionVentasGastos";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

function EliminacionLogicaIntegracion(props) {
    const { data, setShowModal, history } = props;
    const { id, folio, importe, iva, total, estado } = data;

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
            actualizaEstadoIntegraciones(id, dataTemp).then(response => {
                const { data } = response;
                //console.log(data)
                if (dataTemp.estado === "true") {
                    toast.success("Integracion habilitada");
                    LogsInformativos("Se ha habilitado la integracion de ventas y gastos " + folio, dataTemp);
                }
                if (dataTemp.estado === "false") {
                    toast.success("Venta deshabilitada");
                    LogsInformativos("Se ha deshabilitado la integracion de ventas y gastos " + folio, dataTemp);
                }
                setShowModal(false);
                setLoading(false);
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

                {estado == "true" ?
                    (
                        <>
                            <Alert variant="danger">
                                <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                                <p className="mensaje">
                                    Esta acción deshabilitara en el sistema la integracion de ventas y gastos.
                                </p>
                            </Alert>
                        </>
                    ) : (
                        <>
                            <Alert variant="success">
                                <Alert.Heading>Atención! Acción contructiva!</Alert.Heading>
                                <p className="mensaje">
                                    Esta acción habilitara en el sistema la integracion de ventas y gastos.
                                </p>
                            </Alert>
                        </>
                    )
                }

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

                <br />

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
                            variant="success"
                            title={estado === "true" ? "Deshabilitar" : "Habilitar"}
                            type="submit"
                            className="registrar">
                            {!loading ? (estado === "true" ? "Deshabilitar" : "Habilitar") : <Spinner animation="border" />}
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
                            Cancelar
                        </Button>
                    </Col>
                </Form.Group>
            </Form>
        </>
    );
}

export default EliminacionLogicaIntegracion;
