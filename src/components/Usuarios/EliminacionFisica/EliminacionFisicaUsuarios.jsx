import { useState, useEffect } from 'react';
import { deshabilitaUsuario, eliminaUsuario } from "../../../api/usuarios";
import { toast } from "react-toastify";
import queryString from "query-string";
import { Button, Col, Form, Row, Spinner, Alert } from "react-bootstrap";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

function EliminacionFisicaUsuarios(props) {
    const { dataUsuario, setShowModal, history } = props;
    const { id, nombre, apellidos, telefonoCelular, departamento, correo, estadoUsuario } = dataUsuario;

    // Para almacenar datos del formulario
    const [formData, setFormData] = useState(initialFormData(dataUsuario));

    // Para determinar el uso de la animacion
    const [loading, setLoading] = useState(false);

    // Para cancelar la actualizacion
    const cancelarEliminacion = () => {
        setShowModal(false)
    }

    const onSubmit = e => {
        e.preventDefault();

        setLoading(true);

        const dataTemp = {
            estadoUsuario: estadoUsuario === "false" ? "true" : "false"
        }
        //console.log(dataTemp)

        try {
            eliminaUsuario(id).then(response => {
                const { data } = response;
                //console.log(data)
                toast.success(data.status);
                LogsInformativos("Se ha eliminado el usuario " + formData.nombre, dataUsuario);
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
                        Esta acción eliminara del sistema al usuario.
                    </p>
                </Alert>

                <Row>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Nombre
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={nombre + " " + apellidos}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Telefono celular
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={telefonoCelular}
                            disabled
                        />
                    </Form.Group>
                </Row>

                <br />

                <Row>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Departamento
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={departamento}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Correo
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={correo}
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

export default EliminacionFisicaUsuarios;
