import { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Row, Container, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import { useHistory } from "react-router-dom";
import { registraMaquina } from "../../../api/maquinas";
import { toast } from "react-toastify";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";

function RegistraMaquinas(props) {
    const { setShowModal, history } = props;

    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Cancelar y cerrar el formulario
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault()

        if (!formData.numeroMaquina) {
            toast.warning("Completa el formulario");
        } else {
            setLoading(true)

            const dataTemp = {
                numeroMaquina: formData.numeroMaquina,
                marca: formData.marca,
                tonelaje: formData.tonelaje,
                lugar: formData.lugar,
                status: "true"
            }
            // console.log(dataTemp)

            try {
                registraMaquina(dataTemp).then(response => {
                    const { data } = response;
                    toast.success(data.mensaje)
                    LogsInformativos("Se ha registrado una nueva maquina", dataTemp)
                    history.push({
                        search: queryString.stringify(""),
                    });
                    setShowModal(false)
                }).catch(e => {
                    console.log(e)
                })
            } catch (e) {
                console.log(e)
            }
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <>
            <Container fluid>
                <div className="formularioDatos">
                    <Form onChange={onChange} onSubmit={onSubmit}>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label>
                                        Numero de maquina
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Numero de maquina"
                                        name="numeroMaquina"
                                        defaultValue={formData.numeroMaquina}
                                    />
                                </Col>

                                <Col sm="3">
                                    <Form.Label>
                                        Marca
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Marca"
                                        name="marca"
                                        defaultValue={formData.marca}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label>
                                        Tonelaje
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Tonelaje"
                                        name="tonelaje"
                                        defaultValue={formData.tonelaje}
                                    />
                                </Col>

                                <Col sm="3">
                                    <Form.Label>
                                        Lugar donde se encuentra
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Lugar donde se encuentra"
                                        name="lugar"
                                        defaultValue={formData.lugar}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Form.Group as={Row} className="botones">
                            <Col>
                                <Button
                                type="submit"
                                    variant="success"
                                    className="registrar"
                                >
                                    {!loading ? "Guardar" : <Spinner animation="border" />}
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    variant="danger"
                                    className="cancelar"
                                    onClick={() => {
                                        cancelarRegistro()
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </Col>
                        </Form.Group>
                    </Form>
                </div>
            </Container>
        </>
    );
}

function initialFormData() {
    return {
        numeroMaquina: "",
        marca: "",
        tonelaje: "",
        lugar: ""

    }
}

export default RegistraMaquinas;
