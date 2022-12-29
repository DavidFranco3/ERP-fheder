import { useState, useEffect } from 'react';
import "./EliminaAlmacenPT.scss"
import {Alert, Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {eliminaAlmacenPT} from "../../../api/almacenPT";
import {toast} from "react-toastify";
import {LogsInformativos} from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";

function EliminaAlmacenPt(props) {
    const { datos, setShowModal, location, history } = props;
    // console.log(datos)
    const { id, folioAlmacen, folioMP, nombre, descripcion } = datos;

    // Para controlar la animacion de carga
    const [loading, setLoading] = useState(false);

    const cierraModal = () => {
        setShowModal(false)
    }

    const onSubmit = (e) => {
        e.preventDefault()

        setLoading(true)
        try {
            eliminaAlmacenPT(id).then(response => {
                const { data } = response;
                toast.success(data.mensaje)
                setLoading(false)
                LogsInformativos("Se ha eliminado del almacen de materia prima el articulo con folio " + folioMP, datos)
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

    return (
        <>
            <Alert variant="danger">
                <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                <p className="mensaje">
                    Si elimina esta materia prima no se tendrá registro de existencias del artículo y sus movimientos.
                </p>
            </Alert>

            <Form onSubmit={onSubmit}>
                {/* ID proveedor, orden de venta */}
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridFolioAlmacen">
                        <Form.Label>
                            Folio del almacen
                        </Form.Label>
                        <Form.Control
                            type="text"
                            defaultValue={folioAlmacen}
                            disabled
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridFolioMP">
                        <Form.Label>
                            Folio de la Materia Prima
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre"
                            defaultValue={folioMP}
                            disabled
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridFolio">
                        <Form.Label>
                            Nombre
                        </Form.Label>
                        <Form.Control
                            type="text"
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

export default EliminaAlmacenPt;
