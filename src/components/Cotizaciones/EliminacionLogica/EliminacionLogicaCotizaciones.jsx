import { useState, useEffect } from 'react';
import queryString from "query-string";
import "./EliminacionLogicaCotizaciones.scss";
import {Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {toast} from "react-toastify";
import {cambiaStatusCotizacion} from "../../../api/cotizaciones";
import {LogsInformativos} from "../../Logs/LogsSistema/LogsSistema";

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
                if(dataTemp.status === "true") {
                    toast.success("Cotización habilitada");
                    LogsInformativos("Se ha habilitado la cotización " + formData.cliente + " " + formData.vendedor)
                }
                if(dataTemp.status === "false") {
                    toast.success("Cotización deshabilitada");
                    LogsInformativos("Se ha deshabilitado el cotización " + formData.cliente + " " + formData.vendedor)
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
                        <Form.Label>Cliente</Form.Label>
                        <Form.Control type="text"
                                      name="nombre"
                                      disabled={true}
                                      defaultValue={formData.cliente}
                        />
                    </Form.Group>
                    
                    <Form.Group as={Col} controlId="formGridNombre">
                        <Form.Label>Vendededor</Form.Label>
                        <Form.Control type="text"
                                      name="nombre"
                                      disabled={true}
                                      defaultValue={formData.vendedor}
                        />
                    </Form.Group>
                </Row>

                <Form.Group as={Row} className="btnEliminar">
                <Col>
                    <Button variant="success" type="submit">
                        {!loading ? (status === "true" ? "Deshabilitar" : "Habilitar") : <Spinner animation="border" />}
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
    const { cliente, vendedor  } = data;

    return {
        cliente: cliente,
        vendedor: vendedor
    }
}

export default EliminacionLogicaCotizaciones;
