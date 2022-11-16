import { useState, useEffect } from 'react';
import "./ModificarAlmacenMP.scss"
import { listarMateriaPrima } from "../../../api/materiaPrima";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { map } from "lodash";
import { toast } from "react-toastify";
import { actualizaExistenciasAlmacenMP, obtenerFolioActualAlmacenMP, registroInicialAlmacenMP } from "../../../api/almacenMP";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";
import { obtenerDatosInspeccion } from "../../../api/inspeccionMaterial";

function ModificarAlmacenMp(props) {
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
        setLoading(true)

        if (formData.referencia.length < parseInt(4)) {
            toast.warning("Completa el formulario")
        } else {
            try {
                const dataTemp = {
                    referencia: formData.referencia,
                    nombreMP: materiaPrima == "" ? formData.nombreMP : materiaPrima,
                    lote: lote == "" ? formData.lote : lote,
                    um: unidadMedida == "" ? formData.um : unidadMedida,
                }

                // console.log(dataTemp)
                setLoading(false)
                actualizaExistenciasAlmacenMP(id, dataTemp).then(response => {
                    const { data } = response;
                    const { mensaje, datos } = data;
                    toast.success(mensaje)
                    setLoading(false)
                    LogsInformativos("Se ha modificado la materia en el almacen de MP", datos)
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

    // Para almacenar la materia prima
    const [materiaPrima, setMateriaPrima] = useState("");

    // Para almacenar la unidad de medida
    const [unidadMedida, setUnidadMedida] = useState("");

    // Para almacenar el lote 
    const [loteBuscado, setLoteBuscado] = useState("");

    // Para almacenar el lote 
    const [ordenVenta, setOrdenVenta] = useState("");

    useEffect(() => {
        try {

            obtenerDatosInspeccion(formData.referencia).then(response => {
                const { data } = response;
                const { nombre, unidadMedida, lote, ordenVenta } = data;
                setMateriaPrima(nombre);
                setUnidadMedida(unidadMedida);
                setLoteBuscado(lote);
                setOrdenVenta(ordenVenta)

            }).catch(e => {
                console.log(e)
            })

        } catch (e) {
            console.log(e)
        }
    }, [formData.referencia]);


    return (
        <>
            <div className="contenidoFormularioPrincipal">
                <Form onChange={onChange} onSubmit={onSubmit}>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formHorizontalDescripcion">
                            <Form.Label>
                                Referencia
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe la referencia"
                                name="referencia"
                                defaultValue={formData.referencia}
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                            <Form.Label>
                                Materia prima
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe la materia prima"
                                name="nombreMP"
                                value={materiaPrima == "" ? formData.nombreMP : formData.referencia.length < parseInt(4) ? "" : materiaPrima}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                            <Form.Label>
                                U.M
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe la unidad de medida"
                                name="um"
                                value={unidadMedida == "" ? formData.um : formData.referencia.length < parseInt(4) ? "" : unidadMedida}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                            <Form.Label>
                                Lote
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe el lote"
                                name="lote"
                                value={lote == "" ? formData.lote : formData.referencia.length < parseInt(4) ? "" : lote}
                                disabled
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
                                {!loading ? "Actualizar" : <Spinner animation="border" />}
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

function initialFormData(datos) {
    const { referencia, nombreMP, lote, um } = datos;

    return {
        referencia: referencia,
        nombreMP: nombreMP,
        lote: lote,
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

export default ModificarAlmacenMp;
