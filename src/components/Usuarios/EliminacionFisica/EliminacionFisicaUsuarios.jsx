import { useState, useEffect } from 'react';
import {deshabilitaUsuario, eliminaUsuario} from "../../../api/usuarios";
import {toast} from "react-toastify";
import queryString from "query-string";
import {Button, Col, Form, Row, Spinner, Alert} from "react-bootstrap";
import {LogsInformativos} from "../../Logs/LogsSistema/LogsSistema";

function EliminacionFisicaUsuarios(props) {
    const { dataUsuario, setShowModal, history } = props;
    const { id, nombre, apellidos, estadoUsuario } = dataUsuario;

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
                LogsInformativos("Se ha eliminado el usuario " + formData.nombre + " " + formData.apellidos)
                setShowModal(false);
                setLoading(false);
                history.push({
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
            
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridNombre">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control type="text"
                                      name="nombre"
                                      disabled={true}
                                      defaultValue={formData.nombre + " " + formData.apellidos}
                        />
                    </Form.Group>
                </Row>

                <Form.Group as={Row} className="botones">
                        <Col>
                            <Button
                                type="submit"
                                variant="success"
                                className="registrar"
                            >
                                {!loading ? "Eliminar" : <Spinner animation="border" />}
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                variant="danger"
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
    const { nombre, apellidos  } = data;

    return {
        nombre: nombre,
        apellidos: apellidos
    }
}

export default EliminacionFisicaUsuarios;
