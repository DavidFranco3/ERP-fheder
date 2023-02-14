import { useState, useEffect } from 'react';
import queryString from "query-string";
import "./EliminacionLogicaClasificacionMateriales.scss";
import { Button, Col, Form, Row, Spinner, Container, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { deshabilitaClasificacionMaterial } from "../../../api/clasificacionMateriales";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

function EliminacionLogicaClasificacionMateriales(props) {
    const { data, setShowModal, history } = props;
    const { id, estado } = data;

    //console.log(dataUsuario)

    // Para almacenar datos del formulario
    const [formData, setFormData] = useState(initialFormData(data));

    // Para determinar el uso de la animacion
    const [loading, setLoading] = useState(false);

    // Para cancelar el registro
    const regresaPagina = () => {
        setShowModal(false)
    }

    const onSubmit = e => {
        e.preventDefault();

        setLoading(true);

        const dataTemp = {
            estado: estado === "false" ? "true" : "false"
        }
        //console.log(dataTemp)

        try {
            deshabilitaClasificacionMaterial(id, dataTemp).then(response => {
                const { data } = response;
                //console.log(data)
                toast.success(data.mensaje);
                LogsInformativos("Se actualizo el estado del material " + formData.nombre, dataTemp)
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
            <Container>
                <div className="formularioDatos">
                    {estado == "true" ?
                        (
                            <>
                                <Alert variant="danger">
                                    <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                                    <p className="mensaje">
                                        Esta acción deshabilitara en el sistema el material.
                                    </p>
                                </Alert>
                            </>
                        ) : (
                            <>
                                <Alert variant="success">
                                    <Alert.Heading>Atención! Acción contructiva!</Alert.Heading>
                                    <p className="mensaje">
                                        Esta acción habilitara en el sistema el material.
                                    </p>
                                </Alert>
                            </>
                        )
                    }

                    <Form onChange={onChange} onSubmit={onSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formHorizontalNombre">
                                <Form.Label>
                                    Nombre
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Escribe el nombre"
                                    name="nombre"
                                    defaultValue={formData.nombre}
                                    disabled
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridEstado">
                                <Form.Label>
                                    Descripción
                                </Form.Label>

                                <Form.Control
                                    as="textarea"
                                    placeholder='Descripcion'
                                    defaultValue={formData.descripcion}
                                    name="descripcion"
                                    style={{ height: '100px' }}
                                    disabled
                                />
                            </Form.Group>
                        </Row>

                        <Form.Group as={Row} className="botones">
                            <Col>
                                <Button
                                    type="submit"
                                    title={estado === "true" ? "Deshabilitar" : "Habilitar"}
                                    variant="success"
                                    className="registrar"
                                >
                                    {!loading ? (estado === "true" ? "Deshabilitar" : "Habilitar") : <Spinner animation="border" />}
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    variant="danger"
                                    className="cancelar"
                                    onClick={() => {
                                        regresaPagina()
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

function initialFormData(data) {
    return {
        nombre: data.nombre,
        descripcion: data.descripcion
    }
}

export default EliminacionLogicaClasificacionMateriales;
