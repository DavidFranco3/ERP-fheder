import { useState, useEffect } from 'react';
import {Badge, Col, Form, Row} from "react-bootstrap";
import {map} from "lodash";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleMinus, faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import {convierteMoneda} from "../../../../../../utils/monedaALetra";

function Inicial(props) {
    const { listProveedores, listClientes, setFormdataInicial, formdataInicial, fechaCreacion, setFechaCreacion } = props;

    const onChange = e => {
        setFormdataInicial({ ...formdataInicial, [e.target.name]: e.target.value })
    }

    return (
        <>
            <div className="formularioNuevaOrden">
                <Form onChange={onChange}>
                    {/* Fecha de creación, vendedor, referencia */}
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridFechaCreacion">
                            <Form.Label>Fecha de creación</Form.Label>
                            <Form.Control
                                        className="mb-3"
                                        type="datetime-local"
                                        placeholder="Fecha"
                                        defaultValue={formdataInicial.fecha}
                                        name="fecha"
                                        />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridVendedor">
                            <Form.Label>
                                            Vendedor
                                        </Form.Label>
                                        <Form.Control as="select"
                                                      defaultValue={formdataInicial.proveedor}
                                                      name="cliente"
                                        >
                                            <option>Elige una opción</option>
                                            {map(listProveedores, (proveedor, index) => (
                                                <option key={index} value={proveedor?.id}>{proveedor?.nombre + " " + proveedor.apellidos}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>

                    
                    {/* Cliente */}
                    <Form.Group as={Col} controlId="formGridCliente">
                                        <Form.Label>
                                            Cliente
                                        </Form.Label>
                                        <Form.Control as="select"
                                                      defaultValue={formdataInicial.cliente}
                                                      name="cliente"
                                        >
                                            <option>Elige una opción</option>
                                            {map(listClientes, (cliente, index) => (
                                                <option key={index} value={cliente?.id}>{cliente?.nombre + " " + cliente.apellidos}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                    </Row>
                    {/* Datos del cliente */}
                    {/* Comentarios */}
                    {/* Atenciones al correo */}
                </Form>
            </div>
        </>
    );
}

export default Inicial;
