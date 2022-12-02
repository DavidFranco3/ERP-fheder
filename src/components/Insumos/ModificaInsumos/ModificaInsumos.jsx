import { useState, useEffect } from 'react';
import { actualizaInsumo } from "../../../api/insumos";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import queryString from "query-string";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { listarProveedores } from "../../../api/proveedores";

function ModificaInsumos(props) {
    const { dataInsumos, location, history, setShowModal } = props;
    const { id, folio, descripcion } = dataInsumos;

    // Para controlar la animacion de carga
    const [loading, setLoading] = useState(false);

    // Cancelar y cerrar el formulario
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData(dataInsumos));

    // Para almacenar el listado de proveedores
    const [listProveedores, setListProveedores] = useState(null);

    useEffect(() => {
        try {
            listarProveedores().then(response => {
                const { data } = response;
                // console.log(data)
                if (!listarProveedores() && data) {
                    setListProveedores(formatModelProveedores(data));
                } else {
                    const datosProveedores = formatModelProveedores(data);
                    setListProveedores(datosProveedores);
                }

            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    const onSubmit = e => {
        e.preventDefault();
        //console.log(formData)

        if (!formData.descripcion || !formData.precio || !formData.um || !formData.proveedor) {
            toast.warning("Comapleta el formulario")
        } else {
            setLoading(true)
            try {
                actualizaInsumo(id, formData).then(response => {
                    const { data } = response;
                    LogsInformativos("El insumo con descripción: " + descripcion + " fue modificado", dataInsumos)
                    toast.success(data.mensaje)
                    setLoading(false)
                    setShowModal(false)
                    history.push({
                        search: queryString.stringify(""),
                    });
                }).catch(e => {
                    console.log(e)
                })
            } catch (e) {
                console.log(e)
            }
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <>
            <div className="formularioDatos">
                <Form onChange={onChange} onSubmit={onSubmit}>
                    <Row className="mb-3">
                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                                <Form.Label align="center">
                                    Descripcion
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Descripcion"
                                    name="descripcion"
                                    defaultValue={formData.descripcion}
                                />
                            </Col>

                            <Col sm="2">
                                <Form.Label align="center">
                                    Unidad de medida
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    as="select"
                                    name="um"
                                    defaultValue={formData.um}
                                >
                                    <option >Elige....</option>
                                    <option value="KG" selected={formData.um == "KG"}>KG</option>
                                    <option value="Litros" selected={formData.um == "Litros"}>Litros</option>
                                    <option value="Piezas" selected={formData.um == "Piezas"}>Pieza</option>
                                    <option value="Otros" selected={formData.um == "Otros"}>Otros</option>
                                </Form.Control>
                            </Col>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                                <Form.Label align="center">
                                    Precio
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Precio"
                                    name="precio"
                                    defaultValue={formData.precio}
                                />
                            </Col>

                            <Col sm="2">
                                <Form.Label>
                                    Proveedor
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    type="text"
                                    defaultValue={formData.proveedor}
                                    name="proveedor"
                                />

                            </Col>
                        </Form.Group>
                    </Row>


                    <Form.Group as={Row} className="botones">
                        <Col>
                            <Button
                                type="submit"
                                variant="success"
                                className="registrar"
                            >
                                {!loading ? "Modificar" : <Spinner animation="border" />}
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                variant="danger"
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
            </div>
        </>
    );
}

function initialFormData(data) {
    const { id, descripcion, precio, um, proveedor } = data;

    return {
        descripcion: descripcion,
        precio: precio,
        um: um,
        proveedor: proveedor
    }
}

function formatModelProveedores(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            nombre: data.nombre,
            tipo: data.tipo,
            productoServicio: data.productoServicio,
            categoria: data.categoria,
            personalContacto: data.personalContacto,
            telefono: data.telefono,
            correo: data.correo,
            tiempoCredito: data.tiempoCredito,
            tiempoRespuesta: data.tiempoRespuesta,
            lugarRecoleccion: data.lugarRecoleccion,
            horario: data.horario,
            comentarios: data.comentarios,
            estado: data.estado,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}


export default ModificaInsumos;
