import { useState, useEffect } from 'react';
import {eliminaEtiquetasPiezas} from "../../../api/etiquetaPrimeraPieza";
import {toast} from "react-toastify";
import {LogsInformativos} from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";
import {Button, Form, Spinner, Alert, Row, Col} from "react-bootstrap";

function EliminacionEtiquetasPrimeraPieza(props) {
    const { data, setShowModal, history } = props;
    const { id, folio, noMaquina, turno, inspector } = data;

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
           eliminaEtiquetasPiezas(id).then(response => {
                const { data } = response;
                // console.log(data)
                toast.success(data.mensaje)
                LogsInformativos("Se ha eliminado la primera pieza " + folio, data)
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
                    Esta acción eliminara la etiqueta de primera pieza.
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
                            Numero de maquina
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={noMaquina}
                            disabled
                        />
                    </Form.Group>
                </Row>

                <br />

                <Row>
                <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Turno
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={turno}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Inspector
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={inspector}
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

export default EliminacionEtiquetasPrimeraPieza;
