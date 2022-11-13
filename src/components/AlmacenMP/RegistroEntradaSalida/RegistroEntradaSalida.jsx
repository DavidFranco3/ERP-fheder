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

function RegistroEntradaSalida(props) {
    const { setShowModal, location, history } = props;

    // Define el motivo de la salida
    const [motivoSalida, setMotivoSalida] = useState("");

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    // Para almacenar la informacion del formulario
    const [formData, setFormData] = useState(initialFormData());

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
                //console.log(e)
            })
        } catch (e) {
            //console.log(e)
        }
    }, []);

    const onSubmit = (e) => {
        e.preventDefault()


        if (!formData.materiaPrima || !formData.tipo || !formData.cantidad) {
            // console.log("Valores "+ validCount + " del form " + size(formData))
            toast.warning("Completa el formulario")
        } else {
            setLoading(true)

            try {
                // Obtener los datos de la materia prima, para recuperar todos los movimientos y almacenar uno nuevo
                listarMovimientosAlmacenMP(almacenMP.folioMP).then(response => {
                    const { data } = response;
                    // console.log(data)
                    // const final = data.concat(dataMovimiento)
                    const dataAlmacenada = data
                    // console.log(final)

                    // Validar tipo y determinar nuevas existencias
                    if (formData.tipo === "Entrada") {
                        const nuevoExistenciaStock = parseInt(almacenMP.existenciasStock) + parseInt(formData.cantidad)
                        const nuevaExistenciaOV = parseInt(almacenMP.existenciasOV) + parseInt(formData.cantidad)
                        const nuevaExistenciaTotal = parseInt(almacenMP.existenciasTotales) + parseInt(formData.cantidad)

                        const dataMovimiento = {
                            fecha: fechaActual,
                            materiaPrima: almacenMP.folioMP,
                            um: almacenMP.um,
                            tipo: formData.tipo,
                            descripcion: formData.referencia,
                            referencia: formData.referencia,
                            cantidad: formData.cantidad,
                            existenciasOV: nuevaExistenciaOV.toString(),
                            existenciasStock: nuevoExistenciaStock.toString(),
                            existenciasTotales: nuevaExistenciaTotal.toString()
                        }

                        const finalEntrada = data.concat(dataMovimiento)

                        const dataTempFinal = {
                            movimientos: finalEntrada,
                            existenciasOV: nuevaExistenciaOV.toString(),
                            existenciasStock: nuevoExistenciaStock.toString(),
                            existenciasTotales: nuevaExistenciaTotal.toString()
                        }

                        //console.log("datos finales ", movimientosFinal)

                        // console.log(dataTempFinal)
                        obtenerDatosAlmacenMPFolio(almacenMP.folioMP).then(response => {
                            const { data } = response;
                            // console.log(data)
                            const { _id } = data;
                            registraMovimientosAlmacenMP(_id, dataTempFinal).then(response => {
                                const { data } = response;
                                //console.log(response)
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
                    if (formData.tipo === "Salida") {

                        if (formData.motivoSalida === "ordenVenta") {
                            // console.log("Afecta existencias ov")
                            if (parseInt(almacenMP.existenciasOV) === 0) {
                                toast.error("Las existencias de Orden de venta no pueden satisfacer la solicitud")
                                setLoading(false)
                                setShowModal(false)
                            } else {
                                const nuevaExistenciaOV = parseInt(almacenMP.existenciasOV) - parseInt(formData.cantidad)
                                const nuevaExistenciaStock = parseInt(almacenMP.existenciasStock) - parseInt(formData.cantidad)
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
                            // Termina afectaciones en existencias de ov para salida
                        }

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

    const contenedorFechas = ({ className, children }) => {
        return (
            <div style={{ padding: "16px", background: "#216ba5", color: "#fff" }}>
                <CalendarContainer className={className}>
                    <div style={{ background: "#f0f0f0" }}>
                        Seleccione la fecha de solicitud
                    </div>
                    <div style={{ position: "relative" }}>{children}</div>
                </CalendarContainer>
            </div>
        );
    };

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
                        <Form.Group as={Col} controlId="formGridMateriaPrima" className="materiaPrima">
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
                                        value={materiaprima?.folioAlmacen + "/" + materiaprima?.folioMP + "/" + materiaprima?.nombre + "/" + materiaprima?.um + "/" + materiaprima?.existenciasOV + "/" + materiaprima?.existenciasStock + "/" + materiaprima?.existenciasTotales}
                                    >
                                        {materiaprima?.folioMP + " -- " + materiaprima?.nombre}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridUnidadMedida" className="unidadMedida">
                            <Form.Label>
                                Unidad de medida
                            </Form.Label>
                            <Form.Control
                                type="text"
                                defaultValue={almacenMP?.um}
                                disabled
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formHorizontaltipo" className="tipo">
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
                                    <option value="Entrada">Entrada</option>
                                    <option value="Salida">Salida</option>
                                </Form.Control>
                            </Col>
                        </Form.Group>

                        {
                            formData.tipo === "Salida" ?
                                (
                                    <>
                                        <Form.Group as={Col} className="mb-3 motivoSalida">
                                            <Form.Label as="legend">
                                                Motivo de salida
                                            </Form.Label>
                                            <Col sm={10}>
                                                <Form.Check
                                                    value="ordenVenta"
                                                    type="radio"
                                                    label="Para orden de venta"
                                                    name="motivoSalida"
                                                    id="motivoOrdenVenta"
                                                />
                                                <Form.Check
                                                    value="otros"
                                                    type="radio"
                                                    label="Otros motivos"
                                                    name="motivoSalida"
                                                    id="motivoOtros"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </>
                                )
                                :
                                (
                                    <>
                                    </>
                                )
                        }

                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridCantidad" className="cantidad">
                            <Form.Label>
                                Cantidad
                            </Form.Label>
                            <Form.Control
                                type="number"
                                min="0"
                                placeholder="Escribe la cantidad"
                                name="cantidad"
                                defaultValue={formData.cantidad}
                                required
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridReferencia" className="referencia">
                            <Form.Label>
                                Referencia
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={formData.tipo === "Salida" ? "No aplica" : "Escribe la orden de producción"}
                                name="referencia"
                                defaultValue={formData.referencia}
                                disabled={formData.tipo === "Salida"}
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
                                    required
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
        cantidad: ""
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

export default RegistroEntradaSalida;
