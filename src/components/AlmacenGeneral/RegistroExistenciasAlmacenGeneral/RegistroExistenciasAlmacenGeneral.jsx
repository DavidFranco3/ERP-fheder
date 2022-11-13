import { useState, useEffect } from 'react';
import {Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {map, size, values} from "lodash";
import {toast} from "react-toastify";
import {obtenerFolioActualAlmacenGeneral, registraAlmacenGeneral} from "../../../api/almacenGeneral";
import {LogsInformativos} from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";

function RegistroExistenciasAlmacenGeneral(props) {
    const { setShowModal, location, history } = props;

    // Para controlar la animacion de carga
    const [loading, setLoading] = useState(false);

    // Inicia recuperacion del folio actual de la existencia en almacén general
    const [folioActualAG, setFolioActualAG] = useState("");

    useEffect(() => {
        try {
            obtenerFolioActualAlmacenGeneral().then(response => {
                const { data } = response
                // console.log(data)
                const { folio } = data;
                setFolioActualAG(folio)
            }).catch(e => {
                // console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);


    // Cancelar y cerrar el formulario
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    const onSubmit = (e) => {
        e.preventDefault()

        if(!formData.nombre || !formData.descripcion || !formData.um || !formData.tipo){
            toast.warning("Completa el formulario")
        } else {
            // console.log(formData)
            setLoading(true)
            const dataTemp = {
                folioAlmacen: folioActualAG,
                nombre: formData.nombre,
                descripcion: formData.descripcion,
                um: formData.um,
                tipo: formData.tipo,
                existenciasOV: "0",
                existenciasStock: "0",
                existenciasTotales: "0",
                estado: "activo"
            }
            try {
                registraAlmacenGeneral(dataTemp).then(response => {
                    const { data } = response;
                    const { mensaje, datos } = data;
                    toast.success(mensaje)
                    setLoading(false)
                    LogsInformativos("Se ha registrado un articulo en el almacen general", datos)
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
            <div className="contenidoFormularioPrincipal">
                <Form onChange={onChange} onSubmit={onSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridFolioAG">
                        <Form.Label>
                            Folio
                        </Form.Label>
                        <Form.Control
                            type="text"
                            nombre="folio"
                            defaultValue={folioActualAG}
                            disabled
                        />
                    </Form.Group>

                    <Form.Group as={Col}>
                        <Form.Label>
                            Nombre
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre"
                            placeholder="Escribe el nombre"
                            defaultValue={formData.nombre}
                        />
                    </Form.Group>
                </Row>
                
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formHorizontalUnidadMedida" className="unidadMedidaMP">
                        <Form.Label>
                            Unidad de medida
                        </Form.Label>
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
                    
                    <Form.Group as={Col} controlId="formHorizontalStatus" className="status">
                        <Form.Label>
                            Tipo
                        </Form.Label>
                        <Col>
                            <Form.Control
                                as="select"
                                name="tipo"
                                defaultValue={formData.tipo}
                            >
                                <option >Elige....</option>
                                <option value="Maquinaria">Maquinaria</option>
                                <option value="Accesorio">Accesorio</option>
                                <option value="Empaque">Empaque</option>
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    </Row>
                    
                    <Row className="mb-3">
                    <Form.Group as={Col} controlId="formHorizontalDescripcion" className="descripcionMP">
                        <Form.Label>
                            Descripción
                        </Form.Label>
                            <Form.Control
                                as="textarea" rows={2}
                                placeholder="Escribe la descripcion"
                                name="descripcion"
                                defaultValue={formData.descripcion}
                            />
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

function initialFormData(){
    return {
        nombre: "",
        descripcion: "",
        um: "",
        tipo: ""
    }
}

export default RegistroExistenciasAlmacenGeneral;
