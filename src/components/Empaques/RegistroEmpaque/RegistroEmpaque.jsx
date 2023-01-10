import { useState, useEffect } from 'react';
import { obtenerFolioActualEmpaque, registraEmpaque } from "../../../api/empaques";
import { Button, Col, Form, Row, Spinner, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import queryString from "query-string";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { getSucursal } from '../../../api/auth';

function RegistroEmpaque(props) {
    const { setShowModal2, setShowModal, location, history } = props;

    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para el icono de cargando del boton
    const [loading, setLoading] = useState(false);

    // Para recuperar el folio de la materia prima
    const [folioActualEmpaque, setFolioActualEmpaque] = useState("");

    // Cancelar y cerrar el formulario
    const cancelarBusqueda = () => {
        setShowModal(false)
    }
    
    useEffect(() => {
        try {
            obtenerFolioActualEmpaque().then(response => {
                const { data } = response;
                // console.log(data)
                const { noEmpaque } = data;
                setFolioActualEmpaque(noEmpaque)
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

        if (!formData.nombre || !formData.precio || !formData.um) {
            toast.warning("Completa el formulario")
        } else {
            setLoading(true)
            const dataTemp = {
                folio: folioActualEmpaque,
                sucursal: getSucursal(),
                nombre: formData.nombre,
                precio: formData.precio,
                um: formData.um,
            }
            try {
                registraEmpaque(dataTemp).then(response => {
                    const { data } = response;
                    LogsInformativos("Nuevo empaque registrado con nombre " + formData.nombre, dataTemp)
                    toast.success(data.mensaje)
                    setLoading(false)
                    history.push({
                        search: queryString.stringify(""),
                    });
                    setShowModal(false)
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
                                    placeholder="folio"
                                    name="folio"
                                    value={folioActualEmpaque}
                                    disabled
                                />
                            </Col>
                            <Col sm="2">
                                <Form.Label align="center">
                                    Nombre
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Nombre"
                                    name="nombre"
                                    defaultValue={formData.nombre}
                                />
                            </Col>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
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
        nombre: "",
        precio: "",
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

export default RegistroEmpaque;
