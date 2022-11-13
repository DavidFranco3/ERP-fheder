import { useState, useEffect } from 'react';
import { Alert, Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { obtenerFolioActualProveedores, registraProveedores, obtenerItem } from "../../../api/proveedores";
import { toast } from "react-toastify";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";

function RegistraProveedores(props) {
    const { setShowModal, history } = props;

    // Para controlar la animación
    const [loading, setLoading] = useState(false);

    // Para cancelar el registro
    const cierraModal = () => {
        setShowModal(false)
    }

    // Para almacenar el folio actual
    const [folioActual, setFolioActual] = useState("");

    useEffect(() => {
        try {
            obtenerFolioActualProveedores().then(response => {
                const { data } = response;
                // console.log(data)
                const { noProveedor } = data;
                setFolioActual(noProveedor)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);


    // Almacena los datos del proveedor
    const [formData, setFormData] = useState(initialFormData());

    const onSubmit = (e) => {
        e.preventDefault()

        if (!formData.nombre || !formData.productoServicio || !formData.categoria || !formData.personalContacto || !formData.telefono || !formData.correo || !formData.tiempoCredito || !formData.tiempoRespuesta || !formData.lugarRecoleccion || !formData.horario || !formData.comentarios) {
            toast.warning("Completa el formulario");
        } else {
            setLoading(true)

            obtenerItem().then(response => {
                const { data } = response;
                const dataTemp = {
                    item: data.item,
                    folio: folioActual,
                    nombre: formData.nombre,
                    productoServicio: formData.productoServicio,
                    categoria: formData.categoria,
                    personalContacto: formData.personalContacto,
                    telefono: formData.telefono,
                    correo: formData.correo,
                    tiempoCredito: formData.tiempoCredito,
                    tiempoRespuesta: formData.tiempoRespuesta,
                    lugarRecoleccion: formData.lugarRecoleccion,
                    horario: formData.horario,
                    comentarios: formData.comentarios,
                    estado: "true"
                }
                // console.log(dataTemp)

                try {
                    registraProveedores(dataTemp).then(response => {
                        const { data } = response;
                        toast.success(data.mensaje)
                        LogsInformativos("Se ha registrado un nuevo proveedor", dataTemp)
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
            }).catch(e => {
                console.log(e)
            })
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <>
            <Form onChange={onChange} onSubmit={onSubmit}>
                {/* ID proveedor, nombre/servicio, tipo */}
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridFolio">
                        <Form.Label>
                            Folio
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="folio"
                            defaultValue={folioActual}
                            disabled
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridNombre">
                        <Form.Label>
                            Nombre del proveedor
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre"
                            placeholder="Escribe el nombre"
                            defaultValue={formData.nombre}
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridHorario">
                        <Form.Label>
                            Horario
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="horario"
                            placeholder="Escribe el horario"
                            defaultValue={formData.horario}
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridTipo">
                        <Form.Label>
                            Categoría
                        </Form.Label>
                        <Form.Control
                            as="select"
                            name="categoria"
                            defaultValue={formData.categoria}
                        >
                            <option>Elige....</option>
                            <option value="Materia Prima">Materia Prima</option>
                            <option value="Insumos">Insumos</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridProductoServicio">
                        <Form.Label>
                            Producto/Servicio que proporciona
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="productoServicio"
                            placeholder="Escribe el producto o servicio"
                            defaultValue={formData.productoServicio}
                        />
                    </Form.Group>
                </Row>
                {/* Producto o servicio */}
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridPersonalContacto">
                        <Form.Label>
                            Personal de contacto
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="personalContacto"
                            placeholder="Escribe el personal de contacto"
                            defaultValue={formData.personalContacto}
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridTiempoCredito">
                        <Form.Label>
                            Tiempo de credito
                        </Form.Label>
                        <Form.Control
                            type="number"
                            min="0"
                            name="tiempoCredito"
                            placeholder="Escribe el tiempo"
                            defaultValue={formData.tiempoCredito}
                        />
                    </Form.Group>

                </Row>
                {/* Personal de contacto, telefono, Email */}
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridTelefono">
                        <Form.Label>
                            Telefono
                        </Form.Label>
                        <Form.Control
                            type="number"
                            min="0"
                            name="telefono"
                            placeholder="Escribe el telefono"
                            defaultValue={formData.telefono}
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridCorreo">
                        <Form.Label>
                            Correo
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="correo"
                            placeholder="Escribe el correo"
                            defaultValue={formData.correo}
                        />
                    </Form.Group>

                </Row>
                {/* Tiempo credito, tiempo respuesta, Lugar de recoleccion */}
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridTiempoRespuesta">
                        <Form.Label>
                            Tiempo de respuesta
                        </Form.Label>
                        <Form.Control
                            type="number"
                            min="0"
                            name="tiempoRespuesta"
                            placeholder="Escribe el tiempo"
                            defaultValue={formData.tiempoRespuesta}
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridLugarRecoleccion">
                        <Form.Label>
                            Lugar de recolección
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="lugarRecoleccion"
                            placeholder="Escribe el lugar de recolección"
                            defaultValue={formData.lugarRecoleccion}
                        />
                    </Form.Group>
                </Row>
                {/*  horario, comentarios */}
                <Row className="mb-3">

                    <Form.Group as={Col} controlId="formGridComentarios">
                        <Form.Label>Comentarios</Form.Label>
                        <Form.Control as="textarea" rows={3}
                            type="text"
                            placeholder="Escribe los comentarios"
                            name="comentarios"
                            defaultValue={formData.comentarios}
                        />
                    </Form.Group>

                </Row>

                {/* Botones de acciones */}
                <Form.Group as={Row} className="botones">
                    <Row>
                        <Col>
                            <Button
                                type="submit"
                                variant="success"
                                className="registrar"
                            >
                                {!loading ? "Guardar" : <Spinner animation="border" />}
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                variant="danger"
                                className="registrar"
                                onClick={() => {
                                    cierraModal()
                                }}
                            >
                                Cancelar
                            </Button>
                        </Col>
                    </Row>
                </Form.Group>
            </Form>
        </>
    );
}

function initialFormData() {
    return {
        nombre: "",
        productoServicio: "",
        categoria: "",
        personalContacto: "",
        telefono: "",
        correo: "",
        tiempoCredito: "",
        tiempoRespuesta: "",
        lugarRecoleccion: "",
        horario: "",
        comentarios: ""
    }
}

export default RegistraProveedores;
