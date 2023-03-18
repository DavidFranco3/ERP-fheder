import { useState } from 'react';
import queryString from "query-string";
import "./EliminacionLogicaPlaneacion.scss";
import { Button, Col, Form, Row, Spinner, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { cambiaStatusRequerimiento } from "../../../api/requerimientosPlaneacion";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

function EliminacionLogicaPlaneacion(props) {
    const { datos, setShowModal, history } = props;
    const { id, folio, requerimiento, estado } = datos

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
            cambiaStatusRequerimiento(id, dataTemp).then(response => {
                const { data } = response;
                //console.log(data)
                toast.success(data.mensaje);
                LogsInformativos("Se ha cancelado la planeación " + folio, datos);
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
                        Esta acción cancelara la planeación.
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
                            Semana
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={requerimiento.semana}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Total a producir
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={requerimiento.totalProducir}
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
                            {!loading ? "Cancelar" : <Spinner animation="border" />}
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

export default EliminacionLogicaPlaneacion;
