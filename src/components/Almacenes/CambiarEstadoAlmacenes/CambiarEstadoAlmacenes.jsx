import { useState, useEffect } from 'react';
import "./CambiarEstadoAlmacenes.scss"
import { Alert, Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { actualizaEstadoAlmacenes } from "../../../api/almacenes";
import { toast } from "react-toastify";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";
import { useRouteMatch } from 'react-router-dom';

function CambiarEstadoAlmacenes(props) {
    const { datos, setShowModal, location, history } = props;
    // console.log(datos)
    const { id, folio, nombreArticulo, um, cantidadExistencia, estado } = datos;

    // Para controlar la animacion de carga
    const [loading, setLoading] = useState(false);

    const cierraModal = () => {
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
            actualizaEstadoAlmacenes(id, dataTemp).then(response => {
                const { data } = response;
                //console.log(data)
                if (dataTemp.estado === "true") {
                    LogsInformativos("El articulo " + nombreArticulo + " se habilito", datos)
                    toast.success(data.mensaje);
                }
                if (dataTemp.estado === "false") {
                    LogsInformativos("El articulo " + nombreArticulo + " se inhabilito", datos)
                    toast.success(data.mensaje);
                }
                setShowModal(false);
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
            {estado == "true" ?
                (
                    <>
                        <Alert variant="danger">
                            <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                            <p className="mensaje">
                                Esta acción deshabilitara en el sistema al articulo.
                            </p>
                        </Alert>
                    </>
                ) : (
                    <>
                        <Alert variant="success">
                            <Alert.Heading>Atención! Acción constructiva!</Alert.Heading>
                            <p className="mensaje">
                                Esta acción habilitara en el sistema al articulo.
                            </p>
                        </Alert>
                    </>)
            }

            <Form onSubmit={onSubmit}>
                {/* ID proveedor, orden de venta */}

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
                            Articulo
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={nombreArticulo}
                            disabled
                        />
                    </Form.Group>
                </Row>

                <br />

                <Row>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            UM
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={um}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Existencia
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={cantidadExistencia}
                            disabled
                        />
                    </Form.Group>
                </Row>

                {/* Botones de acciones */}
                <Form.Group as={Row} className="botones">
                    <Col>
                        <Button
                            type="submit"
                            title="Eliminar información del movimiento"
                            variant="success"
                            className="registrar"
                        >
                            {!loading ? (estado === "true" ? "Deshabilitar" : "Habilitar") : <Spinner animation="border" />}
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            variant="danger"
                            title="Cerrar el formulario"
                            className="cancelar"
                            onClick={() => {
                                cierraModal()
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

export default CambiarEstadoAlmacenes;
