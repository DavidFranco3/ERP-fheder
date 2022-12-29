import { useState, useEffect } from 'react';
import {eliminaInspeccion} from "../../../api/inspeccionMaterial";
import {toast} from "react-toastify";
import {LogsInformativos} from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";
import {Button, Form, Spinner, Alert, Row, Col} from "react-bootstrap";

function EliminaReporte(props) {
    const { data, setShowModal, history } = props;
    const { id, folio, lote, propiedad, tipoMaterial } = data;

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
            eliminaInspeccion(id).then(response => {
                const { data } = response;
                // console.log(data)
                toast.success(data.mensaje)
                LogsInformativos("Se ha eliminado la inspeccion de calidad de material con el folio " + folio, data);
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
                    Esta acción eliminara del sistema la compra.
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
                            Lote
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={lote}
                            disabled
                        />
                    </Form.Group>
                </Row>

                <br />

                <Row>
                <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Propiedad
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={propiedad}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Tipo material
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={tipoMaterial}
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

export default EliminaReporte;
