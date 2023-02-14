import { useState, useEffect } from 'react';
import queryString from "query-string";
import "./EliminacionLogicaCotizaciones.scss";
import { Button, Col, Form, Row, Spinner, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { cambiaStatusCotizacion } from "../../../api/cotizaciones";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

function EliminacionLogicaCotizaciones(props) {
    const { dataCotizacion, setShowModal, history } = props;
    const { id, cliente, vendedor, status } = dataCotizacion;

    //console.log(dataUsuario)

    // Para almacenar datos del formulario
    const [formData, setFormData] = useState(initialFormData(dataCotizacion));

    // Para determinar el uso de la animacion
    const [loading, setLoading] = useState(false);

    // Para cancelar el registro
    const cancelar = () => {
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
            cambiaStatusCotizacion(id, dataTemp).then(response => {
                const { data } = response;
                //console.log(data)
                toast.success(data.mensaje);
                LogsInformativos("Se ha cancelado la cotización " + formData.cliente + " " + formData.vendedor, dataTemp)
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
                        Esta acción cancelara la cotización.
                    </p>
                </Alert>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridNombre">
                        <Form.Label>Cliente</Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre"
                            disabled
                            defaultValue={formData.cliente}
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridNombre">
                        <Form.Label>Vendededor</Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre"
                            disabled
                            defaultValue={formData.vendedor}
                        />
                    </Form.Group>
                </Row>

                <Form.Group as={Row}
                    className="btnEliminar"
                    title={status === "true" ? "Deshabilitar" : "Habilitar"}
                >
                    <Col>
                        <Button
                            variant="success"
                            type="submit">
                            {!loading ? "Cancelar" : <Spinner animation="border" />}
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
                            Cerrar
                        </Button>
                    </Col>
                </Form.Group>
            </Form>
        </>
    );
}

function initialFormData(data) {
    const { cliente, vendedor } = data;

    return {
        cliente: cliente,
        vendedor: vendedor
    }
}

export default EliminacionLogicaCotizaciones;
