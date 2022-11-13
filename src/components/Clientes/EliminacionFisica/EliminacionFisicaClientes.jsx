import {useState} from 'react';
import {deshabilitaUsuario} from "../../../api/usuarios";
import {toast} from "react-toastify";
import queryString from "query-string";
import {Button, Col, Form, Row, Spinner, Alert} from "react-bootstrap";
import {eliminaCliente} from "../../../api/clientes";
import {LogsInformativos} from "../../Logs/LogsSistema/LogsSistema";

function EliminacionFisicaClientes(props) {
    const { dataCliente, setShowModal, history } = props;
    const { id } = dataCliente;

    //console.log(dataUsuario)
    
    // Para cancelar la actualizacion
    const cancelarEliminacion = () => {
        setShowModal(false)
    }

    // Para almacenar datos del formulario
    const [formData, setFormData] = useState(initialFormData(dataCliente));

    // Para determinar el uso de la animacion
    const [loading, setLoading] = useState(false);

    const onSubmit = e => {
        e.preventDefault();

        setLoading(true);
        try {
            eliminaCliente(id).then(response => {
                const { data } = response;
                //console.log(data)
                LogsInformativos("El cliente "+ formData.nombre + " " + formData.apellidos +" fue eliminado del sistema", dataCliente)
                toast.success(data.mensaje);
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
                    Esta acción eliminara del sistema al cliente.
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

export default EliminacionFisicaClientes;
