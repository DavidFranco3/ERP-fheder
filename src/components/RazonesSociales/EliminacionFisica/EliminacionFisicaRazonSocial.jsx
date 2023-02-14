import { useState } from 'react';
import { deshabilitaUsuario } from "../../../api/usuarios";
import { toast } from "react-toastify";
import queryString from "query-string";
import { Button, Col, Form, Row, Spinner, Alert } from "react-bootstrap";
import { eliminaRazonSocial } from "../../../api/razonesSociales";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

function EliminacionFisicaRazonSocial(props) {
    const { dataRazonSocial, setShowModal, history } = props;
    const { id } = dataRazonSocial;

    //console.log(dataUsuario)

    // Para cancelar la actualizacion
    const cancelarEliminacion = () => {
        setShowModal(false)
    }

    // Para almacenar datos del formulario
    const [formData, setFormData] = useState(initialFormData(dataRazonSocial));

    // Para determinar el uso de la animacion
    const [loading, setLoading] = useState(false);

    const onSubmit = e => {
        e.preventDefault();

        setLoading(true);
        try {
            eliminaRazonSocial(id).then(response => {
                const { data } = response;
                //console.log(data)
                LogsInformativos("La razón social " + formData.nombre + " fue eliminada del sistema", dataRazonSocial)
                toast.success(data.mensaje);
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

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Form onSubmit={onSubmit} onChange={onChange}>

                <Alert variant="danger">
                    <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                    <p className="mensaje">
                        Esta acción eliminara del sistema a la razón social.
                    </p>
                </Alert>

                <Row>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Nombre
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.nombre}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Telefono celular
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.telefonoCelular}
                            disabled
                        />
                    </Form.Group>
                </Row>

                <br />

                <Row>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            RFC
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.rfc}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Correo
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.correo}
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
    const { nombre, apellidos, telefonoCelular, rfc, correo } = data;

    return {
        nombre: nombre,
        apellidos: apellidos,
        telefonoCelular: telefonoCelular,
        rfc: rfc,
        correo: correo
    }
}

export default EliminacionFisicaRazonSocial;
