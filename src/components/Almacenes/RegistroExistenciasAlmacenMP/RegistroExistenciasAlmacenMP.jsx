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
import {getSucursal} from "../../../api/auth";

function RegistroExistenciasAlmacenes(props) {
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
            listarMateriaPrima(getSucursal()).then(response => {
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

        if(!formData.materiaPrima){
            toast.warning("Completa el formulario")
        } else {
            setLoading(true)
            const temp = formData.materiaPrima.split("/")
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
                        folioMP: temp[0],
                        nombreMP: temp[1],
                        um: temp[2],
                        sucursal: getSucursal(),
                        fecha: "",
                        cantidadExistencia: "0",
                        estado: "true"
                    }

                    // console.log(dataTemp)
                    registroInicialAlmacenMP(dataTemp).then(response => {
                        const { data } = response;
                        const { mensaje, datos } = data;
                        toast.success(mensaje)
                        LogsInformativos("Se ha registrado la materia en el almacen de MP " + temp[1], dataTemp)
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

    const temp = formData.materiaPrima.split("/")

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
                                <option key={index} value={materiaprima?.id +"/"+ materiaprima?.descripcion +"/"+ materiaprima?.um}>{materiaprima?.descripcion}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                            <Form.Label>
                                U.M
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="unidadMedida"
                                value={temp[2]}
                                disabled
                            />
                        </Form.Group>
                    </Row>

                    <Form.Group as={Row} className="botones">
                        <Col>
                            <Button
                                type="submit"
                                title="Guardar información del formulario"
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
            um: data.um,
            tiempoespera: data.tiempoespera,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default RegistroExistenciasAlmacenes;
