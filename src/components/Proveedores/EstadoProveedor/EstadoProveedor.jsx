import { useState, useEffect } from 'react';
import {Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {deshabilitaProveedores} from "../../../api/proveedores";
import {toast} from "react-toastify";
import {LogsInformativos} from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";

function EstadoProveedor(props) {
    const { dataProveedor, history, setShowModal } = props;
    const { id, folio, nombre, estado } = dataProveedor;

    const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const dataTemp = {
                estado: estado === "true" ? "false" : "true"
            }

            deshabilitaProveedores(id, dataTemp).then(response => {
                const { data } = response;
                toast.success(data.mensaje)
                setLoading(false)
                LogsInformativos(`Se ha cambiado el status del proveedor con folio ${folio}`, data)
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
                {/* ID proveedor, nombre/servicio */}
                <Row className="mb-3">
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
                                title=""
                                variant="success"
                                className="registrar"
                            >
                                {!loading ? "Cambia su estado" : <Spinner animation="border" />}
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                variant="danger"
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

export default EstadoProveedor;
