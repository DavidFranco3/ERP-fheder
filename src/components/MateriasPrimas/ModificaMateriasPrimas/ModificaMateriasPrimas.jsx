import { useState, useEffect } from 'react';
import { actualizaMateriaPrima } from "../../../api/materiaPrima";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import queryString from "query-string";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { listarProveedores } from "../../../api/proveedores";
import { listarUM } from "../../../api/unidadesMedida";
import { listarClasificacionMaterial } from "../../../api/clasificacionMateriales"
import { map } from "lodash";
import { getSucursal } from "../../../api/auth";

function ModificaMateriasPrimas(props) {
    const { dataMateriaPrima, location, history, setShowModal } = props;
    const { id, folio, descripcion } = dataMateriaPrima;

    // Para controlar la animacion de carga
    const [loading, setLoading] = useState(false);

    // Cancelar y cerrar el formulario
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData(dataMateriaPrima));

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

    // Para almacenar el listado de proveedores
    const [listUM, setListUM] = useState(null);

    useEffect(() => {
        try {
            listarUM(getSucursal()).then(response => {
                const { data } = response;
                // console.log(data)
                if (!listarUM() && data) {
                    setListUM(formatModelUM(data));
                } else {
                    const datosUM = formatModelUM(data);
                    setListUM(datosUM);
                }

            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    const [listTipoMaterial, setListTipoMaterial] = useState(null);

    useEffect(() => {
        try {
            listarClasificacionMaterial(getSucursal()).then(response => {
                const { data } = response;
                // console.log(data)
                if (!listarClasificacionMaterial() && data) {
                    setListTipoMaterial(formatModelClasificacionMateriales(data));
                } else {
                    const datosTipoMaterial = formatModelClasificacionMateriales(data);
                    setListTipoMaterial(datosTipoMaterial);
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
                actualizaMateriaPrima(id, formData).then(response => {
                    const { data } = response;
                    LogsInformativos("El material con descripción: " + descripcion + " fue modificado", formData)
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
                                    Folio
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Folio"
                                    name="folio"
                                    value={folio}
                                    disabled
                                />
                            </Col>

                            <Col sm="2">
                                <Form.Label align="center">
                                   Tipo de material
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    as="select"
                                    name="tipoMaterial"
                                    defaultValue={formData.tipoMaterial}
                                >
                                    <option>Elige una opción</option>
                                    {map(listTipoMaterial, (material, index) => (
                                        <option key={index} value={material?.nombre} selected={formData.tipoMaterial == material?.nombre}>{material?.nombre}</option>
                                    ))}
                                </Form.Control>
                            </Col>
                        </Form.Group>
                    </Row>
                    
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
                                    UM
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    as="select"
                                    name="um"
                                    defaultValue={formData.um}
                                >
                                    <option>Elige una opción</option>
                                    {map(listUM, (um, index) => (
                                        <option key={index} value={um?.nombre} selected={formData.um == um?.nombre}>{um?.nombre}</option>
                                    ))}
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
                                title="Actualizar el registro"
                                variant="success"
                                className="registrar"
                            >
                                {!loading ? "Modificar" : <Spinner animation="border" />}
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
            </div>
        </>
    );
}

function initialFormData(data) {
    const { id, folio, descripcion, tipoMaterial, precio, um, proveedor } = data;

    return {
        descripcion: descripcion,
        precio: precio,
        um: um,
        tipoMaterial: tipoMaterial,
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

function formatModelUM(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            nombre: data.nombre,
            sucursal: data.sucursal,
            estadoUM: data.estadoUM,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

function formatModelClasificacionMateriales(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            nombre: data.nombre,
            descripcion: data.descripcion,
            sucursal: data.sucursal,
            estado: data.estado,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default ModificaMateriasPrimas;
