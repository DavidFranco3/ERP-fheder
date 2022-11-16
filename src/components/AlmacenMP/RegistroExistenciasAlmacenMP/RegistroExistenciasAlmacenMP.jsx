import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { listarMateriaPrima } from "../../../api/materiaPrima";
import { map } from "lodash";
import "./RegistroExistenciasAlmacenMP.scss"
import { toast } from "react-toastify";
import { obtenerFolioActualAlmacenMP, registroInicialAlmacenMP, obtenerItem } from "../../../api/almacenMP";
import { obtenerDatosInspeccion } from "../../../api/inspeccionMaterial";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";
import { set } from 'lodash';

function RegistroExistenciasAlmacenMp(props) {
    const { setShowModal, location, history } = props;

    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para controlar la animacion de carga
    const [loading, setLoading] = useState(false);

    // Para almacenar la materia prima
    const [materiaPrima, setMateriaPrima] = useState("");

    // Para almacenar la unidad de medida
    const [unidadMedida, setUnidadMedida] = useState("");

    // Para almacenar el lote 
    const [lote, setLote] = useState("");

    // Para almacenar el lote 
    const [ordenVenta, setOrdenVenta] = useState("");

    useEffect(() => {
        try {

            obtenerDatosInspeccion(formData.referencia).then(response => {
                const { data } = response;
                const { nombre, unidadMedida, lote, ordenVenta } = data;
                setMateriaPrima(nombre);
                setUnidadMedida(unidadMedida);
                setLote(lote);
                setOrdenVenta(ordenVenta)

            }).catch(e => {
                console.log(e)
            })

        } catch (e) {
            console.log(e)
        }
    }, [formData.referencia]);

    // Cancelar y cerrar el formulario
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para almacenar el folio actual
    const [itemActual, setItemActual] = useState("");

    useEffect(() => {
        try {
            obtenerItem().then(response => {
                const { data } = response;
                // console.log(data)
                const { item } = data;
                setItemActual(item)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

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

    const onSubmit = (e) => {
        e.preventDefault()
        // console.log(formData)

        if(!formData.materiaPrima || !formData.unidadMedida){
            toast.warning("Completa el formulario")
        } else {
            setLoading(true)
            try {
                obtenerFolioActualAlmacenMP().then(response => {
                    const { data } = response;
                    // console.log(data)
                    const { noAlmacen } = data;

                    //const temp = formData.materiaPrima.split("/")
                    // console.log(temp)

                    const dataTemp = {
                        item: itemActual,
                        folioAlmacen: noAlmacen,
                        nombreMP: formData.materiaPrima,
                        um: formData.unidadMedida,
                        fecha: "",
                        cantidadExistencia: "0",
                        estado: "true"
                    }

                    // console.log(dataTemp)
                    registroInicialAlmacenMP(dataTemp).then(response => {
                        const { data } = response;
                        const { mensaje, datos } = data;
                        toast.success(mensaje)
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
                                <option key={index} value={materiaprima?.descripcion}>{materiaprima?.descripcion}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                            <Form.Label>
                                U.M
                            </Form.Label>
                            <Form.Control
                                as="select"
                                name="unidadMedida"
                                defaultValue={formData.unidadMedida}
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

function initialFormData() {
    return {
        unidadMedida: "",
        materiaPrima: ""
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
