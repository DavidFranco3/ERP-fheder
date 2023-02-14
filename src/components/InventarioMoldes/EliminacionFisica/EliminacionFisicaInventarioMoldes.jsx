import { useState, useEffect } from 'react';
import queryString from "query-string";
import "./EliminacionFisicaInventarioMoldes.scss";
import { Button, Col, Form, Row, Spinner, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { eliminaInventarioMolde } from "../../../api/inventarioMoldes";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

function EliminacionFisicaInventarioMoldes(props) {
    const { datos, setShowModal, history } = props;
    const { id, noInterno, noMolde, noParte, descripcion } = datos;

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
            eliminaInventarioMolde(id).then(response => {
                const { data } = response;
                //console.log(data)
                toast.success(data.mensaje);
                LogsInformativos("Se ha eliminado el inventario del molde " + noInterno, datos);
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
                        Esta acción eliminara del sistema el inventario del molde.
                    </p>
                </Alert>

                <Row>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            # Interno
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={noInterno}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            # Molde
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={noMolde}
                            disabled
                        />
                    </Form.Group>
                </Row>

                <br />

                <Row>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            # Parte
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={noParte}
                            disabled
                        />
                    </Form.Group>
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

export default EliminacionFisicaInventarioMoldes;
