import { useState, useEffect } from 'react';
import {Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {
    listarAlmacenGeneral,
    obtenerDatosAlmacenGeneral,
    obtenerDatosxFolioAlmacenGeneral,
    obtenerFolioActualAlmacenGeneral,
    registraAlmacenGeneral,
    registraMovimientosAlmacenGeneral,
} from "../../../api/almacenGeneral";
import {map, size, values} from "lodash";
import {toast} from "react-toastify";
import {LogsInformativos} from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";
import {obtenerFolioActualMovimientoAG, registraMovimientoAG} from "../../../api/movimientosAlmacenGeneral";

function RegistroEntradaSalidaAlmacenGeneral(props) {
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

    // Para almacenar el listado de producto terminado que esta en almacen
    const [listAlmacenGeneral, setListAlmacenGeneral] = useState(null);

    useEffect(() => {
        try {
            listarAlmacenGeneral().then(response => {
                const { data } = response;
                // console.log(data)
                if(!listAlmacenGeneral && data) {
                    setListAlmacenGeneral(formatModelAlmacenGeneral(data));
                } else {
                    const datosUsuarios = formatModelAlmacenGeneral(data);
                    setListAlmacenGeneral(datosUsuarios);
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


        if(!formData.materiaPrima || !formData.tipo || !formData.cantidad){
            // console.log("Valores "+ validCount + " del form " + size(formData))
            toast.warning("Completa el formulario")
        } else {
            setLoading(true)

            try {
                // Obtener los datos de la materia prima, para recuperar todos los movimientos y almacenar uno nuevo
                obtenerDatosAlmacenGeneral(articuloSeleccionado.folioAlmacen).then(response => {
                    const { data } = response;
                    // console.log(data)
                    // const final = data.concat(dataMovimiento)
                    const dataAlmacenada = data
                    // console.log(final)

                    // Validar tipo y determinar nuevas existencias
                    if(formData.tipo === "Entrada") {
                        const nuevoExistenciaStock = parseInt(articuloSeleccionado.existenciasStock) + parseInt(formData.cantidad)
                        const nuevaExistenciaOV = parseInt(articuloSeleccionado.existenciasOV) + parseInt(formData.cantidad)
                        const nuevaExistenciaTotal = parseInt(articuloSeleccionado.existenciasTotales) + parseInt(formData.cantidad)

                        const dataMovimiento = {
                            fecha: fechaActual,
                            materiaPrima: articuloSeleccionado.folioAlmacen,
                            um: articuloSeleccionado.um,
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
                        obtenerDatosxFolioAlmacenGeneral(articuloSeleccionado.folioAlmacen).then(response => {
                            const { data } = response;
                            // console.log(data)
                            const { _id } = data;
                            registraMovimientosAlmacenGeneral(_id, dataTempFinal).then(response => {
                                const { data } = response;
                                //console.log(response)
                                const { mensaje, datos } = data;
                                toast.success(mensaje)
                                setLoading(false)
                                LogsInformativos(`Se han actualizado las existencias del almacen general ${articuloSeleccionado.materiaPrima}`, datos)
                                history.push({
                                    search: queryString.stringify(""),
                                });
                                setShowModal(false)
                            })

                        })

                    }
                    if(formData.tipo === "Salida") {

                        if(formData.motivoSalida === "ordenVenta") {
                            // console.log("Afecta existencias ov")
                            if(parseInt(articuloSeleccionado.existenciasOV) === 0) {
                                toast.error("Las existencias de Orden de venta no pueden satisfacer la solicitud")
                                setLoading(false)
                                setShowModal(false)
                            } else {
                                const nuevaExistenciaOV = parseInt(articuloSeleccionado.existenciasOV) - parseInt(formData.cantidad)
                                const nuevaExistenciaStock = parseInt(articuloSeleccionado.existenciasStock) - parseInt(formData.cantidad)
                                const nuevaExistenciaTotal = parseInt(articuloSeleccionado.existenciasTotales) - parseInt(formData.cantidad)

                                const dataMovimientoSalida = {
                                    fecha: fechaActual,
                                    materiaPrima: articuloSeleccionado.folioAlmacen,
                                    um: articuloSeleccionado.um,
                                    tipo: formData.tipo,
                                    descripcion: formData.descripcion,
                                    referencia: "No aplica",
                                    cantidad: formData.cantidad,
                                    existenciasOV: nuevaExistenciaOV.toString(),
                                    existenciasStock: nuevaExistenciaStock.toString(),
                                    existenciasTotales: nuevaExistenciaTotal.toString()
                                }

                                const finalSalida = data.concat(dataMovimientoSalida)


                                const dataTempFinal = {
                                    movimientos: finalSalida,
                                    existenciasOV: nuevaExistenciaOV.toString(),
                                    existenciasStock: articuloSeleccionado.existenciasStock,
                                    existenciasTotales: nuevaExistenciaTotal.toString()
                                }

                                obtenerDatosxFolioAlmacenGeneral(articuloSeleccionado.folioMP).then(response => {
                                    const { data } = response;
                                    // console.log(data)
                                    const { _id } = data;
                                    registraMovimientosAlmacenGeneral(_id, dataTempFinal).then(response => {
                                        const { data } = response;
                                        const { mensaje, datos } = data;
                                        toast.success(mensaje)
                                        setLoading(false)
                                        LogsInformativos(`Se han actualizado las existencias del almacen general ${articuloSeleccionado.materiaPrima}`, datos)
                                        history.push({
                                            search: queryString.stringify(""),
                                        });
                                        setShowModal(false)
                                    })

                                })
                            }
                            // Termina afectaciones en existencias de ov para salida
                        }

                        if(formData.motivoSalida === "otros") {
                            // console.log("Afecta existencias stock")
                            if(parseInt(articuloSeleccionado.existenciasStock) === 0 || parseInt(formData.cantidad) > parseInt(articuloSeleccionado.existenciasStock)) {
                                toast.error("Las existencias de stock no pueden satisfacer la solicitud")
                                setLoading(false)
                                setShowModal(false)
                            } else {
                                const nuevaExistenciaStock = parseInt(articuloSeleccionado.existenciasStock) - parseInt(formData.cantidad)
                                const nuevaExistenciaOV = parseInt(articuloSeleccionado.existenciasOV) - parseInt(formData.cantidad)
                                const nuevaExistenciaTotal = parseInt(articuloSeleccionado.existenciasTotales) - parseInt(formData.cantidad)

                                const dataMovimientoSalida = {
                                    fecha: fechaActual,
                                    materiaPrima: articuloSeleccionado.folioMP,
                                    um: articuloSeleccionado.um,
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

                                obtenerDatosxFolioAlmacenGeneral(articuloSeleccionado.folioMP).then(response => {
                                    const { data } = response;
                                    // console.log(data)
                                    const { _id } = data;
                                    registraMovimientosAlmacenGeneral(_id, dataTempFinal).then(response => {
                                        const { data } = response;
                                        const { mensaje, datos } = data;
                                        toast.success(mensaje)
                                        setLoading(false)
                                        LogsInformativos(`Se han actualizado las existencias del almacen general ${articuloSeleccionado.materiaPrima}`, datos)
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

    // Para almacenar el articulo del almacen general seleccionado
    const [articuloSeleccionado, setArticuloSeleccionado] = useState([]);

    const handleAlmacenGeneral = (articulo) => {
        // console.log(articulo)
        // {materiaprima?.folioMP + "/" + materiaprima?.nombre + "/" + materiaprima?.um + "/" + materiaprima?.existenciasOV + "/" + materiaprima?.existenciasStock + "/" + materiaprima?.existenciasTotales}
        const temp = articulo.split("/")
        // console.log(temp)

        // console.log(dataTemp)
        setArticuloSeleccionado({
            folioAlmacen: temp[0],
            nombre: temp[1],
            um: temp[2],
            existenciasOV: temp[3],
            existenciasStock: temp[4],
            existenciasTotales: temp[5]
        })
    }

    return (
        <>
            <div className="contenidoFormularioPrincipal">
                <Form onChange={onChange} onSubmit={onSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridMateriaPrima" className="tipo">
                        <Form.Label>
                            Producto del almacen
                        </Form.Label>
                        <Form.Control as="select"
                                      onChange={(e) => {
                                          handleAlmacenGeneral(e.target.value)
                                      }}
                                      defaultValue={formData.materiaPrima}
                                      name="materiaPrima"
                                      required
                        >
                            <option>Elige una opción</option>
                            {map(listAlmacenGeneral, (articulo, index) => (
                                <option
                                    key={index}
                                    value={articulo?.folioAlmacen + "/" + articulo?.nombre + "/" + articulo?.um + "/" + articulo?.existenciasOV + "/" + articulo?.existenciasStock + "/" + articulo?.existenciasTotales}
                                >
                                    {articulo?.folioAlmacen + " -- " + articulo?.nombre}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridUnidadMedida" className="unidadMedida">
                        <Form.Label>
                            UM
                        </Form.Label>
                        <Form.Control
                            type="text"
                            defaultValue={articuloSeleccionado.um}
                            disabled
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formHorizontaltipo" className="tipo">
                        <Form.Label>
                            Tipo
                        </Form.Label>
                            <Form.Control
                                as="select"
                                name="tipo"
                                defaultValue={formData.tipo}
                            >
                                <option >Elige....</option>
                                <option value="Entrada">Entrada</option>
                                <option value="Salida">Salida</option>
                            </Form.Control>
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
                            name="referencia"
                            placeholder={formData.tipo === "Salida" ? "No aplica" : "Escribe la orden de producción"}
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
                                defaultValue={articuloSeleccionado.descripcion}
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
                                title="Guardar información del movimiento"
                                className="registrar"
                            >
                                {!loading ? "Registrar" : <Spinner animation="border" />}
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                variant="danger"
                                tile="Cerrar el formulario"
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
        tipo: "",
        descripcion: "",
        referencia: "",
        cantidad: ""
    }
}

function formatModelAlmacenGeneral(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folioAlmacen: data.folioAlmacen,
            nombre: data.nombre,
            descripcion: data.descripcion,
            um: data.um,
            tipo: data.tipo,
            movimientos: data.movimientos,
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

export default RegistroEntradaSalidaAlmacenGeneral;
