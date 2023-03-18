import { useState } from 'react';
import { Button, Col, Form, Row, Spinner, Alert } from "react-bootstrap";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import "./EliminacionFisicaDepartamentos.scss";
import { actualizaDepartamento, eliminaDepartamento } from "../../../api/departamentos";
import { toast } from "react-toastify";
import queryString from "query-string";

function EliminacionFisicaDepartamentos(props) {
    const { dataDepto, setShowModal, setRefreshCheckLogin, history } = props;
    const { id, nombre } = dataDepto;

    //console.log(dataDepto)

    // Para cancelar la actualizacion
    const cancelarEliminacion = () => {
        setShowModal(false)
    }

    // Para almacenar los datos recibidos
    const [formData, setFormData] = useState(initialFormValue(dataDepto));

    // Para determinar la animacion de carga
    const [loading, setLoading] = useState(false);

    const onSubmit = e => {
        e.preventDefault();

        //console.log(formData);
        setLoading(true);

        try {
            eliminaDepartamento(id).then(response => {
                const { data } = response;
                LogsInformativos("Se a eliminado el departamento " + nombre, dataDepto);
                toast.success(data.status);
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
            <Form onSubmit={onSubmit} onChange={onChange}>

                <Alert variant="danger">
                    <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                    <p className="mensaje">
                        Esta acción eliminara del sistema al departamento.
                    </p>
                </Alert>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridNombre">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre"
                            disabled={true}
                            defaultValue={formData.nombre}
                        />
                    </Form.Group>
                </Row>

                <Form.Group as={Row} className="botones">
                    <Col>
                        <Button
                            type="submit"
                            title="Eliminar"
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

function initialFormValue(data) {
    const { nombre } = data;

    return {
        nombre: nombre
    }
}

export default EliminacionFisicaDepartamentos;
