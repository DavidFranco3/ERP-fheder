import { useState, useEffect } from 'react';
import "./ModificarAlmacenes.scss"
import { listarMateriaPrima } from "../../../api/materiaPrima";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { map } from "lodash";
import { toast } from "react-toastify";
import { actualizaExistenciasAlmacenMP, obtenerFolioActualAlmacenMP, registroInicialAlmacenMP } from "../../../api/almacenMP";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";
import { obtenerDatosInspeccion } from "../../../api/inspeccionMaterial";

function ModificarAlmacenes(props) {
    const { datos, setShowModal, location, history } = props;
    const { id, nombreMP, referencia, um, lote } = datos;

    // Para controlar la animacion de carga
    const [loading, setLoading] = useState(false);

    // Almacenar el listado de materias primas
    const [listMateriasPrimas, setListMateriasPrimas] = useState(null);

    useEffect(() => {
        try {
            listarMateriaPrima().then(response => {
                const { data } = response;
                //console.log(data)
                if (!listMateriasPrimas && data) {
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
    const [formData, setFormData] = useState(initialFormData(datos));

    const onSubmit = (e) => {
        e.preventDefault()
        
        if (formData.materiaPrima || formData.unidadMedida) {
            toast.warning("Completa el formulario")
        } else {
            setLoading(true)
            try {
                const dataTemp = {
                    nombreMP: formData.materiaPrima,
                    um: formData.unidadMedida,
                }

                // console.log(dataTemp)
                actualizaExistenciasAlmacenMP(id, dataTemp).then(response => {
                    const { data } = response;
                    const { mensaje, datos } = data;
                    toast.success(mensaje)
                    LogsInformativos("Se ha modificado la materia en el almacen de MP " + formData.materiaPrima, dataTemp)
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
                    <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                        <Form.Label>
                            Selecciona la materia prima
                        </Form.Label>
                        <Form.Control as="select"
                                      defaultValue={formData.nombreMP}
                                      name="nombreMP"
                        >
                            <option>Elige una opción</option>
                            {map(listMateriasPrimas, (materiaprima, index) => (
                                <option key={index} value={materiaprima?.descripcion} selected={formData.nombreMP == materiaprima?.descripcion}>{materiaprima?.descripcion}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                            <Form.Label>
                                U.M
                            </Form.Label>
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
                        </Form.Group>
                        </Row>

                    <Form.Group as={Row} className="botones">
                        <Col>
                            <Button
                                type="submit"
                                title="Actualizar la información"
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

function initialFormData(datos) {
    const { nombreMP,  um } = datos;

    return {
        nombreMP: nombreMP,
        um: um
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

export default ModificarAlmacenes;
