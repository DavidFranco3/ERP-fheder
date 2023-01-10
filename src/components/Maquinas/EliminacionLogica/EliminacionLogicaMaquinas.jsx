import { useState, useEffect } from 'react';
import queryString from "query-string";
import "./EliminacionLogicaMaquinas.scss";
import { Button, Col, Form, Row, Spinner, Alert } from "react-bootstrap";
import { actualizaEstadoMaquina } from "../../../api/maquinas";
import { toast } from "react-toastify";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

function EliminacionLogicaMaquinas(props) {
    const { data, setShowModal, history } = props;
    const { id, numeroMaquina, marca, nombre, lugar, status } = data;

    // Para almacenar la informacion del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para determinar el uso de la animacion
    const [loading, setLoading] = useState(false);

    // Para cancelar el registro
    const cancelar = () => {
        setShowModal(false)
    }

    const onSubmit = e => {
        e.preventDefault();

        setLoading(true);
        //console.log(dataTemp)

        const dataTemp = {
            status: status === "false" ? "true" : "false"
        }

        try {
            actualizaEstadoMaquina(id, dataTemp).then(response => {
                const { data } = response;
                //console.log(data)
                if (dataTemp.status === "true") {
                    toast.success("Maquina habilitada");
                    LogsInformativos("Se ha habilitado la maquina " + numeroMaquina, data)
                }
                if (dataTemp.status === "false") {
                    toast.success("Maquina deshabilitada");
                    LogsInformativos("Se ha deshabilitado la maquina " + numeroMaquina, data)
                }
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
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <>
            <Form onSubmit={onSubmit} onChange={onChange}>

            {status == "true" ?
                    (
                        <>
                            <Alert variant="danger">
                                <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                                <p className="mensaje">
                                    Esta acción deshabilitara del sistema la maquina.
                                </p>
                            </Alert>
                        </>
                    ) : (
                        <>
                            <Alert variant="success">
                                <Alert.Heading>Atención! Acción contructiva!</Alert.Heading>
                                <p className="mensaje">
                                    Esta acción habilitara en la maquina.
                                </p>
                            </Alert>
                        </>
                    )
                }
                <Row>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Numero de maquina
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={numeroMaquina}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Nombre
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={nombre}
                            disabled
                        />
                    </Form.Group>
                </Row>

                <br/>

                <Row>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Marca
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={marca}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Lugar donde se encuentra
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={lugar}
                            disabled
                        />
                    </Form.Group>
                </Row>

                <br/>

                <Form.Group as={Row} className="botones">
                    <Col>
                        <Button
                            variant="success"
                            title={status === "true" ? "Deshabilitar" : "Habilitar"}
                            type="submit"
                            className="registrar">
                            {!loading ? (status === "true" ? "Deshabilitar" : "Habilitar") : <Spinner animation="border" />}
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

function initialFormData() {
    return {
        motivoCancelacion: "",
    }
}

export default EliminacionLogicaMaquinas;
