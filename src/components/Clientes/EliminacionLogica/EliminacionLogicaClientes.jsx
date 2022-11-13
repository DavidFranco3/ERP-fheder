import { useState, useEffect } from 'react';
import {deshabilitaUsuario} from "../../../api/usuarios";
import {toast} from "react-toastify";
import queryString from "query-string";
import {Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {deshabilitaCliente} from "../../../api/clientes";
import {LogsInformativos} from "../../Logs/LogsSistema/LogsSistema";

function EliminacionLogicaClientes(props) {
    const { history, dataCliente, setShowModal } = props;
    const { id, nombre, apellidos, estadoCliente } = dataCliente;

    //console.log(dataUsuario)
    
    // Para cancelar el registro
    const cancelar = () => {
        setShowModal(false)
    }

    // Para almacenar datos del formulario
    const [formData, setFormData] = useState(initialFormData(dataCliente));

    // Para determinar el uso de la animacion
    const [loading, setLoading] = useState(false);

    const onSubmit = e => {
        e.preventDefault();

        setLoading(true);

        const dataTemp = {
            estadoCliente: estadoCliente === "false" ? "true" : "false"
        }
        //console.log(dataTemp)

        try {
            deshabilitaCliente(id, dataTemp).then(response => {
                const { data } = response;
                //console.log(data)
                if(dataTemp.estadoCliente === "true") {
                    LogsInformativos("El cliente " + formData.nombre + " " + formData.apellidos + " se habilito", dataCliente)
                    toast.success("Cliente habilitado");
                }
                if(dataTemp.estadoCliente === "false") {
                    LogsInformativos("El cliente " + formData.nombre + " " + formData.apellidos + " se inhabilito", dataCliente)
                    toast.success("Cliente deshabilitado");
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
            <Form onSubmit={onSubmit} onChange={onChange}>
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

                <Form.Group as={Row} className="btnEliminar">
                <Col>
                    <Button variant="success" type="submit">
                        {!loading ? (estadoCliente === "true" ? "Deshabilitar" : "Habilitar") : <Spinner animation="border" />}
                    </Button>
                </Col>
                <Col>
                            <Button
                                variant="danger"
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

function initialFormData(data) {
    const { nombre, apellidos  } = data;

    return {
        nombre: nombre,
        apellidos: apellidos
    }
}

export default EliminacionLogicaClientes;
