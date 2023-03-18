import { useState } from 'react';
import queryString from "query-string";
import "./EliminacionLogicaUsuarios.scss";
import { Button, Col, Form, Row, Spinner, Alert } from "react-bootstrap";
import { eliminaDepartamento } from "../../../api/departamentos";
import { toast } from "react-toastify";
import { deshabilitaUsuario } from "../../../api/usuarios";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

function EliminacionLogicaUsuarios(props) {
    const { dataUsuario, setShowModal, history } = props;
    const { id, nombre, apellidos, telefonoCelular, departamento, correo, estadoUsuario } = dataUsuario;

    //console.log(dataUsuario)

    // Para almacenar datos del formulario
    const [formData, setFormData] = useState(initialFormData(dataUsuario));

    // Para determinar el uso de la animacion
    const [loading, setLoading] = useState(false);

    // Para cancelar el registro
    const cancelar = () => {
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
            deshabilitaUsuario(id, dataTemp).then(response => {
                const { data } = response;
                //console.log(data)
                toast.success(data.mensaje);
                LogsInformativos("Se ha actualizado el estado del usuario " + formData.nombre, dataUsuario);
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

                {estadoUsuario == "true" ?
                    (
                        <>
                            <Alert variant="danger">
                                <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                                <p className="mensaje">
                                    Esta acción deshabilitara en el sistema al usuario.
                                </p>
                            </Alert>
                        </>
                    ) : (
                        <>
                            <Alert variant="success">
                                <Alert.Heading>Atención! Acción contructiva!</Alert.Heading>
                                <p className="mensaje">
                                    Esta acción habilitara en el sistema al usuario.
                                </p>
                            </Alert>
                        </>
                    )
                }

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
                            variant="success"
                            title={estadoUsuario === "true" ? "Deshabilitar" : "Habilitar"}
                            type="submit"
                            className="registrar">
                            {!loading ? (estadoUsuario === "true" ? "Deshabilitar" : "Habilitar") : <Spinner animation="border" />}
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            variant="danger"
                            title="Cerrar el formulario"
                            className="cancelar"
                            onClick={() => {
                                cancelar()
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

export default EliminacionLogicaUsuarios;
