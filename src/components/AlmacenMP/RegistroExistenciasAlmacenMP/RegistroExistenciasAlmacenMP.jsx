import { useState, useEffect } from 'react';
import {Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {listarMateriaPrima} from "../../../api/materiaPrima";
import {map} from "lodash";
import "./RegistroExistenciasAlmacenMP.scss"
import {toast} from "react-toastify";
import {obtenerFolioActualAlmacenMP, registroInicialAlmacenMP} from "../../../api/almacenMP";
import {LogsInformativos} from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";

function RegistroExistenciasAlmacenMp(props) {
    const { setShowModal, location, history } = props;

    // Para controlar la animacion de carga
    const [loading, setLoading] = useState(false);

    // Almacenar el listado de materias primas
    const [listMateriasPrimas, setListMateriasPrimas] = useState(null);

    useEffect(() => {
        try {
            listarMateriaPrima().then(response => {
                const { data } = response;
                //console.log(data)
                if(!listMateriasPrimas &&data) {
                    setListMateriasPrimas(formatModelMateriasPrimas(data));
                } else {
                    const datosProductos = formatModelMateriasPrimas(data);
                    setListMateriasPrimas(datosProductos);
                }
            }).catch(e => {
                //console.log(e)
            })
        } catch (e) {
            //console.log(e)
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
        // console.log(formData)

        if(!formData.materiaPrima || !formData.descripcion || !formData.um || !formData.status){
            toast.warning("Completa el formulario")
        } else {
            setLoading(true)
            try {
                obtenerFolioActualAlmacenMP().then(response => {
                    const { data } = response;
                    // console.log(data)
                    const { noAlmacen } = data;

                    const temp = formData.materiaPrima.split("/")
                    // console.log(temp)

                    const dataTemp = {
                        folioAlmacen: noAlmacen,
                        folioMP: temp[0],
                        nombre: temp[1],
                        descripcion: formData.descripcion,
                        um: formData.um,
                        existenciasOV: "0",
                        existenciasStock: "0",
                        existenciasTotales: "0",
                        estado: formData.status
                    }

                    // console.log(dataTemp)
                    setLoading(false)
                    registroInicialAlmacenMP(dataTemp).then(response => {
                        const { data } = response;
                        const { mensaje, datos } = data;
                        toast.success(mensaje)
                        setLoading(false)
                        LogsInformativos("Se ha registrado la materia en el almacen de MP", datos)
                        history.push({
                            search: queryString.stringify(""),
                        });
                        setShowModal(false)
                    }).catch(e => {
                        console.log(e)
                    })
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
                    <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                        <Form.Label>
                            Selecciona la materia prima
                        </Form.Label>
                        <Form.Control as="select"
                                      defaultValue={formData.materiaPrima}
                                      name="materiaPrima"
                        >
                            <option>Elige una opción</option>
                            {map(listMateriasPrimas, (materiaprima, index) => (
                                <option key={index} value={materiaprima?.folio + "/" + materiaprima?.descripcion}>{ materiaprima?.folio + " -- " + materiaprima?.descripcion}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formHorizontalDescripcion">
                        <Form.Label>
                            Descripción
                        </Form.Label>
                            <Form.Control
                                as="textarea"
                                placeholder="Escribe la descripcion"
                                name="descripcion"
                                defaultValue={formData.descripcion}
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
                            Status
                        </Form.Label>
                        <Col>
                            <Form.Control
                                as="select"
                                name="status"
                                defaultValue={formData.status}
                            >
                                <option >Elige....</option>
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </Form.Control>
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
        descripcion: "",
        um: "",
        status: ""
    }
}

function formatModelMateriasPrimas(data) {
    // console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            descripcion: data.descripcion,
            tiempoespera: data.tiempoespera,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default RegistroExistenciasAlmacenMp;
