import { useState } from 'react';
import { toast } from "react-toastify";
import queryString from "query-string";
import { Button, Col, Form, Row, Spinner, Alert } from "react-bootstrap";
import { eliminaPrograma } from "../../../api/programaProduccion";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

function EliminacionFisicaPrograma(props) {
    const { datos, setShowModal, history } = props;
    const { id, folio, folioOP, ordenProduccion } = datos;

    const { fechaInicio, nombreProducto } = ordenProduccion;

    //console.log(datosPedido)

    // Para cancelar la actualizacion
    const cancelarEliminacion = () => {
        setShowModal(false)
    }

    // Para determinar el uso de la animacion
    const [loading, setLoading] = useState(false);

    const onSubmit = e => {
        e.preventDefault();

        setLoading(true);
        //console.log(dataTemp)

        try {
            eliminaPrograma(id).then(response => {
                const { data } = response;
                // console.log(data)
                toast.success(data.mensaje)
                LogsInformativos("Se ha eliminado el programa de produccion con folio " + folio, datos)
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
                        Esta acción eliminara del sistema el programa de produccion.
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
                            Orden de produccion
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={folioOP}
                            disabled
                        />
                    </Form.Group>
                </Row>

                <br/>

                <Row>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Fecha de inicio
                        </Form.Label>
                        <Form.Control
                            type="date"
                            value={fechaInicio}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            producto
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={nombreProducto}
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

export default EliminacionFisicaPrograma;
