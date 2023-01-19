import { useState, useEffect } from 'react';
import { deshabilitaUsuario } from "../../../api/usuarios";
import { toast } from "react-toastify";
import queryString from "query-string";
import { Button, Col, Form, Row, Spinner, Alert } from "react-bootstrap";
import { deshabilitaUM} from "../../../api/unidadesMedida";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

function EliminacionLogicaUnidadesMedida(props) {
    const { history, dataUM, setShowModal } = props;
    const { id, nombre, apellidos, estadoUM } = dataUM;

    //console.log(dataUsuario)

    // Para cancelar el registro
    const cancelar = () => {
        setShowModal(false)
    }

    // Para almacenar datos del formulario
    const [formData, setFormData] = useState(initialFormData(dataUM));

    // Para determinar el uso de la animacion
    const [loading, setLoading] = useState(false);

    const onSubmit = e => {
        e.preventDefault();

        setLoading(true);

        const dataTemp = {
            estadoUM: estadoUM === "false" ? "true" : "false"
        }
        //console.log(dataTemp)

        try {
            deshabilitaUM(id, dataTemp).then(response => {
                const { data } = response;
                //console.log(data)
                    LogsInformativos("El estado de la unidad de medida " + formData.nombre + " se actualizo", dataUM)
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
                {estadoUM == "true" ?
                    (
                        <>
                            <Alert variant="danger">
                                <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                                <p className="mensaje">
                                    Esta acción deshabilitara en el sistema la unidad de medida.
                                </p>
                            </Alert>
                        </>
                    ) : (
                        <>
                            <Alert variant="success">
                                <Alert.Heading>Atención! Acción constructiva!</Alert.Heading>
                                <p className="mensaje">
                                    Esta acción habilitara en el sistema la unidad de medida.
                                </p>
                            </Alert>
                        </>)
                }
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
                </Row>

                <Form.Group as={Row} className="botones">
                    <Col>
                        <Button
                            variant="success"
                            title={estadoUM === "true" ? "Deshabilitar" : "Habilitar"}
                            type="submit"
                            className='registrar'
                        >
                            {!loading ? (estadoUM === "true" ? "Deshabilitar" : "Habilitar") : <Spinner animation="border" />}
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            variant="danger"
                            className="cancelar"
                            title="Cerrar el formulario"
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
    const { nombre } = data;

    return {
        nombre: nombre
    }
}

export default EliminacionLogicaUnidadesMedida;
