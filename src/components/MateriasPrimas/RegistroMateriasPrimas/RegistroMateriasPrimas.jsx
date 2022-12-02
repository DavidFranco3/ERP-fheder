import { useState, useEffect } from 'react';
import { obtenerFolioActualMP, registraMateriaPrima } from "../../../api/materiaPrima";
import { Button, Col, Form, Row, Spinner, Container } from "react-bootstrap";
import { map, size, values } from "lodash";
import { toast } from "react-toastify";
import queryString from "query-string";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { listarProveedores } from "../../../api/proveedores";

function RegistroMateriasPrimas(props) {
    const { setShowModal2, setShowModal, location, history } = props;

    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para el icono de cargando del boton
    const [loading, setLoading] = useState(false);

    // Para recuperar el folio de la materia prima
    const [folioActualMP, setFolioActualMP] = useState("");

    // Cancelar y cerrar el formulario
    const cancelarBusqueda = () => {
        setShowModal(false)
    }

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

    useEffect(() => {
        try {
            obtenerFolioActualMP().then(response => {
                const { data } = response;
                // console.log(data)
                const { noMP } = data;
                setFolioActualMP(noMP)
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

        let validCount = 0;
        values(formData).some(value => {
            value && validCount++;
            return null;
        });

        if (size(formData) !== validCount) {
            toast.warning("Completa el formulario")
        } else {
            setLoading(true)
            const dataTemp = {
                folio: folioActualMP,
                descripcion: formData.descripcion,
                precio: formData.precio,
                um: formData.um,
                proveedor: formData.proveedor
            }
            try {
                registraMateriaPrima(dataTemp).then(response => {
                    const { data } = response;
                    LogsInformativos("Nuevo material registrado", formData)
                    toast.success(data.mensaje)
                    setLoading(false)
                    history.push({
                        search: queryString.stringify(""),
                    });
                    setShowModal(false)
                }).catch(e => {
                    //console.log(e)
                })
            } catch (e) {
                //console.log(e)
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
                                    <option value="KG">KG</option>
                                    <option value="Litros">Litros</option>
                                    <option value="Piezas">Pieza</option>
                                    <option value="Otros">Otros</option>
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
                                {!loading ? "Registrar" : <Spinner animation="border" />}
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                variant="danger"
                                className="cancelar"
                                onClick={() => {
                                    cancelarBusqueda()
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

function initialFormData() {
    return {
        descripcion: "",
        precio: "",
        proveedor: "",
        um: ""
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

export default RegistroMateriasPrimas;
