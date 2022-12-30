import { useState, useEffect } from 'react';
import queryString from "query-string";
import "./EliminacionLogicaGestionAlmacen.scss";
import { Button, Col, Form, Row, Spinner, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import { deshabilitaAlmacen } from "../../../api/gestionAlmacen";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

function EliminacionLogicaGestionAlmacen(props) {
    const { data, setShowModal, history } = props;
    const { id, status } = data;

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
            status: status === "false" ? "true" : "false"
        }
        //console.log(dataTemp)

        try {
            deshabilitaAlmacen(id, dataTemp).then(response => {
                const { data } = response;
                //console.log(data)
                if (dataTemp.status === "true") {
                    toast.success("Almacen habilitado");
                    LogsInformativos("Se ha habilitado el almacen " + formData.nombre, data)
                }
                if (dataTemp.status === "false") {
                    toast.success("Almacen deshabilitado");
                    LogsInformativos("Se ha habilitado la almacen " + formData.nombre, data)
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
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Container>
                <div className="formularioDatos">
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
                            <Row>
                                <Col>
                                    <Button
                                        type="submit"
                                        title={status === "true" ? "Deshabilitar" : "Habilitar"}
                                        variant="success"
                                        className="registrar"
                                    >
                                        {!loading ? (status === "true" ? "Deshabilitar" : "Habilitar") : <Spinner animation="border" />}
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
                            </Row>
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

export default EliminacionLogicaGestionAlmacen;
