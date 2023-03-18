import { useState } from 'react';
import { eliminaUsuario } from "../../../api/usuarios";
import { toast } from "react-toastify";
import queryString from "query-string";
import { Button, Col, Form, Row, Spinner, Alert } from "react-bootstrap";
import { eliminaStatusMaterial } from "../../../api/statusMaterial";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

function EliminaReporte(props) {
    const { datosStatus, datos, setShowModal, history } = props;
    const { id, folio, fecha, loteInspeccion, etiqueta } = datosStatus;

    //console.log(datosPedido)

    // Para cancelar la actualizacion
    const cancelarEliminacion = () => {
        setShowModal(false)
    }


    // Para almacenar datos del formulario
    const [formData, setFormData] = useState(initialFormData(datosStatus));

    // Para determinar el uso de la animacion
    const [loading, setLoading] = useState(false);

    const onSubmit = e => {
        e.preventDefault();

        setLoading(true);
        //console.log(dataTemp)

        try {
            eliminaStatusMaterial(id).then(response => {
                const { data } = response;
                // console.log(data)
                toast.success(data.mensaje)
                LogsInformativos("Se ha eliminado el status del material con el folio " + folio, datosStatus);
                setShowModal(false);
                history({
                    search: queryString.stringify(""),
                });
            })
        } catch (e) {
            console.log(e)
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Form onSubmit={onSubmit} onChange={onChange}>

                <Alert variant="danger">
                    <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                    <p className="mensaje">
                        Esta acción eliminara del sistema el status del material.
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
                            Fecha de entrega
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={fecha}
                            disabled
                        />
                    </Form.Group>
                </Row>

                <br />

                <Row>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Lote
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={loteInspeccion}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Etiqueta
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={etiqueta}
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

function initialFormData(data) {
    const { nombre, apellidos } = data;

    return {
        nombre: nombre,
        apellidos: apellidos
    }
}

export default EliminaReporte;
