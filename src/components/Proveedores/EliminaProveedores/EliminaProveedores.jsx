import { useState, useEffect } from 'react';
import {Button, Col, Form, Row, Spinner, Alert} from "react-bootstrap";
import {eliminaProveedores} from "../../../api/proveedores";
import {toast} from "react-toastify";
import {LogsInformativos} from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";

function EliminaProveedores(props) {
    const { dataProveedor, history, setShowModal } = props;
    const { id, folio, nombre } = dataProveedor;

    const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault()

        setLoading(true)
        try {
            eliminaProveedores(id).then(response => {
                const { data } = response;
                toast.success(data.mensaje)
                setLoading(false)
                LogsInformativos("Se ha eliminado al proveedor con folio " + folio, dataProveedor)
                history.push({
                    search: queryString.stringify(""),
                });
                setShowModal(false)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    const cierraModal = () => {
        setShowModal(false)
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
            
            <Alert variant="danger">
                <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                <p className="mensaje">
                    Esta acción eliminara del sistema al proveedor.
                </p>
            </Alert>
            
                {/* ID proveedor, nombre/servicio */}
                <Row>
                    <Form.Group as={Col} controlId="formGridFolio">
                        <Form.Label>
                            Folio
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="folio"
                            defaultValue={folio}
                            disabled
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridNombre">
                        <Form.Label>
                            Nombre
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre"
                            defaultValue={nombre}
                            disabled
                        />
                    </Form.Group>
                </Row>

                {/* Botones de acciones */}
                <Form.Group as={Row} className="botones">
                    <Row>
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
                                className="registrar"
                                onClick={() => {
                                    cierraModal()
                                }}
                            >
                                Cancelar
                            </Button>
                        </Col>
                    </Row>
                </Form.Group>
            </Form>
        </>
    );
}

export default EliminaProveedores;
