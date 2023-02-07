import { useState, useEffect } from 'react';
import queryString from "query-string";
import "./EliminacionFisicaMantenimientoPreventivo.scss";
import { Button, Col, Form, Row, Spinner, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { eliminaMantenimientoPreventivo } from "../../../api/programaMantenimientoPreventivo";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

function EliminacionFisicaMantenimientoPreventivo(props) {
    const { datos, setShowModal, history } = props;
    const { id, item, ident, descripcion, comentarios } = datos;

    // Para determinar el uso de la animacion
    const [loading, setLoading] = useState(false);

    // Para cancelar el registro
    const cancelar = () => {
        setShowModal(false)
    }

    const onSubmit = e => {
        e.preventDefault();

        setLoading(true);

        try {
            eliminaMantenimientoPreventivo(id).then(response => {
                const { data } = response;
                //console.log(data)
                toast.success(data.mensaje);
                LogsInformativos("Se ha eliminado el programa de mantenimiento preventivo " + ident, datos);
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

                <Alert variant="danger">
                    <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                    <p className="mensaje">
                        Esta acción eliminara del sistema el programa de mantenimiento preventivo.
                    </p>
                </Alert>

                <Row>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Item
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={item}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Ident
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={ident}
                            disabled
                        />
                    </Form.Group>
                </Row>

                <br />

                <Row>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Descripción
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={descripcion}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Comentarios
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={comentarios}
                            disabled
                        />
                    </Form.Group>
                </Row>


                <Form.Group as={Row} className="botones">
                    <Col>
                        <Button
                            variant="success"
                            title={"Eliminar"}
                            type="submit"
                            className="registrar">
                            {!loading ? "Eliminar" : <Spinner animation="border" />}
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

export default EliminacionFisicaMantenimientoPreventivo;
