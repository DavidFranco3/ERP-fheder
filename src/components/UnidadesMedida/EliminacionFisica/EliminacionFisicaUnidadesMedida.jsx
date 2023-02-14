import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Spinner, Alert } from "react-bootstrap";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import "./EliminacionFisicaUnidadesMedida.scss";
import { eliminaUM } from "../../../api/unidadesMedida";
import { toast } from "react-toastify";
import queryString from "query-string";

function EliminacionFisicaUnidadesMedida(props) {
    const { dataUM, setShowModal, setRefreshCheckLogin, history } = props;
    const { id, nombre } = dataUM;

    //console.log(dataDepto)

    // Para cancelar la actualizacion
    const cancelarEliminacion = () => {
        setShowModal(false)
    }

    // Para almacenar los datos recibidos
    const [formData, setFormData] = useState(initialFormValue(dataUM));

    // Para determinar la animacion de carga
    const [loading, setLoading] = useState(false);

    const onSubmit = e => {
        e.preventDefault();

        //console.log(formData);
        setLoading(true);

        try {
            eliminaUM(id).then(response => {
                const { data } = response;
                LogsInformativos("Se a eliminado el unidadad de medida " + nombre, dataUM);
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
                        Esta acción eliminara del sistema a la unidad de medida.
                    </p>
                </Alert>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridNombre">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control type="text"
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

export default EliminacionFisicaUnidadesMedida;
