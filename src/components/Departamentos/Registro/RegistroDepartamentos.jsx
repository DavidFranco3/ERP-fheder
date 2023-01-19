import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import "./RegistroDepartamentos.scss";
import { toast } from "react-toastify";
import { registraDepartamento } from "../../../api/departamentos";
import queryString from "query-string";
import { getSucursal } from "../../../api/auth";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

function RegistroDepartamentos(props) {
    const { setShowModal, history } = props;

    //setShowModal={setShowModal} history={history}

    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para determinar el uso de la animacion
    const [loading, setLoading] = useState(false);

    // Para cancelar la actualizacion
    const cancelarEliminacion = () => {
        setShowModal(false)
    }

    // Para cancelar la actualizacion
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    const onSubmit = e => {
        e.preventDefault();
        if (!formData.nombre) {
            toast.warning("Completa el formulario")
        } else {
            setLoading(true);

            const dataTemp = {
                ...formData,
                sucursal: getSucursal(),
                estado: "true"
            }

            try {
                registraDepartamento(dataTemp).then(response => {
                    const { data } = response;
                    LogsInformativos("Se a registrado un nuevo departamento " + formData.nombre, dataTemp);
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
                        <Form.Control
                            type="text"
                            placeholder='Departamento'
                            name="nombre"
                            defaultValue={formData.nombre}
                        />
                    </Form.Group>
                </Row>

                <Form.Group as={Row} className="botones">
                    <Col>
                        <Button
                            type="submit"
                            title="Guardar la información del formulario"
                            variant="success"
                            className="registrar"
                        >
                            {!loading ? "Registrar" : <Spinner animation="border" />}
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

function initialFormData() {
    return {
        nombre: ""
    }
}

export default RegistroDepartamentos;
