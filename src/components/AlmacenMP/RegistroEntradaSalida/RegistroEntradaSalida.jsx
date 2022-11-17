import { useState, useEffect } from 'react';
import "./RegistroEntradaSalida.scss"
import { listarMateriaPrima } from "../../../api/materiaPrima";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { map, size, values } from "lodash";
import DatePicker, { CalendarContainer } from "react-datepicker";
import {
    actualizaExistenciasAlmacenMP,
    listarAlmacenMP,
    listarMovimientosAlmacenMP,
    obtenerAlmacenMPID, obtenerDatosAlmacenMPFolio, registraMovimientosAlmacenMP
} from "../../../api/almacenMP";
import { toast } from "react-toastify";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";
import { listarProduccion } from "../../../api/produccion";
import { obtenerDatosInspeccion } from "../../../api/inspeccionMaterial";
import { obtenerDatosProduccion } from "../../../api/produccion";
import { LogTrackingActualizacion } from "../../Tracking/Gestion/GestionTracking";

function RegistroEntradaSalida(props) {
    const { setShowModal, location, history } = props;

    // Define el motivo de la salida
    const [motivoSalida, setMotivoSalida] = useState("");

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    // Para almacenar la informacion del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para almacenar el listado de productos activos
    const [listProduccion, setListProduccion] = useState(null);

    // Para traer el listado de productos activos
    useEffect(() => {
        try {
            listarProduccion().then(response => {
                const { data } = response;
                // console.log(data)

                if (!listProduccion && data) {
                    setListProduccion(formatModelProduccion(data));
                } else {
                    const datosProduccion = formatModelProduccion(data);
                    setListProduccion(datosProduccion);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    // Para cerrar el modal
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para almacenar la fecha actual
    const [fechaActual, setFechaActual] = useState(new Date);

    // Para almacenar el listado de materias primas
    const [listMateriasPrimas, setListMateriasPrimas] = useState(null);

    useEffect(() => {
        try {
            listarAlmacenMP().then(response => {
                const { data } = response;
                // console.log(data)
                if (!listMateriasPrimas && data) {
                    setListMateriasPrimas(formatModelAlmacenMateriasPrimas(data));
                } else {
                    const datosProductos = formatModelAlmacenMateriasPrimas(data);
                    setListMateriasPrimas(datosProductos);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    const onSubmit = (e) => {
        e.preventDefault()


        if (!formData.fecha || !formData.referencia || !formData.tipoOperacion || !formData.cantidad || !formData.descripcion) {
            // console.log("Valores "+ validCount + " del form " + size(formData))
            toast.warning("Completa el formulario")
        } else {
            setLoading(true)

            try {
                // Obtener los datos de la materia prima, para recuperar todos los movimientos y almacenar uno nuevo
                listarMovimientosAlmacenMP(almacenMP?.folioAlmacen).then(response => {
                    const { data } = response;
                    // console.log(data)
                    // const final = data.concat(dataMovimiento)
                    const dataAlmacenada = data
                    // console.log(final)

                    // Validar tipo y determinar nuevas existencias
                    if (formData.tipoOperacion === "Entrada") {
                        const nuevaExistenciaTotal = parseInt(almacenMP?.cantidadExistencia) + parseInt(formData.cantidad)

                        const dataMovimiento = {
                            fecha: formData.fecha,
                            materiaPrima: almacenMP.nombre,
                            um: almacenMP.um,
                            tipo: formData.tipoOperacion,
                            referencia: formData.referencia,
                            ordenVenta: ordenVenta,
                            lote: lote,
                            descripcion: formData.descripcion,
                            cantidadExistencia: formData.cantidad,
                        }

                        const finalEntrada = data.concat(dataMovimiento)

                        const dataTempFinal = {
                            fecha: formData.fecha,
                            movimientos: finalEntrada,
                            cantidadExistencia: nuevaExistenciaTotal.toString()
                        }

                        //console.log("datos finales ", movimientosFinal)

                        // console.log(dataTempFinal)
                        obtenerDatosAlmacenMPFolio(almacenMP?.folioAlmacen).then(response => {
                            const { data } = response;
                            // console.log(data)
                            const { _id } = data;
                            registraMovimientosAlmacenMP(_id, dataTempFinal).then(response => {
                                const { data } = response;

                                LogTrackingActualizacion(ordenVenta, "En almacen de materia prima", "5")
                                //console.log(response)
                                const { mensaje, datos } = data;
                                toast.success(mensaje)
                                setLoading(false)
                                LogsInformativos(`Se han actualizado las existencias de la materia prima ${data.folioAlmacen}`, datos)
                                history.push({
                                    search: queryString.stringify(""),
                                });
                                setShowModal(false)
                            })

                        })

                    }
                    if (formData.tipoOperacion === "Salida") {

                        // console.log("Afecta existencias ov")
                        if (parseInt(almacenMP?.cantidadExistencia) - parseInt(formData.cantidad) < 0) {
                            toast.warning("Las existencias en el almacen no pueden satisfacer la solicitud")
                            setLoading(false);
                        } else {
                            const nuevaExistenciaTotal = parseInt(almacenMP?.cantidadExistencia) - parseInt(formData.cantidad)

                            const dataMovimientoSalida = {
                                fecha: formData.fecha,
                                materiaPrima: almacenMP.nombreMP,
                                um: almacenMP.um,
                                tipo: formData.tipoOperacion,
                                referencia: formData.referencia,
                                ordenVenta: ordenVenta,
                                lote: formData.lote,
                                descripcion: formData.descripcion,
                                cantidadExistencia: formData.cantidad,
                            }

                            const finalSalida = data.concat(dataMovimientoSalida)


                            const dataTempFinal = {
                                fecha: formData.fecha,
                                movimientos: finalSalida,
                                cantidadExistencia: nuevaExistenciaTotal.toString()
                            }

                            obtenerDatosAlmacenMPFolio(almacenMP?.folioAlmacen).then(response => {
                                const { data } = response;
                                // console.log(data)
                                const { _id } = data;
                                registraMovimientosAlmacenMP(_id, dataTempFinal).then(response => {
                                    const { data } = response;

                                    LogTrackingActualizacion(ordenVenta, "En almacen de materia prima", "5")

                                    const { mensaje, datos } = data;
                                    toast.success(mensaje)
                                    setLoading(false)
                                    LogsInformativos(`Se han actualizado las existencias de la materia prima ${formData.referencia}`, datos)
                                    history.push({
                                        search: queryString.stringify(""),
                                    });
                                    setShowModal(false)
                                })

                            })
                        }
                        // Termina afectaciones en existencias de ov para salida

                    }

                })
            } catch (e) {
                console.log(e)
            }
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // Para almacenar la materia prima seleccionada
    const [almacenMP, setAlmacenMP] = useState([]);

    const handleMateriaPrima = (articulo) => {
        // console.log(articulo)
        // {materiaprima?.folioMP + "/" + materiaprima?.nombre + "/" + materiaprima?.um + "/" + materiaprima?.existenciasOV + "/" + materiaprima?.existenciasStock + "/" + materiaprima?.existenciasTotales}
        const temp = articulo.split("/")
        // console.log(temp)

        // console.log(dataTemp)
        setAlmacenMP({
            folioAlmacen: temp[0],
            nombreMP: temp[1],
            um: temp[2],
            cantidadExistencia: temp[3]
        })
    }

    // Para almacenar el lote 
    const [lote, setLote] = useState("");

    // Para almacenar el lote 
    const [ordenVenta, setOrdenVenta] = useState("");

    useEffect(() => {
        try {

            if (formData.tipoOperacion == "Entrada") {
                obtenerDatosInspeccion(formData.referencia).then(response => {
                    const { data } = response;
                    const { lote, ordenVenta } = data;
                    setLote(lote);
                    setOrdenVenta(ordenVenta)
                }).catch(e => {
                    console.log(e)
                })
            } else if (formData.tipoOperacion == "Salida") {
                obtenerDatosProduccion(formData.referencia).then(response => {
                    const { data } = response;
                    const { generalidades } = data;
                    setOrdenVenta(generalidades.ordenVenta)
                }).catch(e => {
                    console.log(e)
                })
            }
        } catch (e) {
            console.log(e)
        }
    }, [formData.referencia, formData.tipoOperacion]);

    return (
        <>
            <div className="contenidoFormularioPrincipal">
                <Form onChange={onChange} onSubmit={onSubmit}>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formHorizontalDescripcion">
                            <Form.Label>
                                Fecha
                            </Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="Escribe la fecha"
                                name="fecha"
                                defaultValue={formData.fecha}
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridMateriaPrima" className="materiaPrim">
                            <Form.Label>
                                Selecciona
                            </Form.Label>
                            <Form.Control as="select"
                                onChange={(e) => {
                                    handleMateriaPrima(e.target.value)
                                }}
                                defaultValue={formData.materiaPrima}
                                name="materiaPrima"
                                required
                            >
                                <option>Elige una opción</option>
                                {map(listMateriasPrimas, (materiaprima, index) => (
                                    <option
                                        key={index}
                                        value={materiaprima?.folioAlmacen + "/" + materiaprima?.nombreMP + "/" + materiaprima?.um + "/" + materiaprima?.cantidadExistencia + "/" + materiaprima?.existenciasStock + "/" + materiaprima?.existenciasTotales}
                                    >
                                        {materiaprima?.nombreMP}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                            <Form.Label>
                                U.M
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe la unidad de medida"
                                name="unidadMedida"
                                value={almacenMP?.um}
                                disabled
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} className="mb-3 motivoSalida">
                            <Form.Label>
                                Tipo operacion
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Check
                                    value="Entrada"
                                    type="radio"
                                    label="Entrada"
                                    name="tipoOperacion"
                                    id="tipoOperacion"
                                    defaultValue={formData.tipoOperacion}
                                />
                            </Col>
                            <Col sm={10}>
                                <Form.Check
                                    value="Salida"
                                    type="radio"
                                    label="Salida"
                                    name="tipoOperacion"
                                    id="tipoOperacion"
                                    defaultValue={formData.tipoOperacion}
                                />
                            </Col>
                        </Form.Group>

                        {(formData.tipoOperacion == "Entrada" &&
                            <>
                                <Form.Group as={Col} controlId="formHorizontalDescripcion">
                                    <Form.Label>
                                        Referencia
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Escribe la referencia de RM"
                                        name="referencia"
                                        defaultValue={formData.referencia}
                                    />
                                </Form.Group>
                            </>
                        )}

                        {(formData.tipoOperacion == "Salida" &&
                            <>
                                <Form.Group as={Col} controlId="formHorizontalDescripcion">
                                    <Form.Label>
                                        Referencia
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Escribe la referencia de OP"
                                        name="referencia"
                                        defaultValue={formData.referencia}
                                    />
                                </Form.Group>
                            </>
                        )}
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                            <Form.Label>
                                Lote
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe el lote"
                                name="lote"
                                value={formData.tipoOperacion == "Entrada" && formData.referencia.length >= 4 ? lote : formData.lote}
                                disabled={formData.tipoOperacion == "Entrada"}
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                            <Form.Label>
                                {formData.tipoOperacion == "Entrada" ? "Cantidad entrada" : formData.tipoOperacion == "Salida" ? "Cantidad salida" : "Cantidad"}
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={formData.tipoOperacion == "Entrada" ? "escribe la cantidad de entrada" : formData.tipoOperacion == "Salida" ? "Escribe la cantidad de salida" : "Escribe la cantidad"}
                                name="cantidad"
                                defaultValue={formData.cantidad}

                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formHorizontalDescripcion" className="descripcionMP">
                            <Form.Label>
                                Descripción
                            </Form.Label>
                            <Col>
                                <Form.Control
                                    as="textarea" rows={2}
                                    placeholder={formData.tipo === "Salida" ? "Escribe motivo de la salida" : "Escribe el motivo de la entrada"}
                                    name="descripcion"
                                    defaultValue={formData.descripcion}
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
        materiaPrima: "",
        tipo: "",
        descripcion: "",
        referencia: "",
        cantidad: "",
        fecha: "",
        referencia: "",
        tipoOperacion: "",
        referenciaOP: "",
        lote: ""
    }
}

function formatModelAlmacenMateriasPrimas(data) {
    // console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folioAlmacen: data.folioAlmacen,
            nombreMP: data.nombreMP,
            um: data.um,
            movimientos: data.movimientos,
            cantidadExistencia: data.cantidadExistencia,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

function formatModelProduccion(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            generalidades: data.generalidades,
            planeacion: data.planeacion,
            bom: data.bom,
            resultados: data.resultados,
            materiaPrima: data.materiaPrima,
            observaciones: data.observaciones,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default RegistroEntradaSalida;
