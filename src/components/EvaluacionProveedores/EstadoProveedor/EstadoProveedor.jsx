import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Spinner, Alert } from "react-bootstrap";
import { deshabilitaEvaluacionProveedores } from "../../../api/evaluacionProveedores";
import { toast } from "react-toastify";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";

function EstadoProveedor(props) {
    const { dataProveedor, history, setShowModal } = props;
    const { id, folio, nombre, telefono, correo, estado } = dataProveedor;

    const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const dataTemp = {
                estado: estado === "true" ? "false" : "true"
            }

            deshabilitaEvaluacionProveedores(id, dataTemp).then(response => {
                const { data } = response;
                toast.success(data.mensaje)
                LogsInformativos("Se ha cancelado la evaluación del proveedor con folio " + folio, dataTemp)
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
                {estado == "true" ?
                    (
                        <>
                            <Alert variant="danger">
                                <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                                <p className="mensaje">
                                    Esta acción cancelara la evaluación del proveedor.
                                </p>
                            </Alert>
                        </>
                    ) : (
                        <>
                            <Alert variant="success">
                                <Alert.Heading>Atención! Acción contructiva!</Alert.Heading>
                                <p className="mensaje">
                                    Esta acción habilitara en el sistema al proveedor.
                                </p>
                            </Alert>
                        </>
                    )
                }

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

                <Row>
                    <Form.Group as={Col} controlId="formGridFolio">
                        <Form.Label>
                            Telefono
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="telefono"
                            defaultValue={telefono}
                            disabled
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridNombre">
                        <Form.Label>
                            Correo
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="correo"
                            defaultValue={correo}
                            disabled
                        />
                    </Form.Group>
                </Row>


                {/* Botones de acciones */}
                <Form.Group as={Row} className="botones">
                    <Col>
                        <Button
                            type="submit"
                            title=""
                            variant="success"
                            className="registrar"
                        >
                            {!loading ? "Aceptar" : <Spinner animation="border" />}
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
                            Cerrar
                        </Button>
                    </Col>
                </Form.Group>
            </Form>
        </>
    );
}

export default EstadoProveedor;
