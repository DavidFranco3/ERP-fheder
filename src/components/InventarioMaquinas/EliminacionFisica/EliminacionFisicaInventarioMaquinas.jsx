import { useState, useEffect } from 'react';
import queryString from "query-string";
import "./EliminacionFisicaInventarioMaquinas.scss";
import { Button, Col, Form, Row, Spinner, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { eliminaInventarioMaquina } from "../../../api/inventarioMaquinas";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

function EliminacionFisicaInventarioMaquinas(props) {
    const { datos, setShowModal, history } = props;
    const { id, noMaquina, descripcion, marca, modelo } = datos;

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
            eliminaInventarioMaquina(id).then(response => {
                const { data } = response;
                //console.log(data)
                toast.success(data.mensaje);
                LogsInformativos("Se ha eliminado el inventario de la maquina " + noMaquina, datos);
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
                        Esta acción eliminara del sistema el inventario de la maquina.
                    </p>
                </Alert>

                <Row>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            # de maquina
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={noMaquina}
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

                <br />

                <Row>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Marca
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={marca}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Modelo
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={modelo}
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

export default EliminacionFisicaInventarioMaquinas;
