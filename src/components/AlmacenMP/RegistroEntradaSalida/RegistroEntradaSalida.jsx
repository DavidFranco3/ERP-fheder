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

function RegistroEntradaSalida(props) {
    const { setShowModal, location, history } = props;

    // Define el motivo de la salida
    const [motivoSalida, setMotivoSalida] = useState("");

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    // Para almacenar la informacion del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para almacenar la materia prima
    const [materiaPrima, setMateriaPrima] = useState("");

    // Para almacenar la unidad de medida
    const [unidadMedida, setUnidadMedida] = useState("");

    // Para almacenar el lote 
    const [lote, setLote] = useState("");

    // Para almacenar la orden de venta
    const [ordenVenta, setOrdenVenta] = useState("");

    // Para almacenar las existencias del almacen
    const [existencias, setExistencias] = useState("");

    // Para almacenar el folio del almacen
    const [folioISM, setFolioISM] = useState("");

    useEffect(() => {
        try {

            obtenerDatosAlmacenMPFolio(formData.referencia).then(response => {
                const { data } = response;
                const { nombreMP, um, lote, ordenVenta, cantidadExistencia, referencia } = data;
                setMateriaPrima(nombreMP);
                setUnidadMedida(um);
                setLote(lote);
                setOrdenVenta(ordenVenta);
                setExistencias(cantidadExistencia);
                setFolioISM(referencia);

            }).catch(e => {
                console.log(e)
            })

        } catch (e) {
            console.log(e)
        }
    }, [formData.referencia]);

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


        if (!formData.referencia || !formData.tipoOperacion || !formData.cantidad) {
            // console.log("Valores "+ validCount + " del form " + size(formData))
            toast.warning("Completa el formulario")
        } else {
            setLoading(true)

            try {
                // Obtener los datos de la materia prima, para recuperar todos los movimientos y almacenar uno nuevo
                listarMovimientosAlmacenMP(formData.referencia).then(response => {
                    const { data } = response;
                    // console.log(data)
                    // const final = data.concat(dataMovimiento)
                    const dataAlmacenada = data
                    // console.log(final)

                    // Validar tipo y determinar nuevas existencias
                    if (formData.tipoOperacion === "Entrada") {
                        const nuevaExistenciaTotal = parseInt(existencias) + parseInt(formData.cantidad)

                        const dataMovimiento = {
                            fecha: formData.fecha,
                            materiaPrima: materiaPrima,
                            um: unidadMedida,
                            tipo: formData.tipoOperacion,
                            referencia: ordenVenta,
                            ordenProduccion: folioISM,
                            lote: lote,
                            cantidadExistencia: formData.cantidad,
                        }

                        const finalEntrada = data.concat(dataMovimiento)

                        const dataTempFinal = {
                            movimientos: finalEntrada,
                            cantidadExistencia: nuevaExistenciaTotal.toString()
                        }

                        //console.log("datos finales ", movimientosFinal)

                        // console.log(dataTempFinal)
                        obtenerDatosAlmacenMPFolio(formData.referencia).then(response => {
                            const { data } = response;
                            // console.log(data)
                            const { _id } = data;
                            registraMovimientosAlmacenMP(_id, dataTempFinal).then(response => {
                                const { data } = response;
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
                        if (parseInt(existencias) - parseInt(formData.cantidad) < 0) {
                            toast.warning("Las existencias en el almacen no pueden satisfacer la solicitud")
                            setLoading(false);
                        } else {
                            const nuevaExistenciaTotal = parseInt(existencias) - parseInt(formData.cantidad)
                            
                            const temp = formData.referenciaOP.split("/")

                            const dataMovimientoSalida = {
                                fecha: formData.fecha,
                                materiaPrima: materiaPrima,
                                um: unidadMedida,
                                tipo: formData.tipoOperacion,
                                ordenProduccion: temp[0],
                                referencia: temp[1],
                                lote: lote,
                                cantidadExistencia: formData.cantidad,
                            }

                            const finalSalida = data.concat(dataMovimientoSalida)


                            const dataTempFinal = {
                                movimientos: finalSalida,
                                cantidadExistencia: nuevaExistenciaTotal.toString()
                            }

                            obtenerDatosAlmacenMPFolio(formData.referencia).then(response => {
                                const { data } = response;
                                // console.log(data)
                                const { _id } = data;
                                registraMovimientosAlmacenMP(_id, dataTempFinal).then(response => {
                                    const { data } = response;
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

                        if (formData.motivoSalida === "otros") {
                            // console.log("Afecta existencias stock")
                            if (parseInt(almacenMP.existenciasStock) === 0 || parseInt(formData.cantidad) > parseInt(almacenMP.existenciasStock)) {
                                toast.error("Las existencias de stock no pueden satisfacer la solicitud")
                                setLoading(false)
                                setShowModal(false)
                            } else {
                                const nuevaExistenciaStock = parseInt(almacenMP.existenciasStock) - parseInt(formData.cantidad)
                                const nuevaExistenciaOV = parseInt(almacenMP.existenciasOV) - parseInt(formData.cantidad)
                                const nuevaExistenciaTotal = parseInt(almacenMP.existenciasTotales) - parseInt(formData.cantidad)

                                const dataMovimientoSalida = {
                                    fecha: fechaActual,
                                    materiaPrima: almacenMP.folioMP,
                                    um: almacenMP.um,
                                    tipo: formData.tipo,
                                    descripcion: formData.descripcion,
                                    referencia: "No Aplica",
                                    cantidad: formData.cantidad,
                                    existenciasOV: nuevaExistenciaOV.toString(),
                                    existenciasStock: nuevaExistenciaStock.toString(),
                                    existenciasTotales: nuevaExistenciaTotal.toString()
                                }

                                const finalSalida = data.concat(dataMovimientoSalida)


                                const dataTempFinal = {
                                    movimientos: finalSalida,
                                    existenciasOV: nuevaExistenciaOV.toString(),
                                    existenciasStock: nuevaExistenciaStock.toString(),
                                    existenciasTotales: nuevaExistenciaTotal.toString()
                                }

                                obtenerDatosAlmacenMPFolio(almacenMP.folioMP).then(response => {
                                    const { data } = response;
                                    // console.log(data)
                                    const { _id } = data;
                                    registraMovimientosAlmacenMP(_id, dataTempFinal).then(response => {
                                        const { data } = response;
                                        const { mensaje, datos } = data;
                                        toast.success(mensaje)
                                        setLoading(false)
                                        LogsInformativos(`Se han actualizado las existencias de la materia prima ${almacenMP.materiaPrima}`, datos)
                                        history.push({
                                            search: queryString.stringify(""),
                                        });
                                        setShowModal(false)
                                    })

                                })
                            }

                            // Termina afectaciones en existencias stock para salida
                        }

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
            folioMP: temp[1],
            nombre: temp[2],
            um: temp[3],
            existenciasOV: temp[4],
            existenciasStock: temp[5],
            existenciasTotales: temp[6]
        })
    }

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

                        {(formData.tipoOperacion == "Salida" &&
                            <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                <Form.Label align="center">
                                    Referencia OP
                                </Form.Label>
                                <Form.Control
                                    as="select"
                                    name="referenciaOP"
                                    defaultValue={formData.referenciaOP}
                                >
                                    <option>Elige</option>
                                    {map(listProduccion, (produccion, index) => (
                                        <option
                                            key={index}
                                            value={produccion.folio + "/" + produccion.generalidades.ordenVenta}
                                        >
                                            {produccion.folio}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        )}
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                            <Form.Label>
                                Materia prima
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe la materia prima"
                                name="materiaPrima"
                                value={formData.referencia.length < parseInt(5) ? "" : materiaPrima}
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
                                name="unidadMedida"
                                value={formData.referencia.length < parseInt(5) ? "" : unidadMedida}
                                disabled
                            />
                        </Form.Group>
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
                                value={formData.referencia.length < parseInt(5) ? "" : lote}
                                disabled
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
        referenciaOP: ""
    }
}

function formatModelAlmacenMateriasPrimas(data) {
    // console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folioAlmacen: data.folioAlmacen,
            folioMP: data.folioMP,
            nombre: data.nombre,
            descripcion: data.descripcion,
            um: data.um,
            existenciasOV: data.existenciasOV,
            existenciasStock: data.existenciasStock,
            existenciasTotales: data.existenciasTotales,
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
