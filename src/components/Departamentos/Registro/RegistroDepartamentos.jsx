import { useState, useEffect } from 'react';
import {Button, Col, Form, Row, Spinner} from "react-bootstrap";

import "./RegistroDepartamentos.scss";
import {size, values} from "lodash";
import {toast} from "react-toastify";
import {registraDepartamento} from "../../../api/departamentos";
import queryString from "query-string";

function RegistroDepartamentos(props) {
    const { setShowModal, history } = props;

    //setShowModal={setShowModal} history={history}

    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para determinar el uso de la animacion
    const [loading, setLoading] = useState(false);

    const onSubmit = e => {
        e.preventDefault();

        //console.log(formData);
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
                registraDepartamento(formData).then(response => {
                    const { data } = response;

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
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Form onSubmit={onSubmit} onChange={onChange}>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridNombre">
                        <Form.Label>Nombre del departamento</Form.Label>
                        <Form.Control type="text"
                                      name="nombre"
                                      defaultValue={formData.nombre}
                        />
                    </Form.Group>
                </Row>

                <Form.Group className="btnRegistro">
                    <Button variant="primary" type="submit">
                        {!loading ? "Registro" : <Spinner animation="border" />}
                    </Button>
                </Form.Group>
            </Form>
        </>
    );
}

function initialFormData() {
    return {
        nombre: ""
    }
}

export default RegistroDepartamentos;
