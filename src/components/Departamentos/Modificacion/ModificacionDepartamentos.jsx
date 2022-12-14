import { useState, useEffect } from 'react';
import {Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {size, values} from "lodash";
import {toast} from "react-toastify";
import {actualizaDepartamento, registraDepartamento} from "../../../api/departamentos";
import queryString from "query-string";

function ModificacionDepartamentos(props) {
    const { dataDepto, setShowModal, history } = props;
    const { id, nombre } = dataDepto;

    // Para almacenar datos del departamento
    const [formData, setFormData] = useState(initialFormValue(dataDepto));

    // Cancelar y cerrar el formulario
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para la animacion de carga
    const [loading, setLoading] = useState(false);

    const onSubmit = e => {
        e.preventDefault();

        //console.log(e);
        let validCount = 0;
        values(formData).some(value => {
            value && validCount++;
            return null;
        });

        if(size(formData) !== validCount) {
            toast.warning("Completa el formulario")
        } else {
            setLoading(true);

            try {
                actualizaDepartamento(id, formData).then(response => {
                    const { data } = response;

                    toast.success(data.status);
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
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Form onSubmit={onSubmit} onChange={onChange}>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridNombre">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control type="text"
                                      name="nombre"
                                      defaultValue={formData.nombre}
                        />
                    </Form.Group>
                </Row>

                <Form.Group as={Row} className="botones">
                        <Col>
                            <Button
                                type="submit"
                                title="Actualizar el registro"
                                variant="success"
                                className="registrar"
                            >
                                {!loading ? "Actualizar" : <Spinner animation="border" />}
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                variant="danger"
                                title="Cerrar el formulario"
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
        </>
    );
}

function initialFormValue(data) {
    const { nombre } = data;
    //console.log(nombre)

    return {
        nombre: nombre
    }
}

export default ModificacionDepartamentos;
